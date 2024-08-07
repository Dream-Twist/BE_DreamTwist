import {
    Controller,
    Get,
    Post,
    Body,
    // ValidationPipe,
    // UseInterceptors,
    // Put,
    ParseIntPipe,
    Param,
    // Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    ApiGetOperation,
    // ApiDeleteOperation,
    ApiPostOperation,
    // ApiPutOperation,
} from 'shared/utils/swagger.decorators';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
import { CommentsFairytaleDto } from './dto/fairytale-comments.dto';
import { CommentsService } from 'src/modules/fairytale/fairytale-comments.service';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    // 동화 댓글 조회
    @ApiGetOperation({
        summary: '동화 댓글 조회',
        successMessage: '동화 댓글을 성공적으로 조회했습니다.',
        notFoundMessage: '요청한 유저의 동화 목록을 찾을 수 없습니다',
    })
    @Get(':fairytaleId')
    async getComments(@Param('fairytaleId', ParseIntPipe) fairytaleId: number) {
        return this.commentsService.getComments(fairytaleId);
    }

    // 동화 댓글 생성
    @ApiPostOperation({
        summary: '동화 댓글 생성',
        successMessage: '동화 댓글이 성공적으로 생성되었습니다.',
    })
    @Post()
    async createComments(@Body() commentsFairyDto: CommentsFairytaleDto): Promise<Comments> {
        return await this.commentsService.createComments(commentsFairyDto);
    }
}
