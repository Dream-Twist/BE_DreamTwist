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
import { ApiTags } from '@nestjs/swagger';
import { ApiPostOperation } from 'shared/utils/swagger.decorators';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { AIFairytaleImageService } from 'src/modules/fairytale/ai-fairytale-image-create.service';
// import { AIFairytaleType } from 'src/modules/fairytale/type/ai-fairytale-create.type';

@ApiTags('AI-Fairytale')
@Controller('ai-fairytale')
export class AIFairytaleImageController {
    constructor(private readonly aiFairytaleImageService: AIFairytaleImageService) {}

    // AI 이미지 생성 요청
    @ApiPostOperation({
        summary: 'AI 동화 이미지 생성',
        successResponseSchema: {
            type: 'string',
            example: 'http://bucketName.s3.region.amazonaws.com/fileName',
        },
    })
    @Post('image')
    async createAiImage(@Body() createAIFairytaleDto: CreateAIFairytaleDto): Promise<string> {
        return this.aiFairytaleImageService.generateAndUploadAiImage(createAIFairytaleDto);
    }
}
