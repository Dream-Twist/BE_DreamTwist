/**
File Name : payment.entity
Description : 결제 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('payment')
export class Payment extends CommonEntity {
    @Column()
    payment_key: string;

    @Column()
    order_id: string;

    @Column()
    amount: number;

    @Column()
    method: string;

    @Column()
    status: string;

    @Column()
    order_name: string;

    @Column()
    user_id: number;
}
