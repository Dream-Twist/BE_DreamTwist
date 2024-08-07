/**
File Name : order.repository
Description : 주문 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.06  이유민      Modified    트랜잭션 관리 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { Order } from 'src/modules/billing/entity/order.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
    async createOrder(OrderData: Partial<Order>, entityManager: EntityManager): Promise<Order> {
        const order = entityManager.create(Order, OrderData);
        return await entityManager.save(order);
    }
}
