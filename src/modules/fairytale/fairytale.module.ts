/**
File Name : fairytale.module
Description : 동화 스토리 Module
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.24  강민규      Modified    동화 조회 기능 추가
2024.07.24  박수정      Modified    금지어 설정 기능 추가
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
import { BoardFairytaleService } from './fairytale-board.service';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
import { BoardFairytaleController } from './fairytale-board.controller';
import { ForbiddenWord } from './entity/fairytale-forbidden-word.entity';
import { ForbiddenWordRepository } from './repository/fairytale-forbidden-word.repository';
//조회 좋아요
import { Views, Likes } from './entity/fairytale-utilities.entity';
import { DataSource, View } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Fairytale, FairytaleContent, User, ForbiddenWord, Views])],
    controllers: [FairytaleController, BoardFairytaleController],
    providers: [
        FairytaleService,
        FairytaleRepository,
        FairytaleContentRepository,
        UserRepository,
        BoardFairytaleService,
        BoardFairytaleRepository,
        // ForbiddenWordRepository,
        {
            provide: ForbiddenWordRepository,
            useFactory: (dataSource: DataSource) => {
                return new ForbiddenWordRepository(dataSource);
            },
            inject: [DataSource],
        },
    ],
})
export class FairytaleModule {}
