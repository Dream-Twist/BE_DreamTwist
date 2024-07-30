/**
File Name : fairytale-img.entity
Description : 동화 이미지 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.26  박수정      Created     
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
*/

import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Fairytale } from './fairytale.entity';

@Entity('fairytale_img')
export class FairytaleImg {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Fairytale, fairytale => fairytale.image)
    fairytale: Fairytale;

    @Column()
    creationWay: string;

    @Column()
    path: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
