/**
File Name : fairytale-comments.controller
Description : 동화 댓글 조회, 생성, 수정, 삭제 Controller
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  원경혜      Created
2024.08.06  원경혜      Modified    동화 댓글 조회 기능 추가
2024.08.07  원경혜      Modified    동화 댓글 CRUD 기능 추가
2024.08.08  원경혜      Modified    회원 연동
*/

import {
    Controller,
    UseGuards,
    Req,
    Get,
    Post,
    Put,
    Delete,
    Body,
    ParseIntPipe,
    Param,
    UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiHeader } from '@nestjs/swagger';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';
import {
    ApiGetOperation,
    ApiDeleteOperation,
    ApiPostOperation,
    ApiPutOperation,
} from 'shared/utils/swagger.decorators';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
import { CommentsService } from 'src/modules/fairytale/fairytale-comments.service';
// import { userService } from 'src/modules/user/user.service'

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    // 동화 댓글 생성
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiPostOperation({
        summary: '동화 댓글 생성',
        successMessage: '동화 댓글이 성공적으로 생성되었습니다.',
    })
    @ApiHeader({
        name: 'Authorization',
        description: '인증을 위한 Bearer 토큰',
        required: true,
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fairytaleId: { type: 'number', example: 1 },
                content: { type: 'string', example: '이 동화책은 정말 재미있어요!' },
            },
            required: ['fairytaleId', 'content'],
        },
    })
    async createComments(@Body() body: { fairytaleId: number; content: string }, @Req() req): Promise<Comments> {
        if (!req.user || !req.user.sub) {
            throw new UnauthorizedException('요청에 사용자 정보가 없습니다.');
        }

        const userId = req.user.userId;
        return await this.commentsService.createComments(body.fairytaleId, body.content, userId);
    }

    // 동화 댓글 조회
    @ApiGetOperation({
        summary: '동화 댓글 조회',
        successResponseSchema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: '1' },
                    createdAt: { type: 'string', example: '2024-08-05' },
                    updatedAt: { type: 'string', example: '2024-08-07' || null },
                    deletedAt: { type: null },
                    userId: { type: 'number', example: '1' },
                    fairytaleId: { type: 'number', example: '2' },
                    content: { type: 'text', example: '동화가 참 재밌네요!' },
                },
                required: ['userId', 'fairytaleId'],
            },
        },
        successMessage: '동화 댓글을 성공적으로 조회했습니다.',
        notFoundMessage: '요청한 유저의 동화 댓글을 찾을 수 없습니다',
    })
    @Get(':fairytaleId')
    async getComments(@Param('fairytaleId', ParseIntPipe) fairytaleId: number) {
        return this.commentsService.getComments(fairytaleId);
    }

    // 동화 댓글 수정
    @Put(':fairytaleId/:commentId')
    @UseGuards(JwtAuthGuard)
    @ApiPutOperation({
        summary: '동화 댓글 수정',
        successMessage: '동화 댓글이 성공적으로 수정되었습니다.',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                content: { type: 'string', example: '다시 읽어보니 이 동화책은 정말 재미가 없어요!' },
            },
            required: ['fairytaleId', 'content'],
        },
    })
    async updateComments(
        @Body() body: { content: string },
        @Param('fairytaleId', ParseIntPipe) fairytaleId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Req() req,
    ): Promise<Comments> {
        if (!req.user || !req.user.sub) {
            throw new UnauthorizedException('요청에 사용자 정보가 없습니다.');
        }

        const userId = req.user.id;
        return await this.commentsService.editComments(fairytaleId, commentId, body.content, userId);
    }

    // 동화 댓글 삭제
    @Delete(':fairytaleId/:commentId')
    @UseGuards(JwtAuthGuard)
    @ApiDeleteOperation({
        summary: '동화 댓글 삭제',
        successMessage: 'id번 동화를 삭제했습니다',
        notFoundMessage: 'id번 동화를 찾을 수 없습니다',
    })
    async deleteComments(
        @Param('fairytaleId', ParseIntPipe) fairytaleId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Req() req,
    ): Promise<Comments> {
        if (!req.user || !req.user.sub) {
            throw new UnauthorizedException('요청에 사용자 정보가 없습니다.');
        }
        console.log(req.user);
        const userId = req.user.id;
        return await this.commentsService.deleteComments(commentId, userId);
    }
}
