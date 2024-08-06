/**
File Name : ai-fairytale-create.service
Description : AI 동화 스토리 생성 Service
Author : 이유민

History
Date        Author      Status      Description
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
2024.08.03  이유민      Modified    포인트 기능 추가
2024.08.03  이유민      Modified    타입 수정
2024.08.05  이유민      Modified    포인트 사용 수정
*/

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
import { AIFairytaleType } from 'src/modules/fairytale/type/ai-fairytale-create.type';
import { PointHistoryService } from 'src/modules/billing/point-history.service';

@Injectable()
export class AIFairytaleService {
    private readonly aiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        private readonly pointHistoryService: PointHistoryService,
        @InjectRepository(PointHistoryRepository)
        private readonly pointHistoryRepository: PointHistoryRepository,
    ) {
        this.aiUrl = this.configService.get('AI_SERVER_URL');
    }

    async generateFairytale(createAIFairytaleDto: CreateAIFairytaleDto): Promise<AIFairytaleType> {
        const { prompt } = createAIFairytaleDto;

        // 임시
        const user_id = 2; // 유저ID
        const storyPoints = 10; // 스토리 생성 시 사용되는 포인트

        // 포인트 확인 및 사용
        await this.pointHistoryService.usePoints(user_id, storyPoints, 'AI 스토리 생성');

        // 동화 생성
        const res = await firstValueFrom(this.httpService.post(`${this.aiUrl}/story`, { prompt }));
        return res.data;
    }
}
