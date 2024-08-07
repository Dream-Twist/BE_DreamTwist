/**
File Name : payment.repository
Description : 결제 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.05  이유민      Modified    결제 전체 수정
2024.08.06  이유민      Modified    트랜잭션 관리 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { Payment } from 'src/modules/billing/entity/payment.entity';

@Injectable()
export class PaymentRepository extends Repository<Payment> {
    async createPayment(PaymentData: Partial<Payment>, entityManager: EntityManager): Promise<Payment> {
        const payment = entityManager.create(Payment, PaymentData);
        return await entityManager.save(payment);
    }

    async cancelPayment(id: string, entityManager: EntityManager): Promise<object> {
        const payment = await entityManager.findOne(Payment, { where: { id } });
        payment.status = 'CANCELED';
        await entityManager.save(payment);

        return { message: '결제가 취소되었습니다.' };
    }

    async findPaymentByUserId(user_id: number, entityManager: EntityManager): Promise<Payment[]> {
        const res = await entityManager
            .getRepository(Payment)
            .createQueryBuilder('payment')
            .select(['payment.id', 'payment.amount', 'payment.method', 'payment.status', 'payment.createdAt'])
            .where('payment.user_id = :user_id', { user_id })
            .orderBy('payment.createdAt', 'ASC')
            .getMany();

        return res;
    }

    async findPaymentById(id: string, entityManager: EntityManager): Promise<Payment> {
        const res = await entityManager
            .getRepository(Payment)
            .createQueryBuilder('payment')
            .select(['payment.id', 'payment.status', 'payment.user_id'])
            .where('payment.id = :id', { id })
            .getOne();

        return res;
    }
}
