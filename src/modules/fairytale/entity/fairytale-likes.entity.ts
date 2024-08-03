/**
File Name : fairytale-likes.entity
Description : 동화 좋아요 Entity
Author : 강민규

History
Date        Author      Status      Description
2024.07.29  강민규      Created     
2024.07.29  강민규      Modified    좋아요 수  
*/

import { Entity, Column, BaseEntity } from 'typeorm';

@Entity('likes')
export class Likes extends BaseEntity {
    @Column({ name: 'fairytale_id' })
    fairytale: number;

    @Column({ name: 'user_id' })
    userId: number;
}
