/**
File Name : billing.module
Description : 상품 결제 Module
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.02  이유민      Modified    포인트 기능 추가
2024.08.05  이유민      Modified    결제 전체 수정
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { BillingController } from 'src/modules/billing/billing.controller';
import { BillingService } from 'src/modules/billing/billing.service';
import { OrderRepository } from 'src/modules/billing/repository/order.repository';
import { Order } from 'src/modules/billing/entity/order.entity';
import { PaymentRepository } from 'src/modules/billing/repository/payment.repository';
import { Payment } from 'src/modules/billing/entity/payment.entity';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
import { PointHistory } from 'src/modules/billing/entity/point-history.entity';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([Order, Payment, PointHistory])],
    controllers: [BillingController],
    providers: [BillingService, OrderRepository, PaymentRepository, PointHistoryRepository],
    exports: [BillingService],
})
export class BillingModule {}
