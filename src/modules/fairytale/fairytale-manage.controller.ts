/**
File Name : fairytale-manage.controller
Description : 동화 스토리 생성, 수정, 삭제 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.22  박수정      Modified    Swagger 설정
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
2024.08.02  박수정      Modified    이미지 업로드 방식 변경 - Presigned URL
2024.08.03  박수정      Modified    Controller 분리 - 조회 / 생성, 수정, 삭제
*/

import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UseInterceptors,
    Put,
    ParseIntPipe,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ManageFairytaleService } from 'src/modules/fairytale/fairytale-manage.service';
import { CreateFairytaleDto } from 'src/modules/fairytale/dto/fairytale-create.dto';
import { CreateFairytaleImgDto } from 'src/modules/fairytale/dto/fairytale-img.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateFairytaleDto } from './dto/fairytale-update.dto';

@ApiTags('Fairytale')
@Controller('fairytale')
export class ManageFairytaleController {
    constructor(private readonly manageFairytaleService: ManageFairytaleService) {}

    // 동화 스토리 생성
    @ApiOperation({ summary: '동화 스토리 직접 생성' })
    @ApiResponse({
        status: 201,
        description: '동화 스토리 생성 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '동화 스토리가 성공적으로 생성되었습니다.' },
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
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createFairytale(
        @Body(new ValidationPipe({ transform: true })) createFairytaleDto: CreateFairytaleDto,
        @Body() createFairytaleImgDto: CreateFairytaleImgDto,
    ) {
        const result = await this.manageFairytaleService.createFairytale(createFairytaleDto, createFairytaleImgDto);
        return {
            message: '동화 스토리가 성공적으로 생성되었습니다.',
            result,
        };
    }

    // Presigned URL 요청
    @Post('presigned-url')
    async getPresignedURL(@Body() body: { userId: number; fileName: string }) {
        const presignedURL = await this.manageFairytaleService.getPresignedURL(body.userId, body.fileName);
        return { presignedURL };
    }

    // 동화 스토리 수정
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
    async updateFairytale(
        @Body(new ValidationPipe({ transform: true })) updateFairytaleDto: UpdateFairytaleDto,
        @Body() createFairytaleImgDto: CreateFairytaleImgDto,
        @Param('fairytaleId', ParseIntPipe) fairytaleId: number,
    ) {
        const result = await this.manageFairytaleService.editUserFairytale(
            fairytaleId,
            updateFairytaleDto,
            createFairytaleImgDto,
        );
        return {
            message: '동화 스토리가 성공적으로 수정되었습니다.',
            result,
        };
    }

    // 동화 스토리 삭제
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
    @Delete(':fairytaleId')
    async deleteFairytale(@Param('fairytaleId', ParseIntPipe) id: number): Promise<string> {
        await this.manageFairytaleService.deleteFairytale(id);
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
    //     await this.manageFairytaleService.createFairytaleLike(boardFairytaleDto);
    //     return { message: '1개의 좋아요가 성공적으로 생성되었습니다.' };
    // }
}
