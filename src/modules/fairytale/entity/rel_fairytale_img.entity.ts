/**
File Name : rel_fairytale_img.entity
Description : 중간 테이블 Entity - 동화 스토리, 동화 이미지
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    중간 테이블 생성
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('rel_fairytale_img')
export class RelFairytaleImg {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fairytaleId: number;

    @Column()
    fairytaleImgId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
