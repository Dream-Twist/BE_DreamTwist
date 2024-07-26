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
import { ForbiddenWordRepository } from './repository/fairytale-forbidden-word.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FairytaleService {
    constructor(
        @InjectRepository(FairytaleRepository)
        private readonly fairytaleRepository: FairytaleRepository,
        @InjectRepository(FairytaleContentRepository)
        private readonly fairytaleContentRepository: FairytaleContentRepository,
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly forbiddenWordRepository: ForbiddenWordRepository,
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
        await this.checkForbiddenWodrds([createFairytaleDto.title, createFairytaleDto.content]);

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
    private async checkForbiddenWodrds(texts: string[]): Promise<void> {
        const forbiddenWords = await this.forbiddenWordRepository.getAllForbiddenWords();
        const foundForbiddenWords: string[] = [];

        for (const text of texts) {
            for (const word of forbiddenWords) {
                if (text.includes(word.forbidden_word)) {
                    foundForbiddenWords.push(word.forbidden_word);
                }
            }
        }

        if (foundForbiddenWords.length > 0) {
            throw new BadRequestException(`입력 불가한 금지어가 포함되어 있습니다: ${foundForbiddenWords.join(', ')}`);
        }
    }
}
