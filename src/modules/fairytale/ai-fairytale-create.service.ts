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

@Injectable()
export class AIFairytaleService {
    constructor(private readonly httpService: HttpService) {}

    async generateFairytale(createAIFairytaleDto: CreateAIFairytaleDto): Promise<any> {
        const { prompt } = createAIFairytaleDto;
        const res = await this.httpService.post('http://127.0.0.1:5000/story', { prompt }).toPromise();
        return res.data;
    }
}
