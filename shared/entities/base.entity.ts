/**
File Name : base.entity
Description : 공통 필드 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.08.03  박수정      Created     
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { PrimaryGeneratedColumn, CreateDateColumn, Column, DeleteDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
