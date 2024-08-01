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
2024.07.27  박수정      Modified    동화 이미지 업로드 기능 추가
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FairytaleController } from './fairytale-create.controller';
import { FairytaleService } from './fairytale-create.service';
import { FairytaleRepository } from './repository/fairytale-create.repository';
import { UserRepository } from '../user/user.repository';
import { Fairytale } from './entity/fairytale.entity';
import { User } from '../user/entity/user.entity';
import { BoardFairytaleService } from './fairytale-board.service';
import { BoardFairytaleRepository } from './repository/fairytale-board.repository';
import { BoardFairytaleController } from './fairytale-board.controller';
import { ForbiddenWord } from './entity/fairytale-forbidden-word.entity';
import { ForbiddenWordRepository } from './repository/fairytale-forbidden-word.repository';
//조회 좋아요
import { Views } from './entity/fairytale-views.entity';
import { Likes } from './entity/fairytale-views.entity';
import { DataSource, View } from 'typeorm';
import { FairytaleImgRepository } from './repository/fairytale-img.repository';
import { S3Service } from '../s3.service';
import { FairytaleImg } from './entity/fairytale-img.entity';
import { ProfileImage } from '../user/entity/profile_image.entity';
import { RelFairytaleUsers } from '../user/entity/rel_fairytale_users.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Fairytale,
            User,
            ForbiddenWord,
            FairytaleImg,
            ProfileImage,
            RelFairytaleUsers,
            Views,
            Likes,
        ]),
    ],
    controllers: [FairytaleController, BoardFairytaleController],
    providers: [
        FairytaleService,
        FairytaleRepository,
        UserRepository,
        BoardFairytaleService,
        BoardFairytaleRepository,
        {
            provide: ForbiddenWordRepository,
            useFactory: (dataSource: DataSource) => {
                return new ForbiddenWordRepository(dataSource);
            },
            inject: [DataSource],
        },
        FairytaleImgRepository,
        S3Service,
    ],
})
export class FairytaleModule {}
