/**
File Name : fairytale-forbidden.entity
Description : 금지어 설정 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.24  박수정      Created
2024.07.24  박수정      Modified    금지어 설정 기능 추가
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('fairytale_forbidden_word')
export class ForbiddenWord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    forbidden_word: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
