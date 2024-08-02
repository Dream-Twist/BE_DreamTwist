/**
File Name : fairytale-likes.entity
Description : 동화 좋아요 Entity
Author : 강민규

History
Date        Author      Status      Description
2024.07.29  강민규      Created     
2024.07.29  강민규      Modified    좋아요 수  
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
import { Fairytale } from './fairytale.entity';
import { User } from 'src/modules/user/entity/user.entity';

@Entity('likes')
export class Likes {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Fairytale)
    fairytale: Fairytale;

    @ManyToOne(() => User)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
