/**
File Name : fairytale-views.entity
Description : 동화 조회 Entity
Author : 강민규

History
Date        Author      Status      Description
2024.07.29  강민규      Created     
2024.07.29  강민규      Modified    조회 수  
*/

import { Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, Column } from 'typeorm';
import { Fairytale } from './fairytale.entity';
import { User } from 'src/modules/user/entity/user.entity';

@Entity('views')
export class Views {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => Fairytale)
    fairytale: Fairytale;

    // @ManyToOne(() => User, user => user.fairytales) // ★
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
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

    // @ManyToOne(() => Fairytale)
    fairytale: Fairytale;

    // @ManyToOne(() => User, user => user.fairytales) // ★
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
