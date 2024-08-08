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
2024.08.07  원경혜      Modified    동화 댓글 기능 추가
*/

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Fairytale } from 'src/modules/fairytale/entity/fairytale.entity';
import { FairytaleImg } from 'src/modules/fairytale/entity/fairytale-img.entity';
import { ForbiddenWord } from 'src/modules/fairytale/entity/fairytale-forbidden-word.entity';
import { User } from 'src/modules/user/entity/user.entity';
import { Comments } from 'src/modules/fairytale/entity/fairytale-comments.entity';
import { Views } from 'src/modules/fairytale/entity/fairytale-views.entity';
import { FairytaleLike } from 'src/modules/fairytale/entity/fairytale-likes.entity';
import { ReadFairytaleController } from 'src/modules/fairytale/fairytale-read.controller';
import { ManageFairytaleController } from 'src/modules/fairytale/fairytale-manage.controller';
import { CommentsController } from 'src/modules/fairytale/fairytale-comments.controller';
import { ReadFairytaleService } from 'src/modules/fairytale/fairytale-read.service';
import { ManageFairytaleService } from 'src/modules/fairytale/fairytale-manage.service';
import { CommentsService } from 'src/modules/fairytale/fairytale-comments.service';
import { ReadFairytaleRepository } from 'src/modules/fairytale/repository/fairytale-read.repository';
import { ManageFairytaleRepository } from 'src/modules/fairytale/repository/fairytale-manage.repository';
import { FairytaleImgRepository } from 'src/modules/fairytale/repository/fairytale-img.repository';
import { ForbiddenWordRepository } from 'src/modules/fairytale/repository/fairytale-forbidden-word.repository';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { CommentsRepository } from 'src/modules/fairytale/repository/fairytale-comments.repository';
import { UsersModule } from 'src/modules/user/user.module';
import { S3Service } from 'src/modules/s3.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Fairytale, User, ForbiddenWord, FairytaleImg, UserRepository, Views, Comments]),
        UsersModule,
        TypeOrmModule.forFeature([Fairytale, User, ForbiddenWord, FairytaleImg, UserRepository, Views, FairytaleLike]),
        forwardRef(() => UsersModule),
    ],
    controllers: [ReadFairytaleController, ManageFairytaleController, CommentsController],
    providers: [
        ReadFairytaleRepository,
        ManageFairytaleRepository,
        ReadFairytaleService,
        ManageFairytaleService,
        UserRepository,
        CommentsRepository,
        CommentsService,
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
    exports: [ReadFairytaleRepository],
})
export class FairytaleModule {}
