/**
File Name : fairytale-board.controller
Description : 동화 스토리 controller
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    create 리포지토리 기반
2024.07.25  강민규      Modified    GET: 동화 스토리 조회
2024.07.26  강민규      Modified    DELETE: 동화 스토리 및 줄거리 제거
2024.07.27  강민규      Modified    GET: 동화 목록 및 특정 동화 세부 조회
2024.07.30  강민규      Modified    GET: 조회수 기록
2024.07.31  강민규      Modified    GET: 동화 목록 최신순 검색, 닉네임 이미지 조회
2024.08.03  강민규      Modified    PUT: 동화 작성자가 수정

*/

// import { Controller, Post, Body, Request } from '@nestjs/common';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Put,
    Query,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { BoardFairytaleService } from 'src/modules/fairytale/fairytale-board.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardFairytaleDto } from 'src/modules/fairytale/dto/fairytale-board.dto';
import { CreateFairytaleImgDto } from 'src/modules/fairytale/dto/fairytale-img.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Fairytale')
@Controller('fairytale')
export class BoardFairytaleController {
    constructor(private readonly fairytaleService: BoardFairytaleService) {}

    // 조회
    @ApiOperation({ summary: '동화 전체 조회' })
    @ApiResponse({
        status: 200,
        description: '동화 전체 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '동화 목록 10개를 성공적으로 조회했습니다.' },
            },
        },
    })
    @ApiResponse({
        description: '잘못된 요청',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
        },
    })
    @ApiResponse({
        status: 404,
        description: '요청한 리소스를 찾을 수 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '요청한 유저 {id}의 동화 목록을 찾을 수 없습니다' } },
        },
    })
    @ApiResponse({
        status: 500,
        description: '서버 내부 오류',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
        },
    })
    @Get()
    async getAllFairytalesForUser() {
        return this.fairytaleService.getFairytales();
    }
    @ApiOperation({ summary: '동화 상세 조회' })
    @ApiResponse({
        status: 200,
        description: '동화 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '해당되는 동화를 성공적으로 조회했습니다.' },
            },
        },
    })
    @ApiResponse({
        description: '잘못된 요청',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
        },
    })
    @ApiResponse({
        status: 404,
        description: '요청한 리소스를 찾을 수 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '{id}번 동화 줄거리를 찾을 수 없습니다.' } },
        },
    })
    @ApiResponse({
        status: 500,
        description: '서버 내부 오류',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
        },
    })
    @Get(':fairytaleId')
    async getFairytaleContent(@Param('fairytaleId', ParseIntPipe) fairytaleId: number) {
        // 임시 유저
        const userId = 1;
        const content = await this.fairytaleService.getFairytaleContent(fairytaleId, userId);
        return content;
    }
    // 제목 조회
    @ApiOperation({ summary: '동화 제목으로 검색' })
    @ApiResponse({
        status: 200,
        description: '동화 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '해당되는 동화를 성공적으로 조회했습니다.' },
            },
        },
    })
    @ApiResponse({
        description: '잘못된 요청',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
        },
    })
    @ApiResponse({
        status: 404,
        description: '요청한 리소스를 찾을 수 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '{title}에 해당되는 동화 줄거리를 찾을 수 없습니다.' } },
        },
    })
    @ApiResponse({
        status: 500,
        description: '서버 내부 오류',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
        },
    })
    @Get('byTitle')
    async getFairytalebyTitle(@Query('title') title: string) {
        const content = await this.fairytaleService.getAllbyTitle(title);
        return content;
    }
    // 수정
    @ApiOperation({ summary: '동화 스토리 수정' })
    @ApiResponse({
        status: 201,
        description: '동화 스토리 수정 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '동화 스토리가 성공적으로 수정되었습니다.' },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
        },
    })
    @ApiResponse({
        status: 404,
        description: '요청한 리소스를 찾을 수 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다.' } },
        },
    })
    @ApiResponse({
        status: 500,
        description: '서버 내부 오류',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
        },
    })
    @Put(':fairytaleId')
    @UseInterceptors(FileInterceptor('image'))
    async createFairytale(
        @Body(new ValidationPipe({ transform: true })) boardFairytaleDto: BoardFairytaleDto,
        @Body() createFairytaleImgDto: CreateFairytaleImgDto,
        @Param('fairytaleId', ParseIntPipe) fairytaleId: number,
    ) {
        const result = await this.fairytaleService.editUserFairytale(
            fairytaleId,
            boardFairytaleDto,
            createFairytaleImgDto,
        );
        return {
            message: '동화 스토리가 성공적으로 수정되었습니다.',
            result,
        };
    }
    @ApiOperation({ summary: '동화 스토리 삭제' })
    @ApiResponse({
        status: 200,
        description: '해당 동화 스토리 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '${id} 번 동화를 삭제했습니다' },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
        },
    })
    @ApiResponse({
        status: 403,
        description: '권한 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '해당 동화에 대한 삭제 권한이 없습니다.' } },
        },
    })
    @ApiResponse({
        status: 404,
        description: '요청한 리소스를 찾을 수 없음',
        schema: {
            type: 'object',
            properties: {
                error: {
                    type: 'string',
                    example: ['{id}번 동화를 찾을 수 없습니다'],
                },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: '서버 내부 오류',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
        },
    })
    // 동화 스토리 지우기
    @Delete(':fairytaleId')
    async deleteFairytale(@Param('fairytaleId', ParseIntPipe) id: number): Promise<string> {
        await this.fairytaleService.deleteFairytale(id);
        return `${id} 번 동화를 삭제했습니다`;
    }
    //좋아요 올리기
    // @ApiOperation({ summary: '좋아요 올리기' })
    // @ApiResponse({
    //     status: 201,
    //     description: '좋아요 생성 성공',
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             message: { type: 'string', example: '1개의 좋아요가 성공적으로 생성되었습니다.' },
    //         },
    //     },
    // })
    // @ApiResponse({
    //     status: 400,
    //     description: '잘못된 요청',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
    //     },
    // })
    // @ApiResponse({
    //     status: 401,
    //     description: '인증 실패',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
    //     },
    // })
    // @ApiResponse({
    //     status: 404,
    //     description: '요청한 리소스를 찾을 수 없음',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다.' } },
    //     },
    // })
    // @ApiResponse({
    //     status: 500,
    //     description: '서버 내부 오류',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
    //     },
    // })
    // @Post()
    // async createFairytaleLike(@Body() boardFairytaleDto: BoardFairytaleDto) {
    //     await this.fairytaleService.createFairytaleLike(boardFairytaleDto);
    //     return { message: '1개의 좋아요가 성공적으로 생성되었습니다.' };
    // }
}
