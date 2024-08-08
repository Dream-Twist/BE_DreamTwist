/**
File Name : fairytale-comments.repository
Description : 동화 댓글 조회, 생성, 수정, 삭제 Repository
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created
2024.08.06  원경혜      Modified    동화 댓글 조회 기능 추가
2024.08.07  원경혜      Modified    동화 댓글 CRUD 기능 추가
*/

import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';

@Injectable()
export class CommentsRepository extends Repository<Comments> {
    constructor(private readonly entityManager: EntityManager) {
        super(Comments, entityManager);
    }
    /*
    동화 댓글 조회
    예외 및 에러 처리 추가 예정
    */

    // 댓글 조회 - fairytaleId 필터링
    async getCommentsByFairytaleId(fairytaleId: number): Promise<Comments[]> {
        const comments = await this.createQueryBuilder('comments')
            .select()
            .where('comments.fairytaleId = :fairytaleId', { fairytaleId })
            .orderBy('comments.createdAt', 'DESC')
            .getMany();

        return comments;
    }

    // 댓글 조회 - userId 필터링
    async getCommentsByUserId(userId: number): Promise<Comments[]> {
        const comments = await this.createQueryBuilder('comments')
            .select('comments.content')
            .where('comments.userId = :userId', { userId })
            .orderBy('comments.createdAt', 'DESC')
            .getMany();

        return comments;
    }

    // 동화 댓글 생성
    // 대댓글 기능 추가 시, entityManager로 수정
    async createComments(newComments: Partial<Comments>): Promise<Comments> {
        const comments = await this.create(newComments);
        return this.save(comments);
    }

    // 동화 댓글 수정
    async updateComments(id: number, newComments: Partial<Comments>): Promise<Comments> {
        const currentTime = new Date();
        const updateComments = {
            ...newComments,
            updatedAt: currentTime,
        };

        await this.update(id, updateComments);
        return this.findOneBy({ id });
    }

    // 동화 댓글 삭제
    async softDeleteComments(id: number): Promise<Comments> {
        const currentTime = new Date();
        const comments = await this.findOne({
            where: {
                id,
                deletedAt: null,
            },
        });
        if (!comments) {
            return null;
        }

        comments.deletedAt = currentTime;
        comments.updatedAt = currentTime;
        await this.save(comments);
        return comments;
    }
}
