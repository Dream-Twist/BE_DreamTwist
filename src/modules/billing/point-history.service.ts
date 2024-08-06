/**
File Name : point-history.service
Description : 포인트 Service
Author : 이유민

History
Date        Author      Status      Description
2024.08.05  이유민      Created     
2024.08.05  이유민      Modified    포인트 사용 기능 추가
*/

import { Injectable, ForbiddenException } from '@nestjs/common';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';

@Injectable()
export class PointHistoryService {
    constructor(private readonly pointHistoryRepository: PointHistoryRepository) {}

    async usePoints(user_id: number, usePoints: number, usageType: string): Promise<void> {
        // 사용자의 포인트 기록을 가져옵니다.
        const pointHistories = await this.pointHistoryRepository.findPointHistoryByUserId(user_id);

        // 사용자의 현재 포인트를 계산합니다.
        const userPoints = pointHistories.reduce((accumulator, current) => {
            return accumulator + current.remaining_balance;
        }, 0);

        // 포인트 확인
        if (userPoints < usePoints || !userPoints) {
            throw new ForbiddenException('포인트가 부족합니다.');
        }

        // 포인트 사용 내역 추가
        await this.pointHistoryRepository.createPointHistory({
            user_id,
            points: -1 * usePoints,
            description: usageType,
            remaining_balance: 0,
        });

        // 포인트 사용
        let remainingPoints = usePoints;
        for (const history of pointHistories) {
            if (remainingPoints <= 0) break;

            const pointsToDeduct = Math.min(remainingPoints, history.remaining_balance);
            history.remaining_balance -= pointsToDeduct;
            remainingPoints -= pointsToDeduct;

            await this.pointHistoryRepository.updatePointHistoryById(history.id, -1 * pointsToDeduct);
        }
    }
}
