/**
File Name : point-history.service
Description : 포인트 Service
Author : 이유민

History
Date        Author      Status      Description
2024.08.05  이유민      Created     
2024.08.05  이유민      Modified    포인트 사용 기능 추가
2024.08.06  이유민      Modified    트랜잭션 관리 추가
2024.08.08  이유민      Modified    회원가입 이벤트 추가
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

    async userPoints(user_id: number): Promise<number> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entityManager: EntityManager = queryRunner.manager;

            // 비로그인 상태일 경우 포인트 0
            if (!user_id) {
                return 0;
            }

            // 포인트 기록 검색
            const pointHistories = await this.pointHistoryRepository.findPointHistoryByUserId(user_id, entityManager);

            // 포인트 계산
            const userPoints = pointHistories.reduce((accumulator, current) => {
                return accumulator + current.remaining_balance;
            }, 0);

            await queryRunner.commitTransaction();

            return userPoints;
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

    async eventPoints(user_id: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entityManager: EntityManager = queryRunner.manager;

            await this.pointHistoryRepository.createPointHistory(
                {
                    user_id,
                    points: 100,
                    description: '회원가입 이벤트 코인',
                    remaining_balance: 100,
                },
                entityManager,
            );

            await queryRunner.commitTransaction();
            return;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
}
