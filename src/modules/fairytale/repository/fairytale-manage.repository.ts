/**
File Name : fairytale-manage.repository
Description : 동화 스토리 생성, 수정, 삭제 Repository
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.08.03  박수정      Modified    Repository 분리 - 조회 / 생성, 수정, 삭제
2024.08.07  강민규      Modified    POST: 좋아요 기록
2024.08.08  강민규      Modified    POST: 동화 좋아요 회원 연결 
*/

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { FairytaleLike } from '../entity/fairytale-likes.entity';

@Injectable()
export class ManageFairytaleRepository extends Repository<Fairytale> {
    constructor(private dataSource: DataSource) {
        super(Fairytale, dataSource.createEntityManager());
    }

    // 동화 스토리 생성
    async createFairytale(fairytaleData: Partial<Fairytale>): Promise<Fairytale> {
        const fairytale = this.create(fairytaleData);
        return this.save(fairytale);
    }

    // 좋아요 기록
    async createFairytaleLike(fairytaleId: number, userId: number): Promise<{ message: string }> {
        const likeRepository = this.dataSource.getRepository(FairytaleLike);
        const fairytale = await this.createQueryBuilder('fairytale')
            .where('fairytale.id = :fairytaleId', { fairytaleId })
            .andWhere('fairytale.privated_at is NULL')
            .andWhere('fairytale.deleted_at is NULL')
            .getOne();
        if (!fairytale) {
            throw new NotFoundException(`동화 ${fairytaleId} 번은 비공개이거나 이미 삭제되었습니다.`);
        }
        // 동일 유저의 좋아요 수 확인
        const existingLike = await likeRepository.findOne({
            where: { userId, fairytaleId },
        });

        if (existingLike) {
            // 좋아요 기록이 있을 때 반복하면 기록 삭제 (짝수)
            await likeRepository.delete({
                userId,
                fairytaleId,
            });
            console.log(`${userId} 유저가 동화 ${userId}번 좋아요 삭제`);
            return { message: `좋아요가 성공적으로 해제되었습니다.` };
        } else {
            // 좋아요 기록이 없을 때 기록 생성 (홀수)
            const newLike = likeRepository.create({
                userId,
                fairytaleId,
            });
            await likeRepository.save(newLike);
            console.log(`${userId} 유저가 동화 ${userId}번 좋아요 추가`);
            return { message: `좋아요가 성공적으로 추가되었습니다.` };
        }
    }

    // 동화 수정
    async updateFairytale(id: number, fairytaleData: Partial<Fairytale>): Promise<Fairytale> {
        const currentTime = new Date();
        const updateData = {
            ...fairytaleData,
            updatedAt: currentTime,
        };

        await this.update(id, updateData);
        return this.findOneBy({ id });
    }

    // 동화 삭제 및 비공개
    async softDeleteFairytale(id: number): Promise<void> {
        const queryRunner = this.dataSource.getRepository(Fairytale).manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const currentTime = new Date();

            // 동화가 있는지 확인
            const fairytale = await queryRunner.manager.findOne(Fairytale, { where: { id, deletedAt: null } });
            if (!fairytale) {
                throw new NotFoundException(`${id}번 동화를 찾을 수 없습니다`);
            }

            // 동화 삭제
            await queryRunner.manager.update(Fairytale, id, { deletedAt: currentTime, privatedAt: currentTime });

            // 이미지 삭제
            await queryRunner.manager.update(FairytaleImg, { fairytaleId: id }, { deletedAt: currentTime });

            // 성공
            await queryRunner.commitTransaction();
        } catch (error) {
            // 롤백
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('동화 삭제 중 오류가 발생했습니다');
        } finally {
            // 쿼리 해제
            await queryRunner.release();
        }
    }
}
