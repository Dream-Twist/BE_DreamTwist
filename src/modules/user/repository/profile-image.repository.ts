/**
File Name : profile-image.repository
Description : Profile Image Repository
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    프로필 이미지 업로드 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileImage } from 'src/modules/user/entity/profile-image.entity';

@Injectable()
export class ProfileImageRepository {
    constructor(
        @InjectRepository(ProfileImage)
        private readonly profileImageRepository: Repository<ProfileImage>,
    ) {}

    // 프로필 이미지 조회
    async findProfileImageByUserId(userId: number): Promise<ProfileImage | undefined> {
        return this.profileImageRepository.findOne({ where: { userId } });
    }

    // 프로필 이미지 저장
    async saveProfileImage(profileImageData: { path: string; userId: number }): Promise<ProfileImage> {
        const profileImage = this.profileImageRepository.create(profileImageData);
        return this.profileImageRepository.save(profileImage);
    }

    // 프로필 이미지 업로드
    async updateProfileImage(userId: number, path: string): Promise<ProfileImage> {
        const profileImage = await this.profileImageRepository.findOne({ where: { userId } });

        profileImage.path = path;
        profileImage.updatedAt = new Date();

        return this.profileImageRepository.save(profileImage);
    }
}
