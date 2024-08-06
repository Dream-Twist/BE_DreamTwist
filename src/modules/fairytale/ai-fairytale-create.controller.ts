/**
File Name : ai-fairytale-create.controller
Description : AI 동화 스토리 생성 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
2024.08.01  이유민      Modified    AI 동화 스토리 생성 경로 수정
2024.08.03  이유민      Modified    타입 수정
2024.08.03  박수정      Modified    Swagger Decorator 적용
2024.08.05  이유민      Modified    Swagger 수정
*/

import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { AIFairytaleService } from 'src/modules/fairytale/ai-fairytale-create.service';
import { AIFairytaleType } from 'src/modules/fairytale/type/ai-fairytale-create.type';
import { ApiPostOperation } from 'shared/utils/swagger.decorators';

@ApiTags('AI-Fairytale')
@Controller('ai-fairytale')
export class AIFairytaleController {
    constructor(private readonly aiFairytaleService: AIFairytaleService) {}

    @ApiPostOperation({
        summary: 'AI 동화 스토리 생성',
        successResponseSchema: {
            type: 'object',
            properties: {
                theme: {
                    type: 'string',
                    example: '사랑',
                },
                title: {
                    type: 'string',
                    example: '사과 속에 숨겨진 사랑',
                },
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
    @Post('story')
    async createAIStory(@Body() createAIFairytaleDto: CreateAIFairytaleDto): Promise<AIFairytaleType> {
        return await this.aiFairytaleService.generateFairytale(createAIFairytaleDto);
    }
}
