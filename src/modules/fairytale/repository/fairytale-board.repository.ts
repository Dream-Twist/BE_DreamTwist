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
2024.07.29  강민규      Modified    GET: 조회수 상승
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource, Like } from 'typeorm';
import { Fairytale } from '../entity/fairytale.entity';
import { BoardFairytaleDto } from '../dto/fairytale-board.dto';
import { Likes, Views } from '../entity/fairytale-utilities.entity';
@Injectable()
export class BoardFairytaleRepository extends Repository<Fairytale> {
    constructor(private dataSource: DataSource) {
        super(Fairytale, dataSource.createEntityManager());
    }
    // 동화 조회
    //동화 목록
    async findAllByUserId(userId: number): Promise<Fairytale[]> {
        return (
            this.createQueryBuilder('fairytale')
                .leftJoinAndSelect('fairytale.content', 'content')
                .where('fairytale.userId = :userId', { userId })
                // .withDeleted() 필요하면 사용
                .getMany()
        );
    }
    //찾는 동화 세부
    async findByIdWithContent(fairytaleId: number): Promise<Fairytale> {
        return this.createQueryBuilder('fairytale')
            .leftJoinAndSelect('fairytale.content', 'content')
            .where('fairytale.id = :fairytaleId', { fairytaleId })
            .getOne();
    }

    //조회 수 추가
    async incrementViews(fairytaleId: number) {
        // 동화에 해당되는 Views 엔티티 행이 없으면 올라가지 않음
        return this.createQueryBuilder()
            .update(Views)
            .set({ views: () => 'views + 1' })
            .where('fairytale.id = :fairytaleId', { fairytaleId })
            .execute();
    }

    //좋아요 수 추가, 아직 작동 안 함
    async incrementLikes(fairytaleId: number) {
        return this.createQueryBuilder()
            .update(Likes)
            .set({ likes: () => 'likes + 1' })
            .where('fairytale.id = :fairytaleId', { fairytaleId })
            .execute();
    }

    // 동화 수정
    async updateFairytale() {}

    // 동화 삭제
    async softDeleteFairytale(id: number): Promise<void> {
        await this.update(id, { deletedAt: new Date() });
    }
}
