/**
File Name : fairytale-forbidden.repository
Description : 금지어 설정 Repository
Author : 박수정

History
Date        Author      Status      Description
2024.07.24  박수정      Created
2024.07.24  박수정      Modified    금지어 설정 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ForbiddenWord } from '../entity/fairytale-forbidden-word.entity';

@Injectable()
export class ForbiddenWordRepository extends Repository<ForbiddenWord> {
    constructor(private dataSource: DataSource) {
        super(ForbiddenWord, dataSource.createEntityManager());
    }

    // 금지어 조회
    async getAllForbiddenWords(): Promise<ForbiddenWord[]> {
        return this.createQueryBuilder('forbidden_word').getMany();
    }
}
