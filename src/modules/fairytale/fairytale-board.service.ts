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
*/

import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity';
import { Fairytale } from './entity/fairytale.entity';
import { FairytaleContent } from './entity/fairytale-content.entity';
import { BoardFairytaleDto } from './dto/fairytale-board.dto';


@Injectable()
export class BoardFairytaleService {
    constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Fairytale)
    private readonly fairytaleRepository: Repository<Fairytale>,
    @InjectRepository(FairytaleContent)
    private readonly contentRepository: Repository<FairytaleContent>,
    ) {}

    //스토리 조회 
    async getUserWithFairytales(userId: string) {
        try {
          const user = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.fairytales', 'fairytale')
            .leftJoinAndSelect('fairytale.content', 'content')
            .where('user.id = :userId', { userId })
            .getOne();
    
          if (!user) {
            throw new NotFoundException(`요청한 리소스를 찾을 수 없습니다`);
          }
          return user;
        } catch (error) {
          console.error('Error retrieving user with fairytales:', error);
          throw error;
        }
      }

    //스토리 수정
  //   async editUserFairytale(boardFairytaleDto: BoardFairytaleDto) {
  //     try {
  //         const content = await this.contentRepository.findOne({
  //             where: { id: boardFairytaleDto.id },
  //             relations: ['user'],
  //         });
  
  //         if (!content) {
  //             throw new Error('Content not found');
  //         }
  
  //         const fairytale = await this.fairytaleRepository.save({
  //             user: content.user,
  //             content: content,
  //             title: boardFairytaleDto.title,
  //             labeling: boardFairytaleDto.labeling,
  //             isPublic: boardFairytaleDto.isPublic,
  //         });
  
  //         return { message: '동화 스토리가 성공적으로 수정되었습니다.', fairytale: fairytale };
  //     } catch (error) {
  //         return { message: error.message }; // Handle and return meaningful error messages
  //     }
  // }
  


    //스토리 삭제
    async deleteFairytale(id: number): Promise<string> {
      const result = await this.fairytaleRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Fairytale with ID ${id} not found`);
      }
      const resultContent = await this.contentRepository.delete(id);
      if (resultContent.affected === 0) {
        throw new NotFoundException(`Fairytale summary not found`);
      }
        return `${id} 번째 동화책을 삭제했습니다`
    }

}
