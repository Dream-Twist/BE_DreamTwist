/**
File Name : fairytale-board.service
Description : 동화 스토리 보드 Service
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    based on create service
2024.07.24  강민규      Modified    GET method
*/

import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardFairytaleDto } from './dto/fairytale-board.dto';
// import { User } from '../user/user.entity';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
import { FairytaleContentRepository } from './repository/fairytale-content.repository';
import { UserRepository } from '../user/user.repository';
import { Fairytale } from './entity/fairytale.entity';

@Injectable()
export class BoardFairytaleService {
    constructor(
        private readonly fairytaleRepository: BoardFairytaleRepository,
        private readonly fairytaleContentRepository: FairytaleContentRepository,
        private readonly userRepository: UserRepository,
    ) {}

    //스토리 조회 
    async getFairytaleById(id: number): Promise<Fairytale> {
        return this.fairytaleRepository.findFairytale(id);
    }

    //스토리 수정
    // async editFairytale(fairytaleId: number, boardFairytaleDto: BoardFairytaleDto): Promise<Fairytale> {
}
