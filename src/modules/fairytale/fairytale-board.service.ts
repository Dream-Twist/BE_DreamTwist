/**
File Name : fairytale-board.service
Description : 동화 스토리 보드 Service
Author : 강민규

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

import { Injectable } from '@nestjs/common';
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

    // async createFairytale(createFairytaleDto: CreateFairytaleDto, user: User) {
    async createFairytale(createFairytaleDto: BoardFairytaleDto) {
        // 임시 사용자
        const userId = 1;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('회원을 찾을 수 없습니다.');
        }

        // 동화 스토리 내용
        const content = await this.fairytaleContentRepository.createContent({
            user,
            content: createFairytaleDto.content,
        });
        await this.fairytaleContentRepository.save(content);

        // 동화 스토리
        const fairytale = await this.fairytaleRepository.createFairytale({
            user,
            title: createFairytaleDto.title,
            labeling: createFairytaleDto.labeling,
            content,
            isPublic: createFairytaleDto.isPublic,
        });

        return this.fairytaleRepository.findFairytale(fairytale.id);
    }
}
