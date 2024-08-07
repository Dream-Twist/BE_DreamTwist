/**
File Name : fairytale-comments.service
Description : 동화 댓글 조회, 생성, 수정, 삭제 Service
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created
2024.08.06  원경혜      Modified    동화 댓글 생성 기능 추가
*/

import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
import { CommentsFairytaleDto } from 'src/modules/fairytale/dto/fairytale-comments.dto';
import { CommentsRepository } from 'src/modules/fairytale/repository/fairytale-comments.repository';
import { UserRepository } from 'src/modules/user/repository/user.repository';

// 특정 유저 태그하기 추가 기능 구현 해보기 - 대댓글

@Injectable()
export class CommentsService {
    constructor(
        private readonly dataSource: DataSource,
        @InjectRepository(CommentsRepository)
        private readonly commentsRepository: CommentsRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
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
    // 사용자 인증 - userId(token 사용), req as AuthenticatedRequest, const userId = (req as any).user.id; any 사용 안되지 않나?
    // req.body - fairytale_id, content    // async createFairytale(commentsFairyDto: CommentsFairyDto, user: User) {}
    async createComments(fairytaleId: number, content: string): Promise<Comments> {
        // // 유효성 검사 및 기본값 설정 - 유저 확인 추가
        // if (!fairytaleId || content) {
        //     throw new Error('에러 코드 작성');
        // }

        const newComment = new Comments();
        newComment.fairytaleId = fairytaleId;
        newComment.content = content;
        newComment.userId = 1; // userId가 제공되지 않는다면 undefined로 설정

        return await this.commentsRepository.save(newComment);
    }

    // 동화 댓글 수정
    async editComments(fairytaleId: number, commentId: number, content: string): Promise<Comments> {
        const existingComments = await this.commentsRepository.findOne({
            where: { fairytaleId: fairytaleId, id: commentId },
        });

        const userId = 1;

        // 댓글이 수정되었는지 확인
        if (!existingComments) {
            throw new BadRequestException(`${commentId}번 동화를 찾을 수 없습니다`);
        }

        if (existingComments.userId !== userId) {
            throw new UnauthorizedException('동화를 수정할 권한이 없습니다.');
        }

        const updatedCommentsData = { content };
        const updatedComments = await this.commentsRepository.updateComments(commentId, updatedCommentsData);

        if (!updatedCommentsData) {
            throw new BadRequestException('댓글 수정에 실패했습니다.');
        }
        return updatedComments;
    }

    // 동화 댓글 삭제
    async deleteComments(commentId: number): Promise<Comments> {
        const softDelete = await this.commentsRepository.softDeleteComments(commentId);
        return softDelete;
    }
}
