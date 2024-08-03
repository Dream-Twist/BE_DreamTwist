/**
File Name : ai-fairytale-image-create.controller
Description : AI 동화 이미지 생성 Controller
Author : 원경혜

History
Date        Author      Status      Description
2024.08.02  원경혜      Created     
2024.08.03  원경혜      Modified    AI 동화 이미지 생성 기능 추가
*/

import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { AIFairytaleImageService } from 'src/modules/fairytale/ai-fairytale-image-create.service';
// import { AIFairytaleType } from 'src/modules/fairytale/type/ai-fairytale-create.type';

@ApiTags('AI-Fairytale')
@Controller('ai-fairytale')
export class AIFairytaleImageController {
    constructor(private readonly aiFairytaleImageService: AIFairytaleImageService) {}

    // Swagger 추후 작성 예정
    @ApiOperation({ summary: 'AI 동화 이미지 생성' })
    @ApiResponse({
        status: 201,
        description: 'AI 동화 이미지 생성 성공',
        schema: {
            type: 'string',
        },
    })
    // Api 작성
    @Post('image')
    async createAiImage(@Body() createAIFairytaleDto: CreateAIFairytaleDto): Promise<string> {
        return this.aiFairytaleImageService.generateAndUploadAiImage(createAIFairytaleDto);
    }
}
