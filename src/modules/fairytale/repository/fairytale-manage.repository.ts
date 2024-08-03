/**
File Name : fairytale-manage.repository
Description : 동화 스토리 생성, 수정, 삭제 Repository
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.08.03  박수정      Modified    Repository 분리 - 조회 / 생성, 수정, 삭제
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';

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
            throw error;
        } finally {
            // 쿼리 해제
            await queryRunner.release();
        }
    }
}
