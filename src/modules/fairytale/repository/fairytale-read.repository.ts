/**
File Name : fairytale-read.repository
Description : 동화 스토리 조회 Repository
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
2024.08.03  박수정      Modified    Repository 분리 - 조회 / 생성, 수정, 삭제
2024.08.06  강민규      Modified    GET: 동화 제목 태그 조회 / 모든 목록 조회 최신순 정렬
2024.08.05  박수정      Modified    나의 동화 기능 추가
2024.08.07  강민규      Modified    GET: 세부 동화 조회: 좋아요 추가
2024.08.07  강민규      Modified    GET: 조회 기록 생성 옮김 -> fairytale-manage
*/

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { Views } from '../entity/fairytale-views.entity';
import { FairytaleLike } from '../entity/fairytale-likes.entity';
@Injectable()
export class ReadFairytaleRepository extends Repository<Fairytale> {
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
        const fairytales = await this.createQueryBuilder('fairytale')
            .where('fairytale.privatedAt IS NULL')
            .orderBy('fairytale.createdAt', 'DESC')
            .getMany();
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

    //해당 동화 조회 수 확인
    async getViewCount(fairytaleId: number): Promise<number> {
        // 동화 탐색
        const fairytale = await this.createQueryBuilder('fairytale')
            .where('fairytale.id = :fairytaleId', { fairytaleId })
            .select(['fairytale.userId'])
            .getOne();
        if (!fairytale) {
            throw new NotFoundException(`동화 ${fairytaleId} 번은 비공개이거나 이미 삭제되었습니다.`);
        }
        const viewCount = await this.dataSource
            .getRepository(Views)
            .createQueryBuilder('views')
            .where('views.fairytale_id = :fairytaleId', { fairytaleId })
            .getCount();
        return viewCount;
    }

    //해당 동화 좋아요 수 확인
    async getLikeCount(fairytaleId: number): Promise<number> {
        // 동화 탐색
        const fairytale = await this.createQueryBuilder('fairytale')
            .where('fairytale.id = :fairytaleId', { fairytaleId })
            // .andWhere('fairytale.privated_at is NULL')
            // .andWhere('fairytale.deleted_at is NULL')
            .select(['fairytale.userId'])
            .getOne();
        if (!fairytale) {
            throw new NotFoundException(`동화 ${fairytaleId} 번은 비공개이거나 이미 삭제되었습니다.`);
        }

        const likeCount = await this.dataSource
            .getRepository(FairytaleLike)
            .createQueryBuilder('fairytale_like')
            .where('fairytale_like.fairytaleId = :fairytaleId', { fairytaleId })
            .getCount();
        return likeCount;
    }

    //동화 세부
    async findByIdWithContent(fairytaleId: number) {
        // 동화 줄거리
        const fairytales = await this.createQueryBuilder('fairytale')
            .andWhere('fairytale.id = :fairytaleId', { fairytaleId })
            .getMany();
        // 유저 닉네임 id만
        const userIds = fairytales.map(fairytale => fairytale.userId);
        const users = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('users')
            .select(['users.id', 'users.nickname'])
            .whereInIds(userIds)
            .getOne();
        // 매핑
        const userNickname = users ? users.nickname : 'Unknown';
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
        //조회수
        const viewCount = await this.getViewCount(fairytaleId);
        // 좋아요 수
        const likeCount = await this.getLikeCount(fairytaleId);
        const formattedFairytales = fairytales.map(fairytale => {
            const images = fairytaleImageMap[fairytale.id] || []; //JSON이 아닌 오브젝트
            const paths = images.length > 0 && images[0].path ? Object.values(images[0].path) : [];
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
                views: viewCount,
                likes: likeCount,
                privatedAt: fairytale.privatedAt,
            };
        });
        return formattedFairytales;
    }

    // 동화 제목, 태그 검색
    async getAllbyFilter(sortOrder: string, title?: string, tags?: string | string[]) {
        // 제목 태그 둘 중 하나는 없을 수 있음
        const titleIsValid = title && title.length > 0;
        const tagsIsValid =
            tags && ((typeof tags === 'string' && tags.length > 0) || (Array.isArray(tags) && tags.length > 0));
        if (!titleIsValid && !tagsIsValid) {
            throw new BadRequestException('제목과 태그가 둘 다 없을 수는 없습니다!');
        }
        const queryBuilder = this.createQueryBuilder('fairytale');
        if (title) {
            queryBuilder.where('fairytale.title LIKE :title', {
                title: `%${title}%`,
            });
        }

        // 태그는 복수로 추가 가능
        const tagList = ['우화', '환경', '사랑', '모험', '추리', '기타', '모든 주제'];
        let tagsArray: string[] = [];
        if (typeof tags === 'string') {
            if (tags === '모든 주제') {
                tagsArray = tagList.filter(tag => tag !== '모든 주제');
            } else {
                tagsArray = [tags];
            }
        } else if (Array.isArray(tags)) {
            if (tags.includes('모든 주제')) {
                tagsArray = tagList.filter(tag => tag !== '모든 주제');
            } else {
                tagsArray = tags;
            }
        }
        for (const tag of tagsArray) {
            if (!tagList.includes(tag)) {
                throw new NotFoundException(`태그 ${tag}는 유효하지 않습니다.`);
            }
        }
        if (tagsArray.length > 0) {
            queryBuilder.andWhere('fairytale.theme IN (:...tags)', { tags: tagsArray });
        }

        // 정렬: 좋아요순, 조회순, 최신순
        if (sortOrder === '인기순') {
            // get count of fairytale_like table for each fairytale_like.fairytaleId as likeCount
            queryBuilder
                .addSelect(subQuery => {
                    return subQuery
                        .select('COUNT(fairytale_like.id)', 'likeCount')
                        .from('fairytale_like', 'fairytale_like')
                        .where('fairytale_like.fairytaleId = fairytale.id')
                        .groupBy('fairytale_like.fairytaleId');
                }, 'likeCount')
                .orderBy('likeCount', 'DESC');
        } else if (sortOrder === '조회순') {
            // get count of views table for each views.fairytaleId as viewCount
            queryBuilder
                .addSelect(subQuery => {
                    return subQuery
                        .select('COUNT(views.id)', 'viewCount')
                        .from('views', 'views')
                        .where('views.fairytaleId = fairytale.id')
                        .groupBy('views.fairytaleId');
                }, 'viewCount')
                .orderBy('viewCount', 'DESC');
        } else {
            queryBuilder.orderBy('fairytale.createdAt', 'DESC');
        }
        const filteredFairytales = await queryBuilder
            .andWhere('fairytale.privatedAt IS NULL')
            .andWhere('fairytale.deletedAt IS NULL')
            .getMany();
        if (filteredFairytales.length === 0) {
            throw new NotFoundException(`제목 ${title} 에 해당되는 동화가 없습니다.`);
        }
        // 이미지
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

        // 작가명
        const userIds = filteredFairytales.map(filteredFairytales => filteredFairytales.userId);
        const users = await this.dataSource
            .getRepository(User)
            .createQueryBuilder('users')
            .select(['users.id', 'users.nickname'])
            .whereInIds(userIds)
            .getMany();
        // 매핑
        const userNicknameMap = users.reduce(
            (map, user) => {
                map[user.id] = user.nickname;
                return map;
            },
            {} as Record<number, string>,
        );
        // 조회, 좋아요 반환, getOne으로 못 받아서 getViewCount, getLikeCount 사용 안 됨
        const fairytaleIds = filteredFairytales.map(fairytale => fairytale.id);

        const viewCounts = await this.dataSource
            .getRepository(Views)
            .createQueryBuilder('views')
            .select('views.fairytaleId', 'fairytaleId')
            .addSelect('COUNT(views.id)', 'viewCount')
            .where('views.fairytaleId IN (:...ids)', { ids: fairytaleIds })
            .groupBy('views.fairytaleId')
            .getRawMany();

        const likeCounts = await this.dataSource
            .getRepository(FairytaleLike)
            .createQueryBuilder('fairytale_like')
            .select('fairytale_like.fairytaleId', 'fairytaleId')
            .addSelect('COUNT(fairytale_like.id)', 'likeCount')
            .where('fairytale_like.fairytaleId IN (:...ids)', { ids: fairytaleIds })
            .groupBy('fairytale_like.fairytaleId')
            .getRawMany();

        // Map counts
        const viewCountMap = viewCounts.reduce(
            (map, row) => {
                map[row.fairytaleId] = parseInt(row.viewCount, 10);
                return map;
            },
            {} as Record<number, number>,
        );

        const likeCountMap = likeCounts.reduce(
            (map, row) => {
                map[row.fairytaleId] = parseInt(row.likeCount, 10);
                return map;
            },
            {} as Record<number, number>,
        );

        const formattedFairytalePromises = filteredFairytales.map(fairytale => {
            const nickname = userNicknameMap[fairytale.userId] || 'Unknown';
            const imgs = fairytaleImageMap[fairytale.id] || [];
            const paths = imgs.length > 0 ? Object.values(imgs[0].path) : [];
            const coverImage = paths.length > 0 ? paths[0] : null;
            const viewCount = viewCountMap[fairytale.id] || 0;
            const likeCount = likeCountMap[fairytale.id] || 0;

            return {
                fairytaleId: fairytale.id,
                title: fairytale.title,
                theme: fairytale.theme,
                nickname: nickname,
                coverImage: coverImage,
                createdAt: fairytale.createdAt || 'unknown',
                views: viewCount,
                likes: likeCount,
            };
        });
        const formattedFairytales = await Promise.all(formattedFairytalePromises);

        return formattedFairytales;
    }

    // 나의 동화 조회
    async getMyFairytales(userId: number): Promise<Fairytale[]> {
        return this.createQueryBuilder('fairytale')
            .leftJoin('fairytale_img', 'fi', 'fi.fairytale_id = fairytale.id')
            .select([
                'fairytale.id AS id',
                'fairytale.title AS title',
                'fairytale.created_at AS createdAt',
                'JSON_EXTRACT(fi.path, "$.\\"0\\"") AS coverImage',
            ])
            .where('fairytale.userId = :userId', { userId })
            .getRawMany();
    }
}
