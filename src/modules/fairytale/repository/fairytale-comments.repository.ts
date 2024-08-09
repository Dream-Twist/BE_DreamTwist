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
*/

import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
@Injectable()
export class CommentsRepository extends Repository<Comments> {
    constructor(private readonly entityManager: EntityManager) {
        super(Comments, entityManager);
    }
    /*
    동화 댓글 조회
    */

    // 댓글 조회 - fairytaleId 필터링
    async getCommentsByFairytaleId(fairytaleId: number): Promise<Comments[]> {
        const rawComments = await this.createQueryBuilder('comments')
            .leftJoin('users', 'user', 'user.id = comments.user_id')
            .leftJoin('profile_image', 'img', 'img.user_id = comments.user_id')
            .select([
                'comments',
                'CASE WHEN user.deleted_at IS NULL THEN user.nickname ELSE "삭제된 회원입니다." END AS nickName',
                'user.name',
                'CASE WHEN img.deleted_at IS NULL THEN img.path ELSE "삭제된 프로필 사진입니다." END AS profileImgURL',
            ])
            .where('comments.fairytale_id = :fairytaleId', { fairytaleId })
            .orderBy('comments.created_at', 'DESC')
            .getRawMany();

        const comments = rawComments.map(rawComments => ({
            id: rawComments.comments_id,
            createdAt: rawComments.comments_created_at,
            updatedAt: rawComments.comments_updated_at,
            deletedAt: rawComments.comments_deleted_at,
            userId: rawComments.comments_userId,
            fairytaleId: rawComments.comments_fairytale_id,
            content: rawComments.comments_content,
            name: rawComments.user_name,
            nickname: rawComments.nickName,
            profileImgURL: rawComments.profileImgURL,
        }));
        return comments;
    }

    // 동화 댓글 생성
    // 대댓글 기능 추가 시, entityManager로 수정
    async createComments(newComments: Partial<Comments>): Promise<Comments> {
        const comments = await this.create(newComments);
        return await this.save(comments);

        // const commentId = comments.id;
        // const rawComments = await this.createQueryBuilder('comments')
        //     .leftJoin('users', 'user', 'user.id = comments.user_id')
        //     .leftJoin('profile_image', 'img', 'img.user_id = comments.user_id')
        //     .select([
        //         'comments',
        //         'CASE WHEN user.deleted_at IS NULL THEN user.nickname ELSE "삭제된 회원입니다." END AS nickName',
        //         'user.name',
        //         'CASE WHEN img.deleted_at IS NULL THEN img.path ELSE "삭제된 프로필 사진입니다." END AS profileImgURL',
        //     ])
        //     .where('comments.id = :commentId', { commentId })
        //     .getRawOne();

        // const finalComments = {
        //     id: rawComments.comments_id,
        //     createdAt: rawComments.comments_created_at,
        //     updatedAt: rawComments.comments_updated_at,
        //     deletedAt: rawComments.comments_deleted_at,
        //     userId: rawComments.comments_userId,
        //     fairytaleId: rawComments.comments_fairytale_id,
        //     content: rawComments.comments_content,
        //     name: rawComments.user_name,
        //     nickname: rawComments.nickName,
        //     profileImgURL: rawComments.profileImgURL,
        // };
        // return finalComments;
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

    // const rawComments = await this.createQueryBuilder('comments')
    //     .leftJoin('users', 'user', 'user.id = comments.user_id')
    //     .leftJoin('profile_image', 'img', 'img.user_id = comments.user_id')
    //     .select([
    //         'comments',
    //         'CASE WHEN user.deleted_at IS NULL THEN user.nickname ELSE "삭제된 회원입니다." END AS nickName',
    //         'user.name',
    //         'CASE WHEN img.deleted_at IS NULL THEN img.path ELSE "삭제된 프로필 사진입니다." END AS profileImgURL',
    //     ])
    //     .where('comments.id = :commentId', { commentId })
    //     .getRawOne();

    // const comments = {
    //     id: rawComments.comments_id,
    //     createdAt: rawComments.comments_created_at,
    //     updatedAt: rawComments.comments_updated_at,
    //     deletedAt: rawComments.comments_deleted_at,
    //     userId: rawComments.comments_userId,
    //     fairytaleId: rawComments.comments_fairytale_id,
    //     content: rawComments.comments_content,
    //     name: rawComments.user_name,
    //     nickname: rawComments.nickName,
    //     profileImgURL: rawComments.profileImgURL,
    // };
    // return comments;

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

        // const rawComments = await this.createQueryBuilder('comments')
        //     .leftJoin('users', 'user', 'user.id = comments.user_id')
        //     .leftJoin('profile_image', 'img', 'img.user_id = comments.user_id')
        //     .select([
        //         'comments',
        //         'CASE WHEN user.deleted_at IS NULL THEN user.nickname ELSE "삭제된 회원입니다." END AS nickName',
        //         'user.name',
        //         'CASE WHEN img.deleted_at IS NULL THEN img.path ELSE "삭제된 프로필 사진입니다." END AS profileImgURL',
        //     ])
        //     .where('comments.id = :commentId', { commentId })
        //     .getRawOne();

        // console.log(rawComments);

        // const finalComments = {
        //     id: rawComments.comments_id,
        //     createdAt: rawComments.comments_created_at,
        //     updatedAt: rawComments.comments_updated_at,
        //     deletedAt: rawComments.comments_deleted_at,
        //     userId: rawComments.comments_userId,
        //     fairytaleId: rawComments.comments_fairytale_id,
        //     content: rawComments.comments_content,
        //     name: rawComments.user_name,
        //     nickname: rawComments.nickName,
        //     profileImgURL: rawComments.profileImgURL,
        // };
        // return finalComments;
    }

    // 나의 동화 댓글 조회
    async getMyComments(userId: number): Promise<Comments[]> {
        return this.createQueryBuilder('c')
            .leftJoin('fairytale', 'f', 'f.id = c.fairytale_id')
            .select([
                'CASE WHEN f.title IS NULL THEN "삭제된 동화입니다." ELSE f.title END AS title',
                'c.content AS content',
                'c.created_at AS createdAt',
            ])
            .where('c.user_id = :userId', { userId })
            .getRawMany();
    }
}
