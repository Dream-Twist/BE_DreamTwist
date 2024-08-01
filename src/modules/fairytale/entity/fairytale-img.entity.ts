/**
File Name : fairytale-img.entity
Description : 동화 이미지 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.26  박수정      Created     
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
2024.08.01  박수정      Modified    Entity 변경
*/

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fairytale_img')
export class FairytaleImg {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: ['default', 'upload', 'ai', 'palette', 'mix'],
        default: 'default',
    })
    creationWay: string;

    @Column('json')
    path: JSON;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
