/**
File Name : point-rates.entity
Description : 포인트 상점 관련 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('point_rates')
export class PointRates extends CommonEntity {
    @Column()
    points: number;

    @Column()
    amount: number;
}
