/**
File Name : fairytale-comments.service
Description : 동화 댓글 조회, 생성, 수정, 삭제 Service
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created
2024.08.06  원경혜      Modified    동화 댓글 생성 기능 추가
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
import { CommentsFairytaleDto } from 'src/modules/fairytale/dto/fairytale-comments.dto';
import { CommentsRepository } from 'src/modules/fairytale/repository/fairytale-comments.repository';
import { UserRepository } from 'src/modules/user/user.repository';

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
        const data = await this.dataSource.transaction(async entityManager => {
            const comments = await this.commentsRepository.getCommentsByFairytaleId(fairytaleId, entityManager);

            if (!comments || comments.length === 0) {
                throw new NotFoundException(`요청한 유저의 동화 댓글을 찾을 수 없습니다.`);
            }
            return comments;
        });
        return data;
    }

    // 동화 댓글 생성
    // 사용자 인증 - userId(token 사용), req as AuthenticatedRequest, const userId = (req as any).user.id; any 사용 안되지 않나?
    // req.body - fairytale_id, content    // async createFairytale(commentsFairyDto: CommentsFairyDto, user: User) {}
    async createComments(commentsFairyDto: CommentsFairytaleDto): Promise<Comments> {
        const { fairytaleId, content } = commentsFairyDto;

        const newComment = new Comments();
        newComment.fairytaleId = fairytaleId;
        newComment.content = content;
        newComment.userId = 1; // userId가 제공되지 않는다면 undefined로 설정

        return await this.commentsRepository.save(newComment);
    }
}

// 동화 댓글 수정

// 동화 댓글 삭제

// // 임시 사용자
// const userId = 1;
// const user = await this.userRepository.findOne({ where: { id: userId } });

// if (!user) {
//     throw new NotFoundException('회원을 찾을 수 없습니다.');
// }
