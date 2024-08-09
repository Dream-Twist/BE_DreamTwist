/**
File Name : user.service
Description : User Service
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.07.30  박수정      Modified    회원정보 수정, 회원탈퇴, 로그아웃 기능 추가
2024.08.01  박수정      Modified    프로필 이미지 업로드 기능 추가
2024.08.05  박수정      Modified    나의 동화, 댓글, 좋아요 기능 추가
2024.08.07  박수정      Modified    회원정보 조회 기능 추가
*/

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { S3Service } from 'src/modules/s3.service';
import { UpdateUserDTO } from 'src/modules/user/dto/update-user.dto';
import { DeleteUserDTO } from 'src/modules/user/dto/delete-user.dto';
import { User } from 'src/modules/user/entity/user.entity';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { ProfileImageRepository } from 'src/modules/user/repository/profile-image.repository';
import { ReadFairytaleRepository } from 'src/modules/fairytale/repository/fairytale-read.repository';
import { FairytaleLikeRepository } from 'src/modules/fairytale/repository/fairytale-like.repository';
import { CommentsRepository } from 'src/modules/fairytale/repository/fairytale-comments.repository';
import { PointHistoryService } from 'src/modules/billing/point-history.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly profileImageRepository: ProfileImageRepository,
        private readonly s3Service: S3Service,
        private readonly fairytaleRepository: ReadFairytaleRepository,
        private readonly fairytaleLikeRepository: FairytaleLikeRepository,
        private readonly commentsRepository: CommentsRepository,
        private readonly pointHistoryService: PointHistoryService,
    ) {}

    // 회원정보 조회
    async getUser(userId: number): Promise<any> {
        const user = await this.userRepository.getUser(userId);

        // 포인트
        const points = await this.pointHistoryService.userPoints(userId);
        user.points = points;

        return user;
    }

    // 회원정보 수정
    async updateUser(userId: number, updateUserDTO: UpdateUserDTO): Promise<string> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        // 닉네임 수정
        await this.validateNickname(updateUserDTO.nickname, user);
        user.nickname = updateUserDTO.nickname;

        // 프로필 이미지 업로드
        if (updateUserDTO.profileImageURL !== undefined) {
            if (updateUserDTO.profileImageURL === '') {
                // 이미지 업로드를 하지 않은 경우, 기본 프로필 이미지로 변경
                const defaultProfileImageUrl = this.s3Service.getDefaultProfileImgURL();
                const profileImage = await this.profileImageRepository.updateProfileImage(
                    userId,
                    defaultProfileImageUrl,
                );

                user.profileImageId = profileImage.id;
            } else {
                // 이미지 업로드를 한 경우, 해당 프로필 이미지로 변경
                const profileImage = await this.profileImageRepository.updateProfileImage(
                    userId,
                    updateUserDTO.profileImageURL,
                );

                user.profileImageId = profileImage.id;
            }
        }

        user.updatedAt = new Date();
        await this.userRepository.updateUser(user);

        return user.nickname;
    }

    // 닉네임 유효성 검사
    private async validateNickname(nickname: string, user: User): Promise<void> {
        if (!nickname) throw new BadRequestException('닉네임을 입력하세요.');

        const nameRegex = /^[가-힣a-zA-Z0-9]{2,20}$/;
        if (!nameRegex.test(nickname)) {
            throw new BadRequestException('한글, 영문, 숫자 포함 2~20자로 입력하세요.');
        }

        if (user.nickname === nickname) {
            throw new BadRequestException('기존 닉네임과 동일한 닉네임입니다.');
        }

        const existingUser = await this.userRepository.findUserByNickname(nickname);
        if (existingUser && existingUser.id !== user.id) {
            throw new BadRequestException('이미 존재하는 닉네임입니다.');
        }
    }

    // Presigned URL 생성
    async getPresignedURL(userId: number, fileName: string): Promise<string> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        const folderId = nanoid(6);
        const key = `img/profileImg/${userId}/${folderId}/${Date.now()}-${fileName}`;

        return this.s3Service.generatePresignedURL(key);
    }

    // 회원탈퇴
    async deleteUser(userId: number, deleteUserDTO: DeleteUserDTO): Promise<void> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        if (user.email !== deleteUserDTO.email) {
            throw new UnauthorizedException('이메일이 일치하지 않습니다.');
        }

        await this.userRepository.deleteUser(userId);
    }

    // 로그아웃
    async logout(userId: number): Promise<void> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        if (user.refreshToken === null) {
            throw new BadRequestException('이미 로그아웃 되었습니다.');
        }

        await this.userRepository.logout(userId, {
            refreshToken: null,
            isOnline: false,
        });
    }

    // 나의 동화
    async getMyFairytales(userId: number): Promise<any> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        const myFairytales = await this.fairytaleRepository.getMyFairytales(userId);
        if (myFairytales.length === 0) {
            throw new NotFoundException('작성한 동화가 없습니다.');
        }

        return myFairytales;
    }

    // 나의 댓글
    async getMyComments(userId: number): Promise<any> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        const myComments = await this.commentsRepository.getMyComments(userId);
        if (myComments.length === 0) {
            throw new NotFoundException('작성한 댓글이 없습니다.');
        }

        return myComments;
    }

    // 나의 좋아요
    async getMyLikes(userId: number): Promise<any> {
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new NotFoundException('회원을 찾을 수 없습니다.');
        }

        const myLikes = await this.fairytaleLikeRepository.getMyLikes(userId);
        if (myLikes.length === 0) {
            throw new NotFoundException('좋아요한 동화가 없습니다.');
        }

        return myLikes;
    }
}
