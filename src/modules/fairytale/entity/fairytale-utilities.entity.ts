/**
File Name : fairytale-utilities.entity
Description : 동화 유틸리티 Entity
Author : 강민규

History
Date        Author      Status      Description
2024.07.29  강민규      Created     
2024.07.29  강민규      Modified    조회 수 좋아요 수   
*/

import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Column,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { Fairytale } from './fairytale.entity';

@Entity('views')
export class Views {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    views: number;
    // initially 0

    @ManyToOne(() => Fairytale)
    fairytale: Fairytale;

    @ManyToOne(() => User, user => user.fairytales)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

@Entity('likes')
export class Likes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    likes: number;
    // initially 0

    @ManyToOne(() => Fairytale)
    fairytale: Fairytale;

    @ManyToOne(() => User, user => user.fairytales)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
