/**
File Name : fairytale-board.repository
Description : 동화 스토리 생성 Repository
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created
2024.07.22  강민규      Modified    create 리포지토리 기반
2024.07.25  강민규      Modified    GET: 유저의 동화 목록 조회
2024.07.26  강민규      Modified    DELETE: 동화 스토리 및 줄거리 제거
2024.07.27  강민규      Modified    GET: 동화 목록 및 특정 동화 세부 조회
2024.07.30  강민규      Modified    GET: 조회수 기록
2024.07.31  강민규      Modified    GET: 동화 목록 최신순 검색, 닉네임 이미지 조회 
2024.08.03  강민규      Modified    PUT: 동화 작성자가 수정
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
@Injectable()
export class BoardFairytaleRepository extends Repository<Fairytale> {
    constructor(private dataSource: DataSource) {
        super(Fairytale, dataSource.createEntityManager());
    }

    // 최신 순 작성된 동화 조회
    async findAllByUserId() {
        // 유저 닉네임만
        const users = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('users')
            .select(['users.id', 'users.nickname'])
            .getMany();
        // 매핑
        const userNicknameMap = new Map<number, string>(users.map(user => [user.id, user.nickname]));
        //동화 목록
        const fairytales = await this.createQueryBuilder('fairytale').where('fairytale.privatedAt IS NULL').getMany();
        // 동화 삽화
        const images = await this.dataSource.getRepository(FairytaleImg).createQueryBuilder('fairytale_img').getMany();
        // 매핑
        const fairytaleImageMap = images.reduce(
            (map, img) => {
                if (!map[img.fairytaleId]) {
                    map[img.fairytaleId] = [];
                }
                map[img.fairytaleId].push(img);
                return map;
            },
            {} as Record<number, FairytaleImg[]>,
        );
        const formattedFairytales = fairytales.map(fairytale => {
            const images = fairytaleImageMap[fairytale.id] || []; //JSON이 아닌 오브젝트
            const paths = Object.values(images[0].path);
            const coverImage = paths.length > 0 ? paths[0] : null;
            return {
                fairytaleId: fairytale.id,
                title: fairytale.title,
                theme: fairytale.theme,
                nickname: userNicknameMap.get(fairytale.userId) || 'Unknown',
                coverImage: coverImage,
                createdAt: fairytale.createdAt || 'unknown',
            };
        });

        return formattedFairytales;
    }

    //조회 수 기록
    async recordViews(fairytaleId: number, userId: number): Promise<void> {
        await this.createQueryBuilder()
            .insert()
            .into('views')
            .values({
                user: { id: userId },
                fairytale: { id: fairytaleId },
            })
            .execute();
    }

    //해당 동화 조회 수 확인
    async getViewCount(fairytaleId: number): Promise<number> {
        const count = await this.createQueryBuilder('views')
            .where('views.id = :fairytaleId', { fairytaleId })
            .getCount();
        return count;
    }

    //동화 세부
    async findByIdWithContent(fairytaleId: number, userId: number) {
        // 유저 닉네임 id만
        const users = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('users')
            .select(['users.id', 'users.nickname'])
            .where('users.id = id', { userId })
            .getOne();
        // 매핑
        const userNickname = users ? users.nickname : 'Unknown';
        // 동화 줄거리
        const fairytales = await this.createQueryBuilder('fairytale')
            .andWhere('fairytale.id = :fairytaleId', { fairytaleId })
            .getMany();
        // 동화 삽화
        const images = await this.dataSource
            .getRepository(FairytaleImg)
            .createQueryBuilder('fairytale_img')
            .where('fairytale_img.id = :fairytaleId', { fairytaleId })
            .getMany();
        // 매핑
        const fairytaleImageMap = images.reduce(
            (map, img) => {
                if (!map[img.fairytaleId]) {
                    map[img.fairytaleId] = [];
                }
                map[img.fairytaleId].push(img);
                return map;
            },
            {} as Record<number, FairytaleImg[]>,
        );

        const formattedFairytales = fairytales.map(fairytale => {
            const images = fairytaleImageMap[fairytale.id] || []; //JSON이 아닌 오브젝트
            const paths = Object.values(images[0].path);
            const coverImage = paths.length > 0 ? paths[0] : null;
            const contentImages = paths.length > 1 ? paths.slice(1) : [];
            return {
                userId: fairytale.userId,
                nickname: userNickname,
                fairytaleId: fairytale.id,
                title: fairytale.title,
                theme: fairytale.theme,
                content: fairytale.content,
                coverImage: coverImage,
                images: contentImages,
            };
        });
        return formattedFairytales;
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
