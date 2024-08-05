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

    async findPointHistoryByUserId(user_id: number): Promise<PointHistory[]> {
        const res = await this.dataSource
            .getRepository(PointHistory)
            .createQueryBuilder('ph')
            .select(['ph.id', 'ph.payment_id', 'ph.remaining_balance'])
            .where('ph.user_id = :user_id AND ph.remaining_balance > 0', { user_id })
            .orderBy('ph.created_at', 'ASC')
            .getMany();

        return res;
    }

    async findPointHistoryByPaymentId(payment_id: number): Promise<PointHistory[]> {
        const res = await this.dataSource
            .getRepository(PointHistory)
            .createQueryBuilder('ph')
            .select(['ph.id', 'ph.payment_id', 'ph.points', 'ph.remaining_balance'])
            .where('ph.payment_id = :payment_id', { payment_id })
            .orderBy('ph.id', 'ASC')
            .getMany();

        return res;
    }

    async updatePointHistoryById(id: number, pointToUse: number): Promise<object> {
        const history = await this.findOne({ where: { id } });
        history.remaining_balance += pointToUse;
        this.save(history);

        return { message: '사용 내역이 수정되었습니다.' };
    }

    async updatePointHistoryByPaymentId(payment_id: number): Promise<object> {
        const history = await this.findOne({ where: { payment_id } });
        history.remaining_balance = 0;
        this.save(history);

        return { message: '사용 내역이 수정되었습니다.' };
    }
}
