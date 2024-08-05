/**
File Name : point-usage.repository
Description : 포인트 개별 사용내역 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.04  이유민      Created     
2024.08.04  이유민      Modified    포인트 개별 내역 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { PointUsage } from 'src/modules/billing/entity/point-usage.entity';

@Injectable()
export class PointUsageRepository extends Repository<PointUsage> {
    constructor(private dataSource: DataSource) {
        super(PointUsage, dataSource.createEntityManager());
    }

    async createPointUsage(PointUsageData: Partial<PointUsage>): Promise<PointUsage> {
        const point_usage = this.create(PointUsageData);
        return this.save(point_usage);
    }
}
