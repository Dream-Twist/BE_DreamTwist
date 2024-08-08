/**
File Name : fairytale-comments.entity
Description : 동화 댓글 Entity
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created     
2024.08.05  원경혜      Modified     동화 댓글 생성 기능 추가
2024.08.08  원경혜      Modified     fairytaleId 인덱싱 추가
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity('fairytale_comments')
export class Comments extends CommonEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'fairytale_id' })
    @Index()
    fairytaleId: number;

    @Column({ type: 'text' })
    content: string;
}
