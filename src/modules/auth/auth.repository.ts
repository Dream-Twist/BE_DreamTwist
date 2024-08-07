/**
File Name : auth.repository
Description : Auth Repository
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.07.30  박수정      Modified    Google 회원가입 및 로그인 기능 추가
2024.08.01  박수정      Modified    RefreshToken 검증 및 AccessToken 재발급 기능 추가
*/

import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthTokens } from 'shared/types/auth.types';
import { User } from 'src/modules/user/entity/user.entity';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { UserRepository } from 'src/modules/user/repository/user.repository';

@Injectable()
export class AuthRepository {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    // Google Id로 회원 조회
    async findUserByGoogleId(googleId: string): Promise<User | null> {
        return this.userRepository.findUserByGoogleId(googleId);
    }

    // 회원가입
    async createUser(userData: CreateUserDTO): Promise<User> {
        return this.userRepository.createUser(userData);
    }

    // 로그인 시, Online으로 변경
    async updateUserOnline(userId: number, isOnline: boolean): Promise<void> {
        await this.userRepository.updateUserOnline(userId, isOnline);
    }

    // RefreshToken 발급
    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        await this.userRepository.updateRefreshToken(userId, refreshToken);
    }

    // AccessToken, RefreshToken 발급
    async generateTokens(user: User): Promise<AuthTokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(user),
            this.generateRefreshToken(user),
        ]);

        return { accessToken, refreshToken };
    }

    // AccessToken 발급
    async generateAccessToken(user: User): Promise<string> {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.sign(payload, this.getJwtOptions('access'));
    }

    // RefreshToken 발급
    private async generateRefreshToken(user: User): Promise<string> {
        const payload = { sub: user.id };
        return this.jwtService.sign(payload, this.getJwtOptions('refresh'));
    }

    // JWT 토큰 검증
    verifyRefreshToken(refreshToken: string): any {
        return this.jwtService.verify(refreshToken, this.getJwtOptions('refresh'));
    }

    // JWT 옵션
    private getJwtOptions(type: 'access' | 'refresh'): JwtSignOptions {
        return {
            secret: this.configService.get(`JWT_${type.toUpperCase()}_SECRET`),
            expiresIn: this.configService.get(`JWT_${type.toUpperCase()}_EXPIRATION`),
        };
    }
}
