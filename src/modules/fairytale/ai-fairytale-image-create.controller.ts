/**
File Name : ai-fairytale-image-create.controller
Description : AI 동화 이미지 생성 Controller
Author : 원경혜

History
Date        Author      Status      Description
2024.08.02  원경혜      Created     
2024.08.03  원경혜      Modified    AI 동화 이미지 생성 기능 추가
2024.08.08  이유민      Modified    userId 수정
*/

import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPostOperation } from 'shared/utils/swagger.decorators';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { AIFairytaleImageService } from 'src/modules/fairytale/ai-fairytale-image-create.service';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';
// import { AIFairytaleType } from 'src/modules/fairytale/type/ai-fairytale-create.type';

@ApiTags('AI-Fairytale')
@Controller('ai-fairytale')
@UseGuards(JwtAuthGuard)
export class AIFairytaleImageController {
    constructor(private readonly aiFairytaleImageService: AIFairytaleImageService) {}

    // AI 이미지 생성 요청
    @ApiPostOperation({
        summary: 'AI 동화 이미지 생성',
        successResponseSchema: {
            type: 'string',
            example: 'http://dreamtwist-bucket.s3.ap-northeast-2.amazonaws.com/fileName.png',
        },
    })
    @Post('image')
    async createAiImage(@Req() req, @Body() createAIFairytaleDto: CreateAIFairytaleDto): Promise<string> {
        return this.aiFairytaleImageService.generateAndUploadAiImage(req.user.userId, createAIFairytaleDto);
    }
}
