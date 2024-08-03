/**
File Name : fairytale-board.service
Description : 동화 스토리 보드 Service
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    create 리포지토리 기반
2024.07.25  강민규      Modified    GET: 동화 스토리 조회
2024.07.26  강민규      Modified    DELETE: 동화 스토리 및 줄거리 제거
2024.07.27  강민규      Modified    GET: 동화 목록 및 특정 동화 세부 조회
2024.07.30  강민규      Modified    GET: 조회수 기록
2024.07.31  강민규      Modified    GET: 동화 목록 최신순 검색, 닉네임 이미지 조회
2024.08.03  강민규      Modified    PUT: 동화 작성자가 수정
*/

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { BoardFairytaleRepository } from 'src/modules/fairytale/repository/fairytale-board.repository';
import { FairytaleImgRepository } from 'src/modules/fairytale/repository/fairytale-img.repository';
import { ForbiddenWordRepository } from 'src/modules/fairytale/repository/fairytale-forbidden-word.repository';
import { S3Service } from 'src/modules/s3.service';
import { nanoid } from 'nanoid';
import { CreateFairytaleImgDto } from 'src/modules/fairytale/dto/fairytale-img.dto';
import { UpdateFairytaleDto } from './dto/fairytale-update.dto';
@Injectable()
export class BoardFairytaleService {
    constructor(
        @InjectRepository(BoardFairytaleRepository)
        private readonly boardFairytaleRepository: BoardFairytaleRepository,
        private readonly fairytaleImgRepository: FairytaleImgRepository,
        private readonly forbiddenWordRepository: ForbiddenWordRepository,
        private readonly s3Service: S3Service,
    ) {}

    //유저 동화 전체 조회
    async getFairytales() {
        const fairytales = await this.boardFairytaleRepository.findAllByUserId();
        if (!fairytales) {
            throw new NotFoundException(`요청한 유저의 동화 목록을 찾을 수 없습니다`);
        }
        return fairytales;
    }
    //동화 세부 조회
    async getFairytaleContent(fairytaleId: number, userId: number) {
        const fairytales = await this.boardFairytaleRepository.findByIdWithContent(fairytaleId, userId);
        if (!fairytales) {
            throw new NotFoundException(`해당되는 동화를 찾을 수 없습니다`);
        }
        return fairytales;
    }
    //동화 제목 검색 쿼리 안 들어감
    async getAllbyTitle(title: string) {
        // try {
        //     const fairytales = await this.getFairytales();
        //     const filteredFairytales = fairytales.filter(fairytale =>
        //         fairytale.title.toLowerCase().includes(title.toLowerCase()),
        //     );
        //     return filteredFairytales;
        // } catch (error) {
        //     throw new NotFoundException('제목 ${title} 에 해당되는 동화가 없습니다.');
        // }
    }

    //동화 좋아요
    //   async createFairytaleLike(userId: number) {
    //     return this.boardFairytaleRepository.incrementLikes(userId);
    // }

    //스토리 수정
    async editUserFairytale(
        fairytaleId: number,
        updateFairytaleDto: Partial<UpdateFairytaleDto>,
        updateFairytaleImgDto: Partial<CreateFairytaleImgDto>,
    ): Promise<{ updatedFairytale: Fairytale; updatedFairytaleImg: FairytaleImg }> {
        const existingFairytale = await this.boardFairytaleRepository.findOneBy({ id: fairytaleId });
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
        const fairytale = await this.boardFairytaleRepository.updateFairytale(fairytaleId, {
            userId: userId,
            title: updateFairytaleDto.title,
            theme: updateFairytaleDto.theme,
            content: JSON.parse(updateFairytaleDto.content),
            privatedAt: privatedAt,
        });
        const updatedFairytale = await this.boardFairytaleRepository.save(fairytale);

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

    //스토리 삭제
    async deleteFairytale(id: number): Promise<void> {
        const softDelete = await this.boardFairytaleRepository.softDeleteFairytale(id);
        return softDelete;
    }
}
