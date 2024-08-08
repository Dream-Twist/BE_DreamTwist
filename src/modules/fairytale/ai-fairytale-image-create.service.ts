/**
File Name : ai-fairytale-image-create.service
Description : AI 동화 이미지 생성 Service
Author : 원경혜

History
Date        Author      Status      Description
2024.08.01  원경혜      Created     
2024.08.02  원경혜      Modified    AI 동화 이미지 생성 기능 API 추가
2024.08.03  원경혜      Modified    생성된 이미지 S3 업로드 및 URL 생성
2024.08.04  원경혜      Modified    번역 기능 API 추가
2024.08.04  원경혜      Modified    유저 확인(임시) 기능 추가 및 S3 업로드 경로, 파일명 수정
2024.08.05  이유민      Modified    포인트 사용 추가
2024.08.06  이유민      Modified    트랜잭션 관리 추가
2024.08.08  이유민      Modified    userId 수정
2024.08.08  이유민      Modified    금지어 확인 추가
*/

import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { nanoid } from 'nanoid';
import { S3Service } from 'src/modules/s3.service';
import { Readable } from 'stream';
import * as deepl from 'deepl-node';
import { PointHistoryService } from 'src/modules/billing/point-history.service';
import { AIFairytaleService } from 'src/modules/fairytale/ai-fairytale-create.service';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class AIFairytaleImageService {
    private readonly aiImageEngineId: string;
    private readonly aiImageApiHost: string;
    private readonly aiImageApiKey: string;
    private readonly deeplAuthKey: string;
    private readonly deeplTranslator: deepl.Translator;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        private readonly s3Service: S3Service,
        private readonly pointHistoryService: PointHistoryService,
        private readonly aiFairytaleService: AIFairytaleService,
        private readonly dataSource: DataSource,
    ) {
        this.aiImageEngineId = this.configService.get<string>('AI_IMAGE_ENGINE_ID') ?? 'stable-diffusion-v1-6';
        this.aiImageApiHost = this.configService.get<string>('AI_IMAGE_API_HOST') ?? 'https://api.stability.ai';
        this.aiImageApiKey = this.configService.get<string>('AI_IMAGE_API_KEY');
        this.deeplAuthKey = this.configService.get<string>('DEEPL_API_KEY');

        if (!this.deeplAuthKey) {
            throw new InternalServerErrorException('DeepL API키 값이 존재하지 않습니다.');
        }
        if (!this.aiImageApiKey) {
            throw new InternalServerErrorException('AI 이미지 생성 API키 값이 존재하지 않습니다.');
        }
        this.deeplTranslator = new deepl.Translator(this.deeplAuthKey);
    }

    // AI 이미지 생성 전, 프롬프트 번역
    private async translatePrompt(prompt: string): Promise<string> {
        try {
            const result = await this.deeplTranslator.translateText(prompt, 'ko', 'en-US');
            return result.text;
        } catch (err) {
            throw new InternalServerErrorException('번역에 실패하였습니다.');
        }
    }

    // AI 이미지 생성 - Stability.ai API 접속
    async generateAndUploadAiImage(userId: number, createAIFairytaleDto: CreateAIFairytaleDto): Promise<string> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entityManager: EntityManager = queryRunner.manager;

            // 이미지 생성 시 사용될 포인트
            const imagePoints = 10;

            if (!userId) {
                throw new ForbiddenException('로그인 후 사용 가능합니다.');
            }

            // 금지어 확인
            await this.aiFairytaleService.checkForbiddenWords([createAIFairytaleDto.prompt]);

            // 포인트 확인 및 사용
            await this.pointHistoryService.usePoints(userId, imagePoints, 'AI 이미지 생성', entityManager);

            const translatePrompt = await this.translatePrompt(createAIFairytaleDto.prompt);
            const url = `${this.aiImageApiHost}/v1/generation/${this.aiImageEngineId}/text-to-image`;
            const payload = {
                cfg_scale: 35,
                height: 448,
                width: 448,
                samples: 1,
                steps: 50,
                seed: 42,
                style_preset: 'digital-art',
                text_prompts: [
                    {
                        text: translatePrompt,
                    },
                ],
            };

            const res = await firstValueFrom(
                this.httpService.post(url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'image/png',
                        Authorization: `Bearer ${this.aiImageApiKey}`,
                    },
                    responseType: 'stream',
                }),
            );

            if (!res || !res.data) {
                throw new InternalServerErrorException('API 요청 실패 및 응답 데이터가 없습니다.');
            }

            // S3에 이미지 업로드
            const folderId = nanoid(6);
            const fileName = `ai_img/${userId}/${folderId}/${Date.now()}-ai-img.png`;
            const imageUrl = await this.s3Service.uploadAiImage(fileName, res.data as Readable);

            await queryRunner.commitTransaction();

            return imageUrl;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
}
