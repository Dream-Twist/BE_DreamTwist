/**
File Name : ai-fairytale.module
Description : AI 동화 스토리 Module
Author : 이유민

History
Date        Author      Status      Description
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
2024.08.03  이유민      Modified    포인트 기능 추가
*/

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIFairytaleService } from 'src/modules/fairytale/ai-fairytale-create.service';
import { AIFairytaleController } from 'src/modules/fairytale/ai-fairytale-create.controller';
import { PointRepository } from 'src/modules/billing/repository/point.repository';
import { Point } from 'src/modules/billing/entity/point.entity';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
import { PointHistory } from 'src/modules/billing/entity/point-history.entity';
import { PointUsageRepository } from 'src/modules/billing/repository/point-usage.repository';
import { PointUsage } from 'src/modules/billing/entity/point-usage.entity';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([Point, PointHistory, PointUsage])],
    controllers: [AIFairytaleController],
    providers: [AIFairytaleService, PointRepository, PointHistoryRepository, PointUsageRepository],
})
export class AIFairytaleModule {}
