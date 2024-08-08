/**
File Name : point-history.entity
Description : 포인트 내역 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
2024.08.03  박수정      Modified    공통 필드 Entity 생성
2024.08.04  이유민      Modified    컬럼 추가
2024.08.05  이유민      Modified    결제 전체 수정
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('points_history')
export class PointHistory extends CommonEntity {
    @Column()
    user_id: number;

    @Column()
    points: number;

    @Column()
    description: string;

    @Column({ name: 'payment_id', nullable: true })
    payment_id: string;

    @Column()
    remaining_balance: number;
}
