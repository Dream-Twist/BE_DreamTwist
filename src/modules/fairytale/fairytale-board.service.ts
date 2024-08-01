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
// import { FairytaleContent } from './entity/fairytale-content.entity'; // ★
import { Views } from './entity/fairytale-views.entity';
// import { Likes } from './entity/fairytale-views.entity';
// import { FairytaleImg } from './entity/fairytale-img.entity';
// import { BoardFairytaleDto } from './dto/fairytale-board.dto';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
@Injectable()
export class BoardFairytaleService {
    constructor(
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        // @InjectRepository(Fairytale)
        // private readonly fairytaleRepository: Repository<Fairytale>,
        // @InjectRepository(FairytaleContent) // ★
        // private readonly contentRepository: Repository<FairytaleContent>, // ★
        @InjectRepository(BoardFairytaleRepository)
        private readonly boardFairytaleRepository: BoardFairytaleRepository,
        private readonly dataSource: DataSource,
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
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            const fairytale = await queryRunner.manager.findOne(Fairytale, {
                where: { id: fairytaleId },
                relations: ['user'],
            });

            if (!fairytale) {
                throw new NotFoundException(`{id}번 동화 줄거리를 찾을 수 없습니다.`);
            }

            // 조회자 확인
            const viewer = await queryRunner.manager.findOne(User, {
                where: { id },
                relations: ['fairytales'],
            });

            if (viewer && fairytale) {
                // 작성자가 아니면 조회자 기록
                /* // ★
                if (fairytale.user && viewer.id !== fairytale.user.id) {
                    await queryRunner.manager.insert('views', {
                        user: { id: viewer.id },
                        fairytale: { id: fairytaleId },
                    });
                } else {
                    // 작성자가 조회
                    console.error('작성자입니다.');
                }
                */
            } else {
                // 조회자 또는 동화가 없음
                console.error('조회되지 않는 인원 또는 해당 동화가 없습니다.');
            }
            // 조회자 콘솔
            console.log(`조회 유저 ID: ${viewer.id}`);
            const viewCount = await queryRunner.manager
                .createQueryBuilder()
                .select('COUNT(DISTINCT view.userId)', 'count')
                .from(Views, 'view')
                .where('view.fairytaleId = :fairytaleId', { fairytaleId })
                .getRawOne();
            console.log(`동화 ${fairytaleId} 의 조회수: ${viewCount.count}`);
            await queryRunner.commitTransaction();
            return fairytale;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
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
        const queryRunner = this.dataSource.getRepository(Fairytale).manager.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            // 동화가 삭제되지 않았는지 확인
            const fairytale = await queryRunner.manager.findOne(Fairytale, { where: { id, deletedAt: null } });
            if (!fairytale) {
                throw new NotFoundException(`{id}번 동화를 찾을 수 없습니다`);
            }

            // 동화 줄거리가 삭제되지 않았는지 확인
            /* // ★
            const content = await queryRunner.manager.findOne(FairytaleContent, { where: { id, deletedAt: null } });
            if (!content) {
                throw new NotFoundException(`{id}번 동화의 줄거리를 찾을 수 없습니다`);
            }
            */

            // 동화와 동화 줄거리에 deletedAt 값 생성
            await queryRunner.manager.softDelete(Fairytale, id);
            // await queryRunner.manager.softDelete(FairytaleContent, id); // ★

            // 모든 조건 만족하면 transaction
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
