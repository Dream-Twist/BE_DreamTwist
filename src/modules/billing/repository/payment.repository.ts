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
}
