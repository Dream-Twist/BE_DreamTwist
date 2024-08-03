/**
File Name : order.entity
Description : 주문 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
*/

import { Entity, Column, BaseEntity } from 'typeorm';

@Entity('order')
export class Order extends BaseEntity {
    @Column()
    order_id: string;

    @Column()
    total_amount: number;

    @Column()
    order_name: string;

    @Column()
    user_id: number;
}
