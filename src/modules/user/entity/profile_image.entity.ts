/**
File Name : profile_image.entity
Description : 회원 프로필 이미지 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    회원 프로필 이미지 기능 추가
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('profile_image')
export class ProfileImage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
