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
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Fairytale } from '../entity/fairytale.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { FairytaleImg } from '../entity/fairytale-img.entity';
// import { BoardFairytaleDto } from '../dto/fairytale-board.dto';
// import { Views } from '../entity/fairytale-views.entity';
// import { Likes } from '../entity/fairytale-views.entity';
@Injectable()
export class BoardFairytaleRepository extends Repository<Fairytale> {
    constructor(private dataSource: DataSource) {
        super(Fairytale, dataSource.createEntityManager());
    }

    // 최신 순 작성된 동화 조회
    async findAllByUserId() {
        try {
            // 유저 닉네임만
            const users = await this.dataSource
                .getRepository(User)
                .createQueryBuilder('users')
                .select(['users.id', 'users.nickname'])
                .getMany();
            // 매핑
            const userNicknameMap = new Map<number, string>(users.map(user => [user.id, user.nickname]));
            //동화 목록
            const fairytales = await this.createQueryBuilder('fairytale')
                // 최신순 정렬
                // .orderBy('fairytale.createdAt', 'DESC')
                .where('fairytale.privatedAt IS NULL')
                .getMany();
            // 동화 삽화
            const images = await this.dataSource
                .getRepository(FairytaleImg)
                .createQueryBuilder('fairytale_img')
                // 최신순 정렬
                // .orderBy('fairytale_img.createdAt', 'DESC')
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
                    title: fairytale.title,
                    theme: fairytale.theme,
                    nickname: userNicknameMap.get(fairytale.userId) || 'Unknown',
                    content: fairytale.content,
                    coverImage: coverImage,
                    images: contentImages,
                };
            });

            return formattedFairytales;
        } catch (error) {
            throw new NotFoundException('동화 목록을 조회할 수 없습니다.');
        }
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

    //찾는 동화 세부
    async findByIdWithContent(fairytaleId: number): Promise<Fairytale[]> {
        return (
            this.createQueryBuilder('fairytale')
                .leftJoin('fairytale.user', 'user')
                .addSelect('user.nickname')
                .leftJoinAndSelect('fairytale.content', 'content')
                .leftJoinAndSelect('fairytale.image', 'path')
                // 최신순 정렬
                .orderBy('fairytale.createdAt', 'DESC')
                .where('fairytale.id = :fairytaleId', { fairytaleId })
                .getMany()
        );
    }

    //좋아요 수 추가, 아직 작동 안 함
    // async incrementLikes(fairytaleId: number) {
    //     return this.createQueryBuilder()
    //         .update(Likes)
    //         .set({ likes: () => 'likes + 1' })
    //         .where('fairytale.id = :fairytaleId', { fairytaleId })
    //         .execute();
    // }

    // 동화 수정
    async updateFairytale() {}

    // 동화 삭제
    async softDeleteFairytale(id: number): Promise<void> {
        await this.update(id, { deletedAt: new Date() });
    }
}
