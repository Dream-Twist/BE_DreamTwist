/**
File Name : ai-fairytale-image-create.service
Description : AI 동화 이미지 생성 Service
Author : 원경혜

History
Date        Author      Status      Description
2024.08.01  원경혜      Created     
2024.08.02  원경혜      Modified    AI 동화 이미지 생성 기능 추가
2024.08.03  원경혜      Modified    생성된 이미지 S3 업로드 및 URL 생성
*/

import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
// import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { CreateAIFairytaleDto } from 'src/modules/fairytale/dto/ai-fairytale-create.dto';
import { FairytaleImgRepository } from 'src/modules/fairytale/repository/fairytale-img.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { S3Service } from 'src/modules/s3.service';
import { Readable } from 'stream';
// import { CreateFairytaleImgDto } from './dto/fairytale-img.dto';

@Injectable()
export class AIFairytaleImageService {
    private readonly aiImageEngineId: string;
    private readonly aiImageApiHost: string;
    private readonly aiImageApiKey: string;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        @InjectRepository(FairytaleImgRepository)
        private readonly fairytaleImgRepository: FairytaleImgRepository,
        private readonly s3Service: S3Service,
    ) {
        this.aiImageEngineId = this.configService.get<string>('AI_IMAGE_ENGINE_ID') ?? 'stable-diffusion-v1-6';
        this.aiImageApiHost = this.configService.get<string>('AI_IMAGE_API_HOST') ?? 'https://api.stability.ai';
        this.aiImageApiKey = this.configService.get<string>('AI_IMAGE_API_KEY');

        if (!this.aiImageApiKey) {
            throw new HttpException('API키 값이 존재하지 않습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async generateAndUploadAiImage(createAIFairytaleDto: CreateAIFairytaleDto): Promise<string> {
        // 임시 사용자
        // const userId = 1;
        // const user = await this.userRepository.findOne({ where: { id: userId } });

        // if (!user) {
        //     throw new Error('회원을 찾을 수 없습니다.');
        // }

        // AI 이미지 생성 - Stability.ai API 접속
        const { prompt } = createAIFairytaleDto;
        const url = `${this.aiImageApiHost}/v1/generation/${this.aiImageEngineId}/text-to-image`;
        const payload = {
            cfg_scale: 35,
            height: 448,
            width: 448,
            samples: 1,
            steps: 50,
            seed: 1,
            style_preset: 'digital-art',
            text_prompts: [
                {
                    text: prompt,
                },
            ],
        };

        console.log(this.aiImageApiKey);
        console.log(prompt);
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
            throw new HttpException(
                `상태 코드가 200이 아닌 응답: ${res?.statusText || '응답 데이터 없음'}`,
                res?.status || 500,
            );
        }

        console.log('api 요청 및 이미지 생성 성공');

        const fileName = `temp_ai_img.png`;

        // S3에 이미지 업로드
        const imageUrl = await this.s3Service.uploadAiImage(fileName, res.data as Readable);

        // // DB에 URL 저장 - 도헌님과 상의 후, 구현 예정
        // const aiImg = await this.fairytaleImgRepository.createFairytaleImg({
        //     fairytaleId: fairytale.id,
        //     creationWay: CreateFairytaleImgDto.creationWay,
        //     path: imageUrl,
        // });

        return imageUrl;
    }
}
