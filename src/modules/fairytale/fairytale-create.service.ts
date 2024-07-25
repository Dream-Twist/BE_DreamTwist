/**
File Name : fairytale-create.service
Description : 동화 스토리 생성 Service
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.22  박수정      Modified    금지어 설정 기능 추가
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFairytaleDto } from './dto/fairytale-create.dto';
// import { User } from '../user/user.entity';
import { FairytaleRepository } from './repository/fairytale-create.repository';
import { FairytaleContentRepository } from './repository/fairytale-content.repository';
import { UserRepository } from '../user/user.repository';
import { Fairytale } from './entity/fairytale.entity';

@Injectable()
export class FairytaleService {
    constructor(
        private readonly fairytaleRepository: FairytaleRepository,
        private readonly fairytaleContentRepository: FairytaleContentRepository,
        private readonly userRepository: UserRepository,
    ) {}

    // 동화 스토리 생성
    // async createFairytale(createFairytaleDto: CreateFairytaleDto, user: User) {
    async createFairytale(createFairytaleDto: CreateFairytaleDto): Promise<Fairytale> {
        // 임시 사용자
        const userId = 1;
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('회원을 찾을 수 없습니다.');
        }

        // 금지어 확인
        this.checkForbiddenWodrds(createFairytaleDto.title);
        this.checkForbiddenWodrds(createFairytaleDto.content);

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

        // return this.fairytaleRepository.findFairytale(fairytale.id);
        return fairytale;
    }

    // 금지어 설정
    private checkForbiddenWodrds(text: string): void {
        // 임시 금지어
        const forbiddenWords = ['가', '나', '다'];

        for (const word of forbiddenWords) {
            if (text.includes(word)) {
                throw new BadRequestException(`잘못된 단어 사용: ${word}`);
            }
        }
    }
}
