/**
File Name : fairytale-views.entity
Description : 동화 조회수 Entity
Author : 강민규

History
Date        Author      Status      Description
2024.08.03  강민규      Created     
2024.08.03  강민규      Modified    
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('views')
export class Views extends CommonEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'fairytale_id' })
    fairytaleId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
