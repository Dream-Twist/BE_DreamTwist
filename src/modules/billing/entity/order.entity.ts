/**
File Name : order.entity
Description : 주문 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('orders')
export class Order extends CommonEntity {
    @Column()
    order_id: string;

    @Column()
    total_amount: number;

    @Column()
    order_name: string;

    @Column()
    user_id: number;
}
