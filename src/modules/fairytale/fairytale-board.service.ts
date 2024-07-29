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
2024.07.29  강민규      Modified    GET: 조회수 상승
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { Fairytale } from './entity/fairytale.entity';
import { FairytaleContent } from './entity/fairytale-content.entity';
import { BoardFairytaleDto } from './dto/fairytale-board.dto';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
@Injectable()
export class BoardFairytaleService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Fairytale)
        private readonly fairytaleRepository: Repository<Fairytale>,
        @InjectRepository(FairytaleContent)
        private readonly contentRepository: Repository<FairytaleContent>,
        @InjectRepository(BoardFairytaleRepository)
        private readonly boardFairytaleRepository: BoardFairytaleRepository,
    ) {}

    //유저 동화 전체 조회
    async getFairytalesByUserId(userId: number) {
        const fairytales = await this.boardFairytaleRepository.findAllByUserId(userId);
        if (!fairytales || fairytales.length === 0) {
            throw new NotFoundException(`요청한 유저 ${userId}의 동화 목록을 찾을 수 없습니다`);
        }
        return fairytales;
    }
    //동화 세부 조회
    async getFairytaleContent(fairytaleId: number, id: number): Promise<any> {
        const fairytale = await this.boardFairytaleRepository.findOne({
            where: { id: fairytaleId },
            relations: ['user'], // Ensure the 'user' relation is loaded
        });

        if (!fairytale) {
            throw new NotFoundException('{id}번 동화 줄거리를 찾을 수 없습니다.');
        }

        // 작성자가 아니면 조회 시 +1
        // let userId = 1; ★★★ 이걸 바꾸면서 임시 유저로 테스트하기 (fairytale-board.controller)
        const viewer = await this.userRepository.findOne({
            where: { id },
            relations: ['fairytales'],
        });

        // 조회 인원과 동화가 존재하는지 확인
        if (viewer && fairytale) {
            // 조회자가 작성자가 아니면 +1
            if (fairytale.user && viewer.id !== fairytale.user.id) {
                await this.boardFairytaleRepository.incrementViews(fairytaleId);
            } else {
                // 조회자가 작성자이면
                console.error('작성자입니다.');
            }
        } else {
            // 조회 인원 또는 동화가 없으면
            console.error('조회되지 않는 인원 또는 해당 동화가 없습니다.');
        }

        return fairytale;
    }

    //동화 좋아요
    //   async createFairytaleLike(userId: number) {
    //     return this.boardFairytaleRepository.incrementLikes(userId);
    // }

    //스토리 수정
    async editUserFairytale(boardFairytaleDto: BoardFairytaleDto) {}

    //스토리 삭제
    async deleteFairytale(id: number): Promise<string> {
        const fairytale = await this.fairytaleRepository.findOne({ where: { id, deletedAt: null } });
        if (!fairytale) {
            throw new NotFoundException(`{id}번 동화책을 찾을 수 없습니다`);
        }

        await this.fairytaleRepository.softDelete(id);

        const content = await this.contentRepository.findOne({ where: { id, deletedAt: null } });
        if (!content) {
            throw new NotFoundException(`{id}번 동화책의 줄거리를 찾을 수 없습니다`);
        }

        await this.contentRepository.softDelete(id);

        return `${id} 번 동화책을 삭제했습니다`;
    }
}
