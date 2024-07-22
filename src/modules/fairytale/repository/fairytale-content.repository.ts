/**
File Name : fairytale-content.repository
Description : 동화 스토리 내용 Repository
Author : 박수정

History
Date        Author      Status      Description
2024.07.20  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { FairytaleContent } from '../entity/fairytale-content.entity';

@Injectable()
export class FairytaleContentRepository extends Repository<FairytaleContent> {
    constructor(private dataSource: DataSource) {
        super(FairytaleContent, dataSource.createEntityManager());
    }

    async createContent(contentData: Partial<FairytaleContent>): Promise<FairytaleContent> {
        const content = this.create(contentData);
        return this.save(content);
    }
}
