/**
File Name : fairytale-like.repository
Description : 동화 좋아요 Repository
Author : 박수정

History
Date        Author      Status      Description
2024.08.07  박수정      Created     
2024.08.07  박수정      Modified    나의 동화 좋아요 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FairytaleLike } from 'src/modules/fairytale/entity/fairytale-likes.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FairytaleLikeRepository {
    constructor(
        @InjectRepository(FairytaleLike)
        private readonly fairytaleLikeRepository: Repository<FairytaleLike>,
    ) {}

    async getMyLikes(userId: number): Promise<FairytaleLike[]> {
        return this.fairytaleLikeRepository
            .createQueryBuilder('fl')
            .leftJoin('fairytale', 'f', 'f.id = fl.fairytale_id')
            .leftJoin('fairytale_img', 'fi', 'fi.fairytale_id = f.id')
            .leftJoin('users', 'users', 'f.user_id = users.id')
            .select([
                'f.id AS id',
                'f.title AS title',
                'f.created_at AS createdAt',
                'f.privated_at AS privatedAt',
                'users.nickname AS nickname',
                'JSON_EXTRACT(fi.path, "$.\\"0\\"") AS coverImage',
            ])
            .where('fl.userId = :userId', { userId })
            .andWhere('f.title IS NOT NULL')
            .getRawMany();
    }
}
