/**
File Name : point-history.repository
Description : 포인트 내역 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
2024.08.05  이유민      Modified    결제 전체 수정
2024.08.06  이유민      Modified    트랜잭션 관리 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { PointHistory } from 'src/modules/billing/entity/point-history.entity';

@Injectable()
export class PointHistoryRepository extends Repository<PointHistory> {
    async createPointHistory(
        PointHistoryData: Partial<PointHistory>,
        entityManager: EntityManager,
    ): Promise<PointHistory> {
        const point_history = entityManager.create(PointHistory, PointHistoryData);
        return await entityManager.save(point_history);
    }

    async findPointHistoryByUserId(user_id: number, entityManager: EntityManager): Promise<PointHistory[]> {
        const res = await entityManager
            .getRepository(PointHistory)
            .createQueryBuilder('ph')
            .select(['ph.id', 'ph.payment_id', 'ph.remaining_balance'])
            .where('ph.user_id = :user_id AND ph.remaining_balance > 0', { user_id })
            .orderBy('ph.createdAt', 'ASC')
            .getMany();

        return res;
    }

    async findPointHistoryByPaymentId(payment_id: string, entityManager: EntityManager): Promise<PointHistory[]> {
        const res = await entityManager
            .getRepository(PointHistory)
            .createQueryBuilder('ph')
            .select(['ph.id', 'ph.payment_id', 'ph.points', 'ph.remaining_balance', 'ph.description', 'ph.createdAt'])
            .where('ph.payment_id = :payment_id', { payment_id })
            .orderBy('ph.id', 'ASC')
            .getMany();

        return res;
    }

    async updatePointHistoryById(id: number, pointToUse: number, entityManager: EntityManager): Promise<object> {
        const history = await entityManager.findOne(PointHistory, { where: { id } });
        history.remaining_balance += pointToUse;
        await entityManager.save(history);

        return { message: '사용 내역이 수정되었습니다.' };
    }

    async updatePointHistoryByPaymentId(
        payment_id: string,
        description: string,
        entityManager: EntityManager,
    ): Promise<object> {
        const history = await entityManager.findOne(PointHistory, { where: { payment_id } });
        history.remaining_balance = 0;
        history.description = description;
        await entityManager.save(history);

        return { message: '사용 내역이 수정되었습니다.' };
    }
}
