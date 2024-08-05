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
*/

import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { UserRepository } from 'src/modules/user/user.repository';
import { nanoid } from 'nanoid';
import { S3Service } from 'src/modules/s3.service';
import { Readable } from 'stream';
import * as deepl from 'deepl-node';
import { InjectRepository } from '@nestjs/typeorm';

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
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
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
    // 회원 기능이 추가되면 userId: number 추가
    private async translatePrompt(prompt: string): Promise<string> {
        // 유저 확인 - 임시 사용자
        const userId = 1;
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        try {
            const result = await this.deeplTranslator.translateText(prompt, 'ko', 'en-US');
            console.log(result.text);
            return result.text;
        } catch (err) {
            console.error('번역 실패:', err);
            throw new InternalServerErrorException('번역에 실패하였습니다.');
        }
    }

    // AI 이미지 생성 - Stability.ai API 접속
    // 회원 기능이 추가되면 userId: number 추가
    async generateAndUploadAiImage(createAIFairytaleDto: CreateAIFairytaleDto): Promise<string> {
        // 임시 사용자
        const userId = 1;
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

        console.log(this.aiImageApiKey);
        console.log(url);

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

        console.log('api 요청 및 이미지 생성 성공');

        // S3에 이미지 업로드
        const folderId = nanoid(6);
        const fileName = `ai_img/${userId}/${folderId}/${Date.now()}-ai-img.png`;
        const imageUrl = await this.s3Service.uploadAiImage(fileName, res.data as Readable);
        return imageUrl;
    }
}