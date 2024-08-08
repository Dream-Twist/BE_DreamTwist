/**
File Name : fairytale-comments.service
Description : 동화 댓글 조회, 생성, 수정, 삭제 Service
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created
2024.08.06  원경혜      Modified    동화 댓글 생성 기능 추가
2024.08.07  원경혜      Modified    동화 댓글 CRUD 기능 추가
*/

import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
import { CommentsRepository } from 'src/modules/fairytale/repository/fairytale-comments.repository';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentsRepository)
        private readonly commentsRepository: CommentsRepository,
    ) {}

    // 동화 댓글 조회 - 페이지네이션 고려 - 조회는 굳이 트랜잭션 안해도 됨
    async getComments(fairytaleId: number): Promise<Comments[]> {
        const comments = await this.commentsRepository.getCommentsByFairytaleId(fairytaleId);

        if (!comments || comments.length === 0) {
            throw new NotFoundException(`요청한 유저의 동화 댓글을 찾을 수 없습니다.`);
        }
        return comments;
    }

    // 동화 댓글 생성
    async createComments(fairytaleId: number, content: string, userId: number): Promise<Comments> {
        if (!userId) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        const newComment = new Comments();
        newComment.fairytaleId = fairytaleId;
        newComment.content = content;
        newComment.userId = userId;

        return await this.commentsRepository.save(newComment);
    }

    // 동화 댓글 수정
    async editComments(fairytaleId: number, commentId: number, content: string, userId: number): Promise<Comments> {
        if (!userId) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        const existingComments = await this.commentsRepository.findOne({
            where: { fairytaleId: fairytaleId, id: commentId },
        });

        if (existingComments.userId != userId) {
            throw new UnauthorizedException('댓글을 수정할 권한이 없습니다.');
        }

        if (!existingComments) {
            throw new BadRequestException(`${commentId}번 댓글을 찾을 수 없습니다`);
        }

        const updatedCommentsData = { content };
        const updatedComments = await this.commentsRepository.updateComments(commentId, updatedCommentsData);

        if (!updatedCommentsData) {
            throw new BadRequestException('댓글 수정에 실패했습니다.');
        }
        return updatedComments;
    }

    // 동화 댓글 삭제
    async deleteComments(commentId: number, userId: number): Promise<Comments> {
        if (!userId) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }
        const softDelete = await this.commentsRepository.softDeleteComments(commentId);
        return softDelete;
    }
}
