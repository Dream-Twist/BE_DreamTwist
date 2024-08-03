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
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { User } from 'src/modules/user/entity/user.entity';
import { Fairytale } from './entity/fairytale.entity';
// import { Views } from './entity/fairytale-views.entity';
// import { Likes } from './entity/fairytale-views.entity';
import { FairytaleImg } from './entity/fairytale-img.entity';
// import { BoardFairytaleDto } from './dto/fairytale-board.dto';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
@Injectable()
export class BoardFairytaleService {
    constructor(
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        // @InjectRepository(Fairytale)
        // private readonly fairytaleRepository: Repository<Fairytale>,
        @InjectRepository(BoardFairytaleRepository)
        private readonly boardFairytaleRepository: BoardFairytaleRepository,
        private readonly dataSource: DataSource,
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
    // async editUserFairytale(boardFairytaleDto: BoardFairytaleDto) {} // ★
    // async editUserFairytale(boardFairytaleDto: BoardFairytaleDto) {} // ★

    //스토리 삭제
    async deleteFairytale(id: number): Promise<void> {
        const softDelete = await this.boardFairytaleRepository.softDeleteFairytale(id);
        return softDelete;
    }
}
