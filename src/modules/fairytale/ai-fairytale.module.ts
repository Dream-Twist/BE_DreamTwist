/**
File Name : ai-fairytale.module
Description : AI 동화 스토리 Module
Author : 이유민

History
Date        Author      Status      Description
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
*/

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AIFairytaleService } from './ai-fairytale-create.service';
import { AIFairytaleController } from './ai-fairytale-create.controller';

@Module({
    imports: [HttpModule],
    controllers: [AIFairytaleController],
    providers: [AIFairytaleService],
})
export class AIFairytaleModule {}
