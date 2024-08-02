/**
File Name : point-rates.entity
Description : 포인트 상점 관련 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('point_rates')
export class PointRates {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    points: number;

    @Column()
    amount: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
