/**
File Name : fairytale.module
Description : 동화 스토리 Module
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.24  강민규      Modified    동화 조회 기능 추가
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FairytaleController } from './fairytale-create.controller';
import { FairytaleService } from './fairytale-create.service';
import { FairytaleRepository } from './repository/fairytale-create.repository';
import { FairytaleContentRepository } from './repository/fairytale-content.repository';
import { UserRepository } from '../user/user.repository';
import { Fairytale } from './entity/fairytale.entity';
import { FairytaleContent } from './entity/fairytale-content.entity';
import { User } from '../user/user.entity';
// fairytale board
import { BoardFairytaleService } from './fairytale-board.service';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
import { BoardFairytaleController } from './fairytale-board.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Fairytale, FairytaleContent, User])],
    controllers: [FairytaleController,BoardFairytaleController],
    providers: [FairytaleService, FairytaleRepository, FairytaleContentRepository, UserRepository, BoardFairytaleService, BoardFairytaleRepository,],
})
export class FairytaleModule {}
