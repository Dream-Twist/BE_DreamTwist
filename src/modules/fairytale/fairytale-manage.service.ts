/**
File Name : fairytale-manage.service
Description : 동화 스토리 생성, 수정, 삭제 Service
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.22  박수정      Modified    금지어 설정 기능 추가
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
2024.08.01  박수정      Modified    Entity 변경에 대한 Service 변경
2024.08.02  박수정      Modified    이미지 업로드 방식 변경 - Presigned URL
2024.08.03  박수정      Modified    Service 분리 - 조회 / 생성, 수정, 삭제
*/

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { CreateFairytaleDto } from 'src/modules/fairytale/dto/fairytale-create.dto';
import { CreateFairytaleImgDto } from 'src/modules/fairytale/dto/fairytale-img.dto';
import { ManageFairytaleRepository } from 'src/modules/fairytale/repository/fairytale-manage.repository';
import { ForbiddenWordRepository } from 'src/modules/fairytale/repository/fairytale-forbidden-word.repository';
import { FairytaleImgRepository } from './repository/fairytale-img.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { S3Service } from 'src/modules/s3.service';
import { nanoid } from 'nanoid';
import { UpdateFairytaleDto } from './dto/fairytale-update.dto';
import { FindOptionsWhere } from 'typeorm';
import { User } from '../user/entity/user.entity';

@Injectable()
export class ManageFairytaleService {
    constructor(
        @InjectRepository(ManageFairytaleRepository)
        private readonly manageFairytaleRepository: ManageFairytaleRepository,
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
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        // 금지어 확인
        await this.checkForbiddenWodrds([createFairytaleDto.title, createFairytaleDto.content]);

        // 동화 스토리 공개 여부 확인
        const privatedAt = createFairytaleDto.privatedAt ? new Date() : null;

        // 동화 스토리
        const fairytale = await this.manageFairytaleRepository.createFairytale({
            userId: userId,
            title: createFairytaleDto.title,
            theme: createFairytaleDto.theme,
            content: JSON.parse(createFairytaleDto.content),
            privatedAt: privatedAt,
        });
        const savedFairytale = await this.manageFairytaleRepository.save(fairytale);

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

    // 동화 스토리 수정
    async editUserFairytale(
        fairytaleId: number,
        updateFairytaleDto: Partial<UpdateFairytaleDto>,
        updateFairytaleImgDto: Partial<CreateFairytaleImgDto>,
    ): Promise<{ updatedFairytale: Fairytale; updatedFairytaleImg: FairytaleImg }> {
        const existingFairytale = await this.manageFairytaleRepository.findOneBy({ id: fairytaleId });
        // 임시 유저
        const userId = 1;

        // 동화가가 삭제되었는지 확인
        if (!existingFairytale) {
            throw new BadRequestException(`${fairytaleId}번 동화를 찾을 수 없습니다`);
        }

        if (existingFairytale.userId !== userId) {
            throw new UnauthorizedException('동화를 수정할 권한이 없습니다.');
        }

        // 금지어 확인
        await this.checkForbiddenWodrds([updateFairytaleDto.title, updateFairytaleDto.content]);

        // 동화 스토리 공개 여부 확인
        const privatedAt = updateFairytaleDto.privatedAt ? new Date() : null;

        // 동화 줄거리 수정
        const fairytale = await this.manageFairytaleRepository.updateFairytale(fairytaleId, {
            userId: userId,
            title: updateFairytaleDto.title,
            theme: updateFairytaleDto.theme,
            content: JSON.parse(updateFairytaleDto.content),
            privatedAt: privatedAt,
        });
        const updatedFairytale = await this.manageFairytaleRepository.save(fairytale);

        // 동화 이미지 수정
        const images = JSON.parse(updateFairytaleImgDto.images);
        const combinedImages = { '0': updateFairytaleImgDto.coverImage, ...images };

        const updatedFairytaleImg = await this.fairytaleImgRepository.updateFairytaleImg(fairytaleId, {
            fairytaleId: fairytale.id,
            creationWay: updateFairytaleImgDto.creationWay,
            path: combinedImages,
        });

        return { updatedFairytale, updatedFairytaleImg };
    }

    // 동화 스토리 삭제
    async deleteFairytale(id: number): Promise<void> {
        const softDelete = await this.manageFairytaleRepository.softDeleteFairytale(id);
        return softDelete;
    }

    // S3에서 Presigned URL 생성 요청
    async getPresignedURL(userId: number, fileName: string): Promise<string> {
        const folderId = nanoid(6);
        const key = `img/${userId}/${folderId}/${Date.now()}-${fileName}`;

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
