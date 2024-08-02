/**
File Name : billing.service
Description : 상품 결제 Service
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { BillingDTO } from 'src/modules/billing/billing.dto';
import { OrderRepository } from 'src/modules/billing/repository/order.repository';
import { PaymentRepository } from 'src/modules/billing/repository/payment.repository';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
import { PointRepository } from 'src/modules/billing/repository/point.repository';
import { PointRatesRepository } from 'src/modules/billing/repository/point-rates.repository';

@Injectable()
export class BillingService {
    private readonly tossUrl: string;
    private readonly secretKey: string;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        @InjectRepository(OrderRepository)
        private readonly orderRepository: OrderRepository,
        @InjectRepository(PaymentRepository)
        private readonly paymentRepository: PaymentRepository,
        @InjectRepository(PointHistoryRepository)
        private readonly pointHistoryRepository: PointHistoryRepository,
        @InjectRepository(PointRepository)
        private readonly pointRepository: PointRepository,
        @InjectRepository(PointRatesRepository)
        private readonly pointRatesRepository: PointRatesRepository,
    ) {
        this.secretKey = this.configService.get('TOSS_SECRET_KEY');
        this.tossUrl = this.configService.get('TOSS_API_URL');
    }

    async tossPayment(billingDTO: BillingDTO) {
        const { orderId, amount, paymentKey } = billingDTO;

        try {
            // 결제 승인
            const response = await firstValueFrom(
                this.httpService.post(
                    this.tossUrl,
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

            // 가격에 해당하는 포인트 검색
            const pointsByAmount = await this.pointRatesRepository.findPointsByAmount(amount);
            if (!pointsByAmount) {
                throw new NotFoundException(`${amount}원의 포인트 상품이 없습니다.`);
            }

            // 해당 사용자의 현재 포인트 검색
            // const pointsByUser = await this.pointRepository.findPointByUserId(user_id);

            // DB 저장
            await Promise.all([
                // 주문 테이블 저장
                this.orderRepository.createOrder({
                    order_id: response.data.orderId,
                    total_amount: response.data.totalAmount,
                    order_name: response.data.orderName,
                    user_id,
                }),

                // 결제 테이블 저장
                this.paymentRepository.createPayment({
                    payment_key: response.data.paymentKey,
                    order_id: response.data.orderId,
                    amount: response.data.totalAmount,
                    method: response.data.method,
                    status: response.data.status,
                    order_name: response.data.orderName,
                    user_id,
                }),

                // 포인트 내역 테이블 저장
                this.pointHistoryRepository.createPointHistory({
                    user_id,
                    points: pointsByAmount.points,
                    description: response.data.orderName,
                }),

                // 유저 포인트 테이블 저장(수정)
                // this.pointRepository.createPoint({
                //     user_id,
                //     points: pointsByUser.points + pointsByAmount.points,
                // }),
                this.pointRepository.updatePointByUserId(user_id, pointsByAmount.points),
            ]);

            return {
                title: '결제 성공',
                body: response.data,
            };
        } catch (e) {
            // 아직 결제 에러날 경우는 작성하지 않음
            console.log('토스 페이먼츠 에러 코드', e);
        }
    }
}
