/**
File Name : ai-fairytale-create.controller
Description : AI 동화 스토리 생성 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
2024.08.01  이유민      Modified    AI 동화 스토리 생성 경로 수정
*/

import { Controller, Post, Body } from '@nestjs/common';
import { CreateAIFairytaleDto } from './dto/ai-fairytale-create.dto';
import { AIFairytaleService } from './ai-fairytale-create.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('AI-Fairytale')
@Controller('ai-fairytale')
export class AIFairytaleController {
    constructor(private readonly aiFairytaleService: AIFairytaleService) {}

    @ApiOperation({ summary: 'AI 동화 스토리 생성' })
    @ApiResponse({
        status: 201,
        description: 'AI 동화 스토리 생성 성공',
        schema: {
            type: 'object',
            properties: {
                story: {
                    type: 'array',
                    items: {
                        type: 'string',
                        example: '동화 스토리 문단',
                    },
                    example: ['동화 스토리 첫 번째 문단', '동화 스토리 두 번째 문단'],
                },
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
    @Post('story')
    async createAIStory(@Body() createAIFairytaleDto: CreateAIFairytaleDto): Promise<any> {
        return this.aiFairytaleService.generateFairytale(createAIFairytaleDto);
    }
}
