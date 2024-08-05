/**
File Name : payment.repository
Description : 결제 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Payment } from 'src/modules/billing/entity/payment.entity';

@Injectable()
export class PaymentRepository extends Repository<Payment> {
    constructor(private dataSource: DataSource) {
        super(Payment, dataSource.createEntityManager());
    }

    async createPayment(PaymentData: Partial<Payment>): Promise<Payment> {
        const payment = this.create(PaymentData);
        return this.save(payment);
    }

    async cancelPayment(payment_key: string): Promise<object> {
        const payment = await this.findOne({ where: { payment_key } });
        payment.status = 'CANCELED';
        this.save(payment);

        return { message: '결제가 취소되었습니다.' };
    }

    async findPaymentByUserId(user_id: number): Promise<Payment[]> {
        const res = await this.dataSource
            .getRepository(Payment)
            .createQueryBuilder('payment')
            .select([
                'payment.id',
                'payment.payment_key',
                'payment.amount',
                'payment.method',
                'payment.status',
                'payment.order_name',
                'payment.created_at',
            ])
            .where('payment.user_id = :user_id', { user_id })
            .orderBy('payment.created_at', 'ASC')
            .getMany();

        return res;
    }

    async findPaymentByPaymentKey(payment_key: string): Promise<Payment> {
        const res = await this.dataSource
            .getRepository(Payment)
            .createQueryBuilder('payment')
            .select(['payment.id', 'payment.status'])
            .where('payment.payment_key = :payment_key', { payment_key })
            .getOne();

        return res;
    }
}
