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
*/

import { Injectable, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { PointRepository } from 'src/modules/billing/repository/point.repository';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
import { AIFairytaleType } from 'src/modules/fairytale/type/ai-fairytale-create.type';

@Injectable()
export class AIFairytaleService {
    private readonly aiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        @InjectRepository(PointRepository)
        private readonly pointRepository: PointRepository,
        @InjectRepository(PointHistoryRepository)
        private readonly pointHistoryRepository: PointHistoryRepository,
    ) {
        this.aiUrl = this.configService.get('AI_SERVER_URL');
    }

    async generateFairytale(createAIFairytaleDto: CreateAIFairytaleDto): Promise<AIFairytaleType> {
        const { prompt } = createAIFairytaleDto;

        // 임시
        const user_id = 2; // 유저ID
        const storyPoints = 3; // 스토리 생성 시 사용되는 포인트

        // 해당 사용자의 현재 포인트 검색
        const pointsByUser = await this.pointRepository.findPointByUserId(user_id);

        // 포인트 확인(일단 ai 스토리 생성이 1포인트라고 가정)
        if (pointsByUser.points < storyPoints || !pointsByUser) {
            throw new ForbiddenException('포인트가 부족합니다.');
        }

        // 포인트 관련
        await Promise.all([
            // 유저 포인트 변경
            this.pointRepository.updatePointByUserId(user_id, -1 * storyPoints),
            // 포인트 내역 추가
            this.pointHistoryRepository.createPointHistory({
                user_id,
                points: -1 * storyPoints,
                description: 'AI 스토리 생성',
            }),
        ]);

        const res = await firstValueFrom(this.httpService.post(`${this.aiUrl}/story`, { prompt }));
        return res.data;
    }
}
