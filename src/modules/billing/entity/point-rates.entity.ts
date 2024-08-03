/**
File Name : point-rates.entity
Description : 포인트 상점 관련 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Entity, Column, BaseEntity } from 'typeorm';

@Entity('point_rates')
export class PointRates extends BaseEntity {
    @Column()
    points: number;

    @Column()
    amount: number;
}
