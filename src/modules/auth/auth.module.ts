/**
File Name : auth.module
Description : Auth Module
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.07.30  박수정      Modified    Google 회원가입 및 로그인 기능 추가
2024.08.01  박수정      Modified    RefreshToken 검증 및 AccessToken 재발급 기능 추가
2024.08.08  이유민      Modified    회원가입 이벤트 추가
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthService } from 'src/modules/auth/auth.service';
import { GoogleStrategy } from 'src/modules/auth/google.strategy';
import { JWTStrategy } from 'src/modules/auth/jwt.strategy';
import { AuthRepository } from 'src/modules/auth/auth.repository';
import { S3Service } from 'src/modules/s3.service';
import { UsersModule } from 'src/modules/user/user.module';
import { PointHistoryRepository } from 'src/modules/billing/repository/point-history.repository';
import { PointHistory } from 'src/modules/billing/entity/point-history.entity';
import { PointHistoryService } from 'src/modules/billing/point-history.service';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION'),
                },
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
        PointHistory,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository,
        GoogleStrategy,
        JWTStrategy,
        S3Service,
        PointHistoryRepository,
        PointHistoryService,
    ],
    exports: [AuthService, JWTStrategy, PassportModule],
})
export class AuthModule {}
