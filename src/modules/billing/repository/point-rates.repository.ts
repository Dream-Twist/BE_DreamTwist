/**
File Name : point-rates.repository
Description : 포인트 상품 관련 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { PointRates } from 'src/modules/billing/entity/point-rates.entity';

@Injectable()
export class PointRatesRepository extends Repository<PointRates> {
    constructor(private dataSource: DataSource) {
        super(PointRates, dataSource.createEntityManager());
    }

    // 포인트 상품 생성
    async createPointRates(PointRatesData: Partial<PointRates>): Promise<PointRates> {
        const rates = this.create(PointRatesData);
        return this.save(rates);
    }

    // 포인트 상품 전체 조회 메서드
    async findAll(): Promise<PointRates[]> {
        const rates = await this.dataSource
            .getRepository(PointRates)
            .createQueryBuilder('pointRates')
            .select(['pointRates.id', 'pointRates.points', 'pointRates.amount'])
            .getMany();
        return rates;
    }

    async findPointsByAmount(amount: number): Promise<PointRates | undefined> {
        const res = await this.dataSource
            .getRepository(PointRates)
            .createQueryBuilder('pointRates')
            .select(['pointRates.points'])
            .where('pointRates.amount = :amount', { amount })
            .getOne();

        return res;
    }
}
