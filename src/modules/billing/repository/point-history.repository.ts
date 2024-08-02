/**
File Name : point-history.repository
Description : 포인트 내역 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { PointHistory } from 'src/modules/billing/entity/point-history.entity';

@Injectable()
export class PointHistoryRepository extends Repository<PointHistory> {
    constructor(private dataSource: DataSource) {
        super(PointHistory, dataSource.createEntityManager());
    }

    async createPointHistory(PointHistoryData: Partial<PointHistory>): Promise<PointHistory> {
        const point_history = this.create(PointHistoryData);
        return this.save(point_history);
    }
}
