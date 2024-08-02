/**
File Name : ai-fairytale-create.service
Description : AI 동화 스토리 생성 Service
Author : 이유민

History
Date        Author      Status      Description
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateAIFairytaleDto } from './dto/ai-fairytale-create.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AIFairytaleService {
    private readonly aiUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.aiUrl = this.configService.get('AI_SERVER_URL');
    }

    async generateFairytale(createAIFairytaleDto: CreateAIFairytaleDto): Promise<any> {
        const { prompt } = createAIFairytaleDto;
        const res = await this.httpService.post(`${this.aiUrl}/story`, { prompt }).toPromise();
        return res.data;
    }
}
