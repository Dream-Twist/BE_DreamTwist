/**
File Name : fairytale-content.entity
Description : 동화 스토리 내용 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.20  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

import { User } from 'src/modules/user/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('fairytale_content')
export class FairytaleContent {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.fairytales)
    user: User;

    @Column('text')
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
