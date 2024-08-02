/**
File Name : fairytale-create.service
Description : 동화 스토리 생성 Service
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.22  박수정      Modified    금지어 설정 기능 추가
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
2024.08.01  박수정      Modified    Entity 변경에 대한 Service 변경
2024.08.02  박수정      Modified    이미지 업로드 방식 변경 - Presigned URL
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { CreateFairytaleDto } from 'src/modules/fairytale/dto/fairytale-create.dto';
import { CreateFairytaleImgDto } from 'src/modules/fairytale/dto/fairytale-img.dto';
import { FairytaleRepository } from 'src/modules/fairytale/repository/fairytale-create.repository';
import { ForbiddenWordRepository } from 'src/modules/fairytale/repository/fairytale-forbidden-word.repository';
import { FairytaleImgRepository } from './repository/fairytale-img.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { S3Service } from 'src/modules/s3.service';

@Injectable()
export class FairytaleService {
    constructor(
        @InjectRepository(FairytaleRepository)
        private readonly fairytaleRepository: FairytaleRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly forbiddenWordRepository: ForbiddenWordRepository,
        @InjectRepository(FairytaleImgRepository)
        private readonly fairytaleImgRepository: FairytaleImgRepository,
        private readonly s3Service: S3Service,
    ) {}

    // 동화 스토리 생성
    // async createFairytale(createFairytaleDto: CreateFairytaleDto, user: User) {
    async createFairytale(
        createFairytaleDto: CreateFairytaleDto,
        createFairytaleImgDto: CreateFairytaleImgDto,
    ): Promise<{ savedFairytale: Fairytale; savedFairytaleImg: FairytaleImg }> {
        // 임시 사용자
        const userId = 1;
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('회원을 찾을 수 없습니다.');
        }

        // 금지어 확인
        await this.checkForbiddenWodrds([createFairytaleDto.title, createFairytaleDto.content]);

        // 동화 스토리 공개 여부 확인
        const privatedAt = createFairytaleDto.privatedAt ? new Date() : null;

        // 동화 스토리
        const fairytale = await this.fairytaleRepository.createFairytale({
            userId: userId,
            title: createFairytaleDto.title,
            theme: createFairytaleDto.theme,
            content: JSON.parse(createFairytaleDto.content),
            privatedAt: privatedAt,
        });
        const savedFairytale = await this.fairytaleRepository.save(fairytale);

        // let imgUrl = this.s3Service.getDefaultImgUrl();

        // 동화 이미지 저장
        const images = JSON.parse(createFairytaleImgDto.images);
        const combinedImages = { '0': createFairytaleImgDto.coverImage, ...images };

        const fairytaleImg = await this.fairytaleImgRepository.createFairytaleImg({
            fairytaleId: fairytale.id,
            creationWay: createFairytaleImgDto.creationWay,
            path: combinedImages,
        });
        const savedFairytaleImg = await this.fairytaleImgRepository.save(fairytaleImg);

        return { savedFairytale, savedFairytaleImg };
    }

    // S3에서 Presigned URL 생성 요청
    async getPresignedURL(fairytaleId: number, fileName: string): Promise<string> {
        const key = `img/${fairytaleId}/${Date.now()}-${fileName}`;

        return this.s3Service.generatePresignedURL(key);
    }

    // 금지어 설정
    private async checkForbiddenWodrds(texts: string[]): Promise<void> {
        const forbiddenWords = await this.forbiddenWordRepository.getAllForbiddenWords();
        const foundForbiddenWords: string[] = [];

        for (const text of texts) {
            for (const word of forbiddenWords) {
                if (text.includes(word.forbiddenWord)) {
                    foundForbiddenWords.push(word.forbiddenWord);
                }
            }
        }

        if (foundForbiddenWords.length > 0) {
            throw new BadRequestException(`입력 불가한 금지어가 포함되어 있습니다: ${foundForbiddenWords.join(', ')}`);
        }
    }
}
