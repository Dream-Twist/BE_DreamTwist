/**
File Name : order.repository
Description : 주문 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Order } from 'src/modules/billing/entity/order.entity';

@Injectable()
export class OrderRepository extends Repository<Order> {
    constructor(private dataSource: DataSource) {
        super(Order, dataSource.createEntityManager());
    }

    async createOrder(OrderData: Partial<Order>): Promise<Order> {
        const order = this.create(OrderData);
        return this.save(order);
    }
}
