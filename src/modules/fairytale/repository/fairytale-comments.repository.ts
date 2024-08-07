/**
File Name : fairytale-comments.repository
Description : 동화 댓글 Repository
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created
2024.08.06  원경혜      Modified    동화 댓글 조회 기능 추가
*/

// import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, EntityManager, EntityRepository } from 'typeorm';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';

@EntityRepository(Comments)
export class CommentsRepository extends Repository<Comments> {
    constructor(private readonly entityManager: EntityManager) {
        super(Comments, entityManager);
    }
    /*
    동화 댓글 조회 - 동화책 번호로 조회 & 특정 유저로 조회 (쿼리빌더 사용)
    예외 및 에러 처리 추가
    */

    // 댓글 조회 - fairytaleId 필터링
    async getCommentsByFairytaleId(fairytaleId: number, entityManager: EntityManager): Promise<Comments[]> {
        const comments = await entityManager
            .getRepository(Comments)
            .createQueryBuilder('comments')
            .select('comments.content')
            .where('comments.fairytaleId = :fairytaleId', { fairytaleId })
            .orderBy('comments.createdAt', 'DESC')
            .getMany();

        return comments;
    }

    // 댓글 조회 - userId 필터링
    async getCommentsByUserId(userId: number, entityManager: EntityManager): Promise<Comments[]> {
        const comments = await entityManager
            .getRepository(Comments)
            .createQueryBuilder('comments')
            .select('comments.content')
            .where('comments.userId = :userId', { userId })
            .orderBy('comments.createdAt', 'DESC')
            .getMany();

        return comments;
    }

    // 동화 댓글 생성 -> 2번 동화에서 댓글 생성
    async createComments(newComments: Comments): Promise<Comments> {
        return this.save(newComments);
        // return this.entityManager.save(Comments, newComments);
    }

    // 동화 댓글 수정
    // async updateComments

    // 동화 댓글 삭제
}

// const res = await entityManager
//     .getRepository(Comments)
//     .createQueryBuilder('comments')
//     .select()
//     .where('comments.fairytaleId = :fairytaleId', { fairytaleId })
//     .getMany();

// return res;
