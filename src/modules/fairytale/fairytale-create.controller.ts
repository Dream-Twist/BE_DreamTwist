/**
File Name : fairytale-create.controller
Description : 동화 스토리 생성 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.22  박수정      Modified    Swagger 설정
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
*/

import { Controller, Post, Body, UseInterceptors, UploadedFile, ValidationPipe } from '@nestjs/common';
import { FairytaleService } from './fairytale-create.service';
import { CreateFairytaleDto } from './dto/fairytale-create.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateFairytaleImgDto } from './dto/fairytale-img.dto';

// 동화 스토리 생성
@ApiTags('Fairytale')
@Controller('fairytale')
export class FairytaleController {
    constructor(private readonly fairytaleService: FairytaleService) {}

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
    @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
    async createFairytale(
        @Body(new ValidationPipe({ transform: true })) createFairytaleDto: CreateFairytaleDto,
        @Body() createFairytaleImgDto: CreateFairytaleImgDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const fairytale = await this.fairytaleService.createFairytale(createFairytaleDto, createFairytaleImgDto, file);
        return {
            message: '동화 스토리가 성공적으로 생성되었습니다.',
            fairytale,
        };
    }
}
