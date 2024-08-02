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
import { DataSource } from 'typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { ForbiddenWord } from 'src/modules/fairytale/entity/fairytale-forbidden-word.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { ProfileImage } from 'src/modules//user/entity/profile_image.entity';
import { RelFairytaleUsers } from 'src/modules//user/entity/rel_fairytale_users.entity';
import { FairytaleController } from 'src/modules/fairytale/fairytale-create.controller';
import { BoardFairytaleController } from 'src/modules/fairytale/fairytale-board.controller';
import { FairytaleService } from 'src/modules/fairytale/fairytale-create.service';
import { BoardFairytaleService } from 'src/modules/fairytale/fairytale-board.service';
import { FairytaleRepository } from 'src/modules/fairytale/repository/fairytale-create.repository';
import { BoardFairytaleRepository } from 'src/modules/fairytale/repository/fairytale-board.repository';
import { FairytaleImgRepository } from 'src/modules/fairytale/repository/fairytale-img.repository';
import { ForbiddenWordRepository } from 'src/modules/fairytale/repository/fairytale-forbidden-word.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { S3Service } from 'src/modules/s3.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Fairytale, User, ForbiddenWord, FairytaleImg, ProfileImage, RelFairytaleUsers]),
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
