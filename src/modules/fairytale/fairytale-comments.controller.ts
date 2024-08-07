import {
    Controller,
    Get,
    Post,
    Body,
    // ValidationPipe,
    // UseInterceptors,
    Put,
    ParseIntPipe,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import {
    ApiGetOperation,
    ApiDeleteOperation,
    ApiPostOperation,
    ApiPutOperation,
} from 'shared/utils/swagger.decorators';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
// import { CommentsFairytaleDto } from './dto/fairytale-comments.dto';
import { CommentsService } from 'src/modules/fairytale/fairytale-comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    // 동화 댓글 생성
    @Post()
    @ApiPostOperation({
        summary: '동화 댓글 생성',
        successMessage: '동화 댓글이 성공적으로 생성되었습니다.',
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
    async createComments(@Body() body: { fairytaleId: number; content: string }): Promise<Comments> {
        return await this.commentsService.createComments(body.fairytaleId, body.content);
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
    ): Promise<Comments> {
        return await this.commentsService.editComments(fairytaleId, commentId, body.content);
    }

    // 동화 댓글 삭제
    @ApiDeleteOperation({
        summary: '동화 댓글 삭제',
        successMessage: 'id번 동화를 삭제했습니다',
        notFoundMessage: 'id번 동화를 찾을 수 없습니다',
    })
    @Delete(':fairytaleId/:commentId')
    async deleteComments(
        @Param('fairytaleId', ParseIntPipe) fairytaleId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
    ): Promise<Comments> {
        return await this.commentsService.deleteComments(commentId);
    }
}
