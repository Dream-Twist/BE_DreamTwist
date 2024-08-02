/**
File Name : fairytale-utilities.entity
Description : 동화 유틸리티 Entity
Author : 강민규

History
Date        Author      Status      Description
2024.07.29  강민규      Created     
2024.07.29  강민규      Modified    조회 수 좋아요 수   
2024.08.02  박수정      Modified    DB 컬럼명 수정
*/

import { Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, Column } from 'typeorm';

@Entity('views')
export class Views {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'fairytale_id' })
    fairytaleId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}

@Entity('likes')
export class Likes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    likes: number;

    @Column({ name: 'fairytale_id' })
    fairytaleId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
