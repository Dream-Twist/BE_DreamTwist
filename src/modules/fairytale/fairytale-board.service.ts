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
*/

import { Injectable, NotFoundException, } from '@nestjs/common';
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
    @InjectRepository (BoardFairytaleRepository)
    private readonly boardFairytaleRepository: BoardFairytaleRepository
  ) {}

    //유저 동화 전체 조회
    async getFairytalesByUserId(userId: number) {
      return this.boardFairytaleRepository.findAllByUserId(userId);
  }
    //동화 세부 조회
    async getFairytaleContent(fairytaleId: number, userId: number): Promise<any> {
      const fairytale = await this.boardFairytaleRepository.findByIdWithContent(fairytaleId);
      
      if (!fairytale) {
          throw new NotFoundException('Fairytale not found');
      }

      // Check if the requesting user is different from the author to increase views
      // if (fairytale.user.id !== userId) {
      //     await this.boardFairytaleRepository.incrementViews(fairytaleId);
      // }

      return fairytale;
  }
  
  

    //스토리 수정
    async editUserFairytale(boardFairytaleDto: BoardFairytaleDto) {
      
    }
  


    //스토리 삭제
    async deleteFairytale(id: number): Promise<string> {
      const fairytale = await this.fairytaleRepository.findOne({ where: { id, deletedAt: null } });
      if (!fairytale) {
        throw new NotFoundException(`Fairytale with ID ${id} not found`);
      }
  
      await this.fairytaleRepository.softDelete(id);
  
      const content = await this.contentRepository.findOne({ where: { id, deletedAt: null } });
      if (!content) {
        throw new NotFoundException(`Fairytale summary not found`);
      }
  
      await this.contentRepository.softDelete(id);
      
      return `${id} 번째 동화책을 삭제했습니다`;
    }

}
