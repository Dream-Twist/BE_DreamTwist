/**
File Name : fairytale-likes.entity
Description : 동화 좋아요 Entity
Author : 강민규

History
Date        Author      Status      Description
2024.07.29  강민규      Created     
2024.07.29  강민규      Modified    좋아요 수  
2024.08.03  박수정      Modified    공통 필드 Entity 생성
*/

import { CommonEntity } from 'shared/entities/base.entity';
import { Entity, Column } from 'typeorm';

@Entity('fairytale_like')
export class FairytaleLike extends CommonEntity {
    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'fairytale_id' })
    fairytaleId: number;
}
