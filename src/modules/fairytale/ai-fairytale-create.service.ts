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
2024.08.06  이유민      Modified    트랜잭션 관리 추가
2024.08.08  이유민      Modified    userId 수정
2024.08.08  이유민      Modified    금지어 확인 추가
*/

import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { AIFairytaleType } from 'src/modules/fairytale/type/ai-fairytale-create.type';
import { PointHistoryService } from 'src/modules/billing/point-history.service';
import { ForbiddenWordRepository } from 'src/modules/fairytale/repository/fairytale-forbidden-word.repository';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class AIFairytaleService {
    private readonly aiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        private readonly pointHistoryService: PointHistoryService,
        private readonly dataSource: DataSource,
        private readonly forbiddenWordRepository: ForbiddenWordRepository,
    ) {
        this.aiUrl = this.configService.get('AI_SERVER_URL');
    }

    async generateFairytale(user_id: number, createAIFairytaleDto: CreateAIFairytaleDto): Promise<AIFairytaleType> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entityManager: EntityManager = queryRunner.manager;
            const { prompt } = createAIFairytaleDto;

            const storyPoints = 10; // 스토리 생성 시 사용되는 포인트

            if (!user_id) {
                throw new ForbiddenException('로그인 후 사용 가능합니다.');
            }

            // 금지어 확인
            await this.checkForbiddenWords([prompt]);

            // 포인트 확인 및 사용
            await this.pointHistoryService.usePoints(user_id, storyPoints, 'AI 스토리 생성', entityManager);

            // 동화 생성
            const res = await firstValueFrom(this.httpService.post(`${this.aiUrl}/story`, { prompt }));

            await queryRunner.commitTransaction();

            return res.data;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    // 금지어 설정
    async checkForbiddenWords(texts: string[]): Promise<void> {
        const forbiddenWords = await this.forbiddenWordRepository.getAllForbiddenWords();
        const foundForbiddenWords: string[] = [];

        for (const text of texts) {
            for (const word of forbiddenWords) {
                if (text.includes(word.forbiddenWord)) {
                    foundForbiddenWords.push(word.forbiddenWord);
                }
            }
        }

        if (foundForbiddenWords.length > 0) {
            throw new BadRequestException(`입력 불가한 금지어가 포함되어 있습니다: ${foundForbiddenWords.join(', ')}`);
        }
    }
}
