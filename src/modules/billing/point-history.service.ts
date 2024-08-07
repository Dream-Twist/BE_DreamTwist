/**
File Name : point-history.service
Description : 포인트 Service
Author : 이유민

History
Date        Author      Status      Description
2024.08.05  이유민      Created     
2024.08.05  이유민      Modified    포인트 사용 기능 추가
2024.08.06  이유민      Modified    트랜잭션 관리 추가
*/

import { Injectable, ForbiddenException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';

@Injectable()
export class PointHistoryService {
    constructor(
        @InjectRepository(PointHistoryRepository)
        private readonly pointHistoryRepository: PointHistoryRepository,
        private readonly dataSource: DataSource,
    ) {}

    async userPoints(): Promise<object> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entityManager: EntityManager = queryRunner.manager;

            // 임시
            const user_id = 2;

            // 포인트 기록 검색
            const pointHistories = await this.pointHistoryRepository.findPointHistoryByUserId(user_id, entityManager);

            // 포인트 계산
            const userPoints = pointHistories.reduce((accumulator, current) => {
                return accumulator + current.remaining_balance;
            }, 0);

            return { userPoints };
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async usePoints(
        user_id: number,
        usePoints: number,
        usageType: string,
        entityManager: EntityManager,
    ): Promise<void> {
        // 포인트 기록 검색
        const pointHistories = await this.pointHistoryRepository.findPointHistoryByUserId(user_id, entityManager);

        // 포인트 계산
        const userPoints = pointHistories.reduce((accumulator, current) => {
            return accumulator + current.remaining_balance;
        }, 0);

        if (userPoints < usePoints || !userPoints) {
            throw new ForbiddenException('포인트가 부족합니다.');
        }

        // 포인트 사용 내역 추가
        await this.pointHistoryRepository.createPointHistory(
            {
                user_id,
                points: -1 * usePoints,
                description: usageType,
                remaining_balance: 0,
            },
            entityManager,
        );

        // 포인트 사용
        let remainingPoints = usePoints;
        for (const history of pointHistories) {
            if (remainingPoints <= 0) break;

            const pointsToDeduct = Math.min(remainingPoints, history.remaining_balance);
            history.remaining_balance -= pointsToDeduct;
            remainingPoints -= pointsToDeduct;

            await this.pointHistoryRepository.updatePointHistoryById(history.id, -1 * pointsToDeduct, entityManager);
        }
    }
}
