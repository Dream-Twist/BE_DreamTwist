/**
File Name : fairytale-board.repository
Description : 동화 스토리 생성 Repository
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created
2024.07.22  강민규      Modified    create 리포지토리 기반
2024.07.25  강민규      Modified    GET: 유저의 동화 목록 조회

*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Fairytale } from '../entity/fairytale.entity';
@Injectable()
export class BoardFairytaleRepository extends Repository<Fairytale> {
    constructor(private dataSource: DataSource) {
        super(Fairytale, dataSource.createEntityManager());
    }
    // 동화 조회
    async findFairytale(id: number): Promise<Fairytale | null> {
        const queryBuilder = this.createQueryBuilder('fairytale')
            .leftJoinAndSelect('fairytale.user', 'user')
            .leftJoinAndSelect('fairytale.content', 'content')
            .where('fairytale.id = :id', { id });

        const fairytale = await queryBuilder.getOne();
        return fairytale;
    }
    
    // 동화 수정
    // async editFairytale(fairytaleData: Partial<Fairytale>): Promise<Fairytale> {
    //     const fairytale = this.create(fairytaleData);
    //     return this.save(fairytale);
    // }
    // 동화 삭제
    // async deleteFairytale(id: number): Promise<void> {
    //     await this.delete(id);
    //   }
}
