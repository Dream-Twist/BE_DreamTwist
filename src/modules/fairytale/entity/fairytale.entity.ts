/**
File Name : fairytale.entity
Description : 동화 스토리 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { FairytaleContent } from './fairytale-content.entity';

@Entity('fairytale')
export class Fairytale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.fairytales)
    user: User;

    @Column()
    title: string;

    @Column()
    labeling: string;

    @OneToOne(() => FairytaleContent)
    @JoinColumn()
    content: FairytaleContent;

    @Column()
    isPublic: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
