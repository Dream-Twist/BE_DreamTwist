/**
File Name : fairytale-img-upload.repository
Description : 동화 이미지 업로드 Repository
Author : 박수정

History
Date        Author      Status      Description
2024.07.26  박수정      Created     
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가  
2024.08.03  강민규      Modified    PUT: 동화 작성자가 수정  
*/

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';

@Injectable()
export class FairytaleImgRepository extends Repository<FairytaleImg> {
    constructor(private dataSource: DataSource) {
        super(FairytaleImg, dataSource.createEntityManager());
    }

    async createFairytaleImg(fairytaleImgData: Partial<FairytaleImg>): Promise<FairytaleImg> {
        const fairytaleImg = this.create(fairytaleImgData);
        return this.save(fairytaleImg);
    }
    // 동화 이미지 수정
    async updateFairytaleImg(fairytaleId: number, imagesData: Partial<FairytaleImg>): Promise<FairytaleImg> {
        const currentTime = new Date();
        const updateData = {
            ...imagesData,
            updatedAt: currentTime,
        };

        await this.update({ fairytaleId }, updateData);
        return this.findOneBy({ fairytaleId });
    }
}
