/**
File Name : point.entity
Description : 포인트 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('point')
export class Point {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    points: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
