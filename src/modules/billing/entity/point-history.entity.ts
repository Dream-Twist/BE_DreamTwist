/**
File Name : point-history.entity
Description : 포인트 내역 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Entity, Column, BaseEntity } from 'typeorm';

@Entity('point_history')
export class PointHistory extends BaseEntity {
    @Column()
    user_id: number;

    @Column()
    points: number;

    @Column()
    description: string;
}
