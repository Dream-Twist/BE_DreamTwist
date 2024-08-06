/**
File Name : billing.service
Description : 상품 결제 Service
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.02  이유민      Modified    포인트 기능 추가
2024.08.04  이유민      Modified    결제 취소 추가
2024.08.04  이유민      Modified    결제 내역 조회 추가
2024.08.05  이유민      Modified    결제 전체 수정
*/

import {
    Injectable,
    UnprocessableEntityException,
    ForbiddenException,
    InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { BillingDTO, CancelDTO } from 'src/modules/billing/billing.dto';
import { OrderRepository } from 'src/modules/billing/repository/order.repository';
import { PaymentRepository } from 'src/modules/billing/repository/payment.repository';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
// 트랜잭션 관리 시도
// import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class BillingService {
    private readonly tossUrl: string;
    private readonly secretKey: string;

    constructor(
        private readonly httpService: HttpService,
        // private readonly dataSource: DataSource, // 시도
        private configService: ConfigService,
        @InjectRepository(OrderRepository)
        private readonly orderRepository: OrderRepository,
        @InjectRepository(PaymentRepository)
        private readonly paymentRepository: PaymentRepository,
        @InjectRepository(PointHistoryRepository)
        private readonly pointHistoryRepository: PointHistoryRepository,
    ) {
        this.secretKey = this.configService.get('TOSS_SECRET_KEY');
        this.tossUrl = this.configService.get('TOSS_API_URL');
    }

    // 결제
    async tossPayment(billingDTO: BillingDTO) {
        // const queryRunner = this.dataSource.create;

        const { orderId, amount, paymentKey, addPoint } = billingDTO;
        try {
            // 결제 승인
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.tossUrl}/confirm`,
                    {
                        paymentKey,
                        orderId,
                        amount,
                    },
                    {
                        headers: {
                            Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );
            const user_id = 2; // 임시
            // DB 저장
            await Promise.all([
                // 결제 테이블 저장
                this.paymentRepository.createPayment({
                    id: response.data.paymentKey,
                    amount: response.data.totalAmount,
                    method: response.data.method,
                    status: response.data.status,
                    user_id,
                }),
                // 주문 테이블 저장
                this.orderRepository.createOrder({
                    id: response.data.orderId,
                    order_name: response.data.orderName,
                    user_id,
                }),
                // 포인트 내역 테이블 저장
                this.pointHistoryRepository.createPointHistory({
                    user_id,
                    points: addPoint,
                    description: response.data.orderName,
                    payment_id: response.data.paymentKey,
                    remaining_balance: addPoint,
                }),
            ]);
            return {
                title: '결제 성공',
                orderName: response.data.orderName,
                orderId: response.data.orderId,
                approvedAt: response.data.approvedAt.substring(0, 10),
            };
        } catch (e) {
            throw new InternalServerErrorException('결제 처리 중 오류가 발생했습니다.');
        }
    }

    // 결제 취소
    async cancelPayment(cancelDTO: CancelDTO): Promise<object> {
        const { id, cancelReason } = cancelDTO;
        const user_id = 2; // 임시

        try {
            const payment = await this.paymentRepository.findPaymentById(id);

            if (payment.user_id !== user_id) {
                throw new ForbiddenException('접근할 수 없습니다.');
            }

            const history = await this.pointHistoryRepository.findPointHistoryByPaymentId(id);

            if (payment.status !== 'DONE' || history[0].points !== history[0].remaining_balance) {
                throw new UnprocessableEntityException('결제 취소가 불가능한 결제 내역입니다.');
            }

            // 결제 취소
            await firstValueFrom(
                this.httpService.post(
                    `${this.tossUrl}/${id}/cancel`,
                    { cancelReason },
                    {
                        headers: {
                            Authorization: `Basic ${Buffer.from(`${this.secretKey}:`).toString('base64')}`,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );

            const res = await this.paymentRepository.cancelPayment(id);
            await this.pointHistoryRepository.updatePointHistoryByPaymentId(id, `${history[0].description} 취소`);
            return res;
        } catch (e) {
            throw e;
        }
    }

    // 결제내역 확인
    async findPaymentByUserId(user_id: number): Promise<object> {
        const payments = await this.paymentRepository.findPaymentByUserId(user_id);

        const historyRecords = [];
        for (const payment of payments) {
            const history = await this.pointHistoryRepository.findPointHistoryByPaymentId(payment.id);

            historyRecords.push({
                ...history[0],
                isRefundable: history[0].points === history[0].remaining_balance ? 'T' : 'F',
            });
        }

        const refundMap = historyRecords.reduce((map, record) => {
            map[record.payment_id] = { isRefundable: record.isRefundable, description: record.description };
            return map;
        }, {});

        const updatedPayments = payments.map(payment => {
            const refundInfo = refundMap[payment.id];
            const updateDescription = refundInfo?.description.replace('취소', '').trim(); // 취소 제거

            return {
                ...payment,
                createdAt: payment.createdAt.toISOString().substring(0, 10),
                description: updateDescription,
                isRefundable: refundInfo?.isRefundable === 'T' && payment.status === 'DONE' ? 'T' : 'F',
            };
        });

        return updatedPayments;
    }
}
