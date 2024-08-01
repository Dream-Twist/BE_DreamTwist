/**
File Name : fairytale.entity
Description : 동화 스토리 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.08.01  박수정      Modified    Entity 변경
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('fairytale')
export class Fairytale {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    theme: string;

    @Column('json')
    content: JSON;

    @Column({ type: 'timestamp', nullable: true })
    privatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
