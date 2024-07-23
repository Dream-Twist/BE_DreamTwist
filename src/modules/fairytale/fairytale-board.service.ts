/**
File Name : fairytale-board.service
Description : 동화 스토리 보드 Service
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    based on create service
2024.07.23  강민규      Modified    저장된 스토리 조회
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardFairytaleDto } from './dto/fairytale-board.dto';
// import { User } from '../user/user.entity';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
import { FairytaleContentRepository } from './repository/fairytale-content.repository';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class BoardFairytaleService {
    constructor(
        private readonly fairytaleRepository: BoardFairytaleRepository,
        private readonly fairytaleContentRepository: FairytaleContentRepository,
        private readonly userRepository: UserRepository,
    ) {}

    //스토리 조회 
    async readFairytale(fairytaleId: number) {
        // 임시 사용자
        const userId = 1;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('회원을 찾을 수 없습니다.');
        }
        // 동화 스토리
        const fairytale = await this.fairytaleRepository.findOne({
            where: { id: fairytaleId, user: { id: userId } },
            relations: ['content'], // Ensure related content is fetched
        });
        if (!fairytale) {
            throw new NotFoundException('동화를 찾을 수 없습니다.');
        }

        // 동화 스토리 내용
        const content = await this.fairytaleContentRepository.findOne({
            where: { id: fairytaleId },
        });
        if (!content) {
            throw new NotFoundException('해당되는 동화 내용이 없습니다.');
        }

        return {
            user: fairytale.user.id,
            title: fairytale.title,
            labeling: fairytale.labeling,
            content: content.content, // Assuming 'content' is a string field in your content entity
            isPublic: fairytale.isPublic,
        };
        
    }
}
