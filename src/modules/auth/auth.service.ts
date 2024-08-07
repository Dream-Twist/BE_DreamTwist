/**
File Name : auth.service
Description : Auth Service
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.07.30  박수정      Modified    Google 회원가입 및 로그인 기능 추가
2024.08.01  박수정      Modified    RefreshToken 검증 및 AccessToken 재발급 기능 추가
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthTokens } from 'shared/types/auth.types';
import { customAlphabet } from 'nanoid';
import { S3Service } from 'src/modules/s3.service';
import { User } from 'src/modules/user/entity/user.entity';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { AuthRepository } from 'src/modules/auth/auth.repository';
import { UserRepository } from 'src/modules/user/repository/user.repository';
import { ProfileImageRepository } from 'src/modules/user/repository/profile-image.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userRepository: UserRepository,
        private readonly s3Service: S3Service,
        private readonly profileImageRepository: ProfileImageRepository,
    ) {}

    // 구글 회원가입 및 로그인
    async googleLogin(createUserDTO: CreateUserDTO): Promise<AuthTokens> {
        let user = await this.authRepository.findUserByGoogleId(createUserDTO.googleId);

        // 꿈틀에 회원가입 되지 않은 경우
        if (!user || user.deletedAt) {
            user = await this.createNewUser(createUserDTO);
        }

        // 로그인 시, Online으로 변경
        await this.authRepository.updateUserOnline(user.id, true);

        // AccessToken, RefreshToken 발급
        const tokens = await this.authRepository.generateTokens(user);
        await this.authRepository.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    // 꿈틀 회원가입
    private async createNewUser(createUserDTO: CreateUserDTO): Promise<User> {
        // 닉네임 임의 생성
        const nickname = await this.generateUniqueNickname();

        // 기본 프로필 이미지 설정
        const defaultProfileImageUrl = this.s3Service.getDefaultProfileImgURL();

        const profileImage = await this.profileImageRepository.saveProfileImage({
            path: defaultProfileImageUrl,
            userId: null,
        });

        const user = await this.authRepository.createUser({
            ...createUserDTO,
            nickname,
            profileImageId: profileImage.id,
        });

        profileImage.userId = user.id;
        await this.profileImageRepository.saveProfileImage(profileImage);

        return user;
    }

    // 닉네임 임의 생성
    private async generateUniqueNickname(): Promise<string> {
        const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const nanoid = customAlphabet(alphabet, 6);
        let nickname: string;

        do {
            nickname = nanoid();
        } while (await this.userRepository.findUserByNickname(nickname));

        return nickname;
    }

    // RefreshToken 검증 및 AccessToken 재발급
    async regenerateAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
        const payload = this.verifyRefreshToken(refreshToken);
        const user = await this.userRepository.findUserById(payload.sub);

        // Payload의 UserId로 회원 조회
        if (!user) {
            throw new UnauthorizedException('회원을 찾을 수 없습니다.');
        }

        // DB의 refreshToken 일치 여부 확인
        if (user.refreshToken !== refreshToken) {
            throw new UnauthorizedException('RefreshToken이 일치하지 않습니다.');
        }

        const accessToken = await this.authRepository.generateAccessToken(user);
        return { accessToken };
    }

    // JWT 토큰 검증
    private verifyRefreshToken(refreshToken: string): any {
        try {
            return this.authRepository.verifyRefreshToken(refreshToken);
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
