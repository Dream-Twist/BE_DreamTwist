/**
File Name : point-rates.service
Description : 포인트 상품 관련 Service
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointRatesRepository } from 'src/modules/billing/repository/point-rates.repository';
import { PointRates } from 'src/modules/billing/entity/point-rates.entity';

@Injectable()
export class PointRatesService {
    constructor(@InjectRepository(PointRatesRepository) private readonly pointRatesRepository: PointRatesRepository) {}

    async findAll(): Promise<PointRates[]> {
        return this.pointRatesRepository.findAll();
    }

    async findPointsByAmount(amount: number): Promise<PointRates> {
        const points = await this.pointRatesRepository.findPointsByAmount(amount);

        if (!points) {
            throw new NotFoundException(`${amount}원의 포인트 상품이 없습니다.`);
        }

        return points;
    }
}
