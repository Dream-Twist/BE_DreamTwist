/**
File Name : payment.entity
Description : 결제 Entity
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    payment_key: string;

    @Column()
    order_id: string;

    @Column()
    amount: number;

    @Column()
    method: string;

    @Column()
    status: string;

    @Column()
    order_name: string;

    @Column()
    user_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;
}
