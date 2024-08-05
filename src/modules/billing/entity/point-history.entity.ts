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
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('point_history')
export class PointHistory extends CommonEntity {
    @Column()
    user_id: number;

    @Column()
    points: number;

    @Column()
    description: string;

    @Column()
    payment_id: number;

    @Column()
    remaining_balance: number;
}
