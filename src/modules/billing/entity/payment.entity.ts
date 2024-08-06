/**
File Name : payment.entity
Description : 결제 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.03  박수정      Modified    공통 필드 Entity 생성
2024.08.05  이유민      Modified    결제 전체 수정
*/

import { Entity, Column, PrimaryColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
    @PrimaryColumn()
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @Column()
    user_id: number;

    @Column()
    amount: number;

    @Column()
    method: string;

    @Column()
    status: string;
}
