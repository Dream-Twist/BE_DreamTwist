/**
File Name : user.module
Description : User Module
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.07.30  박수정      Modified    회원정보 수정, 회원탈퇴, 로그아웃 기능 추가
2024.08.01  박수정      Modified    프로필 이미지 업로드 기능 추가
*/

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Service } from 'src/modules/s3.service';
import { User } from 'src/modules/user/entity/user.entity';
import { ProfileImage } from 'src/modules/user/entity/profile-image.entity';
import { UserController } from 'src/modules/user/user.controller';
import { UserService } from 'src/modules/user/user.service';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { ProfileImageRepository } from 'src/modules/user/repository/profile-image.repository';
import { FairytaleModule } from 'src/modules/fairytale/fairytale.module';
import { PointHistory } from 'src/modules/billing/entity/point-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, ProfileImage, PointHistory]), forwardRef(() => FairytaleModule)],
    controllers: [UserController],
    providers: [UserService, UserRepository, ProfileImageRepository, S3Service],
    exports: [UserService, UserRepository, ProfileImageRepository],
})
export class UsersModule {}
