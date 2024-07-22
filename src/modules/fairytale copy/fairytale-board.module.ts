/**
File Name : fairytale.entity
Description : 동화 스토리 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FairytaleController } from './fairytale-board.controller';
import { FairytaleService } from './fairytale-board.service';
import { FairytaleRepository } from './repository/fairytale-board.repository';
import { FairytaleContentRepository } from './repository/fairytale-content.repository';
import { UserRepository } from '../user/user.repository';
import { Fairytale } from '../fairytale/entity/fairytale.entity';
import { FairytaleContent } from './entity/fairytale-board.entity';
import { User } from '../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Fairytale, FairytaleContent, User])],
    controllers: [FairytaleController],
    providers: [FairytaleService, FairytaleRepository, FairytaleContentRepository, UserRepository],
})
export class FairytaleModule {}
