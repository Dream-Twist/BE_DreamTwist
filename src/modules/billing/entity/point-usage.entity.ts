/**
File Name : point-usage.entity
Description : 포인트 개별 사용내역 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.04  이유민      Created     
2024.08.04  이유민      Modified    포인트 개별 내역 추가
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('point_usage')
export class PointUsage extends CommonEntity {
    @Column()
    user_id: number;

    @Column()
    points: number;

    @Column()
    source_id: number;
}
