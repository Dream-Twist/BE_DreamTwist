/**
File Name : fairytale-create.repository
Description : 동화 스토리 생성 Repository
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Fairytale } from '../entity/fairytale.entity';

@Injectable()
export class FairytaleRepository extends Repository<Fairytale> {
    constructor(private dataSource: DataSource) {
        super(Fairytale, dataSource.createEntityManager());
    }

    // 동화 스토리 생성
    async createFairytale(fairytaleData: Partial<Fairytale>): Promise<Fairytale> {
        const fairytale = this.create(fairytaleData);
        return this.save(fairytale);
    }
}
