/**
File Name : user.entity
Description : 회원 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    회원 기능 추가
2024.08.01  박수정      Modified    Entity 변경
2024.08.02  박수정      Modified    DB 컬럼명 수정
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'profile_image_id' })
    profileImageId: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    nickname: string;

    @Column({ name: 'is_online' })
    isOnline: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
