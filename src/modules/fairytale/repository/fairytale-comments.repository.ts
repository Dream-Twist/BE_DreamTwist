/**
File Name : fairytale-comments.repository
Description : 동화 댓글 조회, 생성, 수정, 삭제 Repository
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created
2024.08.06  원경혜      Modified    동화 댓글 조회 기능 추가
2024.08.07  원경혜      Modified    동화 댓글 CRUD 기능 추가
2024.08.07  박수정      Modified    나의 동화 댓글 기능 추가
2024.08.08  원경혜      Modified    동화 댓글 조회 - 유저 닉네임, 유저 네임, 프로필 이미지 불러오기 연결
2024.08.09  원경혜      Modified    동화 댓글 전체 조회 분리 및 페이지네이션 추가 
2024.08.19  원경혜      Modified    동화 댓글 조회 - CASE문 삭제, service층으로 로직 이동
*/

import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';

export interface rawCommentsType {
    comments_id: number;
    comments_content: string;
    comments_created_at: Date;
    comments_updated_at: Date;
    comments_deleted_at?: Date;
    comments_userId: number;
    comments_fairytale_id: number;
    user_name: string;
    user_nickname: string;
    user_deleted_at?: Date;
    img_path?: string;
    img_deleted_at?: Date;
}

export interface newComments {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    userId: number;
    fairytaleId: number;
    name: string;
    nickname: string;
    userDeletedAt?: Date;
    profileImgURL?: string;
    profileImgDeletedAt?: Date;
}

@Injectable()
export class CommentsRepository extends Repository<Comments> {
    constructor(private readonly entityManager: EntityManager) {
        super(Comments, entityManager);
    }
    /*
    동화 댓글 조회
    */

    // 전체 댓글 정보 조회
    async getTotalComments(fairytaleId: number): Promise<newComments[]> {
        const rawTotalComments = await this.createQueryBuilder('comments')
            .leftJoin('users', 'user', 'user.id = comments.user_id')
            .leftJoin('profile_image', 'img', 'img.user_id = comments.user_id')
            .select(['comments', 'user.name', 'user.nickname', 'user.deleted_at', 'img.path', 'img.deleted_at'])
            .where('comments.fairytale_id = :fairytaleId', { fairytaleId })
            .orderBy('comments.created_at', 'DESC')
            .getRawMany();

        const comments = rawTotalComments.map((rawComments: rawCommentsType) => ({
            id: rawComments.comments_id,
            createdAt: rawComments.comments_created_at,
            updatedAt: rawComments.comments_updated_at,
            deletedAt: rawComments.comments_deleted_at,
            userId: rawComments.comments_userId,
            fairytaleId: rawComments.comments_fairytale_id,
            content: rawComments.comments_content,
            name: rawComments.user_name,
            nickname: rawComments.user_nickname,
            userDeletedAt: rawComments.user_deleted_at,
            profileImgURL: rawComments.img_path,
            profileImgDeletedAt: rawComments.img_deleted_at,
        }));
        return comments;
    }

    // 페이지네이션 댓글 조회
    async getPageComments(
        fairytaleId: number,
        page: number,
        limit: number,
    ): Promise<{ data: newComments[]; totalCount: number; currentPage: number; totalPages: number }> {
        // 전체 데이터 갯수 조회
        const totalCommentsCount = await this.createQueryBuilder('comments')
            .where('comments.fairytale_id = :fairytaleId', { fairytaleId })
            .getCount();

        // 페이지네이션 조회
        const offset = (page - 1) * limit;
        const rawPageComments = await this.createQueryBuilder('comments')
            .leftJoin('users', 'user', 'user.id = comments.user_id')
            .leftJoin('profile_image', 'img', 'img.user_id = comments.user_id')
            .select(['comments', 'user.name', 'user.nickname', 'user.deleted_at', 'img.path', 'img.deleted_at'])
            .where('comments.fairytale_id = :fairytaleId', { fairytaleId })
            .orderBy('comments.created_at', 'DESC')
            .limit(limit)
            .offset(offset)
            .getRawMany();

        const comments = rawPageComments.map((rawComments: rawCommentsType) => ({
            id: rawComments.comments_id,
            createdAt: rawComments.comments_created_at,
            updatedAt: rawComments.comments_updated_at,
            deletedAt: rawComments.comments_deleted_at,
            userId: rawComments.comments_userId,
            fairytaleId: rawComments.comments_fairytale_id,
            content: rawComments.comments_content,
            name: rawComments.user_name,
            nickname: rawComments.user_nickname,
            userDeletedAt: rawComments.user_deleted_at,
            profileImgURL: rawComments.img_path,
            profileImgDeletedAt: rawComments.img_deleted_at,
        }));
        return {
            data: comments,
            totalCount: totalCommentsCount,
            currentPage: page,
            totalPages: Math.ceil(totalCommentsCount / limit),
        };
    }

    // 동화 댓글 생성
    // 대댓글 기능 추가 시, entityManager로 수정
    async createComments(newComments: Partial<Comments>): Promise<Comments> {
        const comments = await this.create(newComments);
        return await this.save(comments);
    }

    // 동화 댓글 수정
    async updateComments(commentId: number, newComments: Partial<Comments>): Promise<Comments> {
        const currentTime = new Date();
        const updateComments = {
            ...newComments,
            updatedAt: currentTime,
        };

        await this.update(commentId, updateComments);
        return this.findOneBy({ id: commentId });
    }

    // 동화 댓글 삭제
    async softDeleteComments(commentId: number): Promise<Comments> {
        const currentTime = new Date();
        const comments = await this.findOne({
            where: {
                id: commentId,
                deletedAt: null,
            },
        });
        if (!comments) {
            return null;
        }

        comments.deletedAt = currentTime;
        comments.updatedAt = currentTime;
        return await this.save(comments);
    }

    // 나의 동화 댓글 조회
    async getMyComments(userId: number): Promise<Comments[]> {
        return this.createQueryBuilder('c')
            .leftJoin('fairytale', 'f', 'f.id = c.fairytale_id')
            .select([
                'CASE WHEN f.title IS NULL THEN "삭제된 동화입니다." ELSE f.title END AS title',
                'c.content AS content',
                'c.created_at AS createdAt',
                'f.id AS fairytaleId',
                'f.privated_at AS privatedAt',
            ])
            .where('c.user_id = :userId', { userId })
            .getRawMany();
    }
}
