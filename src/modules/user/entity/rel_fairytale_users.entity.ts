/**
File Name : rel_fairytale_users.entity
Description : 중간 테이블 Entity - 동화 스토리, 회원
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    중간 테이블 생성
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('rel_fairytale_users')
export class RelFairytaleUsers {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fairytaleId: number;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
