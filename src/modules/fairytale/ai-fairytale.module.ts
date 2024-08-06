/**
File Name : ai-fairytale.module
Description : AI 동화 스토리 Module
Author : 이유민

History
Date        Author      Status      Description
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
2024.08.03  이유민      Modified    포인트 기능 추가
2024.08.03  원경혜      Modified    AI 동화 이미지 생성 기능 추가
2024.08.05  이유민      Modified    포인트 기능 수정
*/

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIFairytaleService } from 'src/modules/fairytale/ai-fairytale-create.service';
import { AIFairytaleController } from 'src/modules/fairytale/ai-fairytale-create.controller';
import { AIFairytaleImageService } from 'src/modules/fairytale/ai-fairytale-image-create.service';
import { AIFairytaleImageController } from 'src/modules/fairytale/ai-fairytale-image-create.controller';
import { FairytaleImgRepository } from 'src/modules/fairytale/repository/fairytale-img.repository';
import { User } from 'src/modules/user/entity/user.entity';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
import { PointHistory } from 'src/modules/billing/entity/point-history.entity';
import { UserRepository } from 'src/modules/user/user.repository';
import { S3Service } from 'src/modules/s3.service';
import { PointHistoryService } from 'src/modules/billing/point-history.service';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([PointHistory, User])],
    controllers: [AIFairytaleController, AIFairytaleImageController],
    providers: [
        AIFairytaleService,
        AIFairytaleImageService,
        S3Service,
        PointHistoryRepository,
        UserRepository,
        FairytaleImgRepository,
        PointHistoryService,
    ],
})
export class AIFairytaleModule {}
