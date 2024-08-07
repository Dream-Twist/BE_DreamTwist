/**
File Name : auth.controller
Description : Auth Controller
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.07.30  박수정      Modified    Google 회원가입 및 로그인 기능 추가
2024.08.01  박수정      Modified    RefreshToken 검증 및 AccessToken 재발급 기능 추가
2024.08.07  박수정      Modified    Google Callback 관련 res
*/

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/modules/auth/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // Google 회원가입 및 로그인
    // http://localhost:4000/auth/google/login
    @Get('google/login')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {}

    // Google Callback
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res): Promise<void> {
        const userDTO = {
            googleId: req.user.googleId,
            email: req.user.email,
            name: req.user.name,
        };

        const tokens = await this.authService.googleLogin(userDTO);

        res.redirect(`http://localhost:3000/#accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    }

    // RefreshToken 검증 및 AccessToken 재발급
    @Post('regenerate-accesstoken')
    async regenerateAccesstoken(@Body('refreshToken') refreshToken: string): Promise<{ accessToken: string }> {
        return this.authService.regenerateAccessToken(refreshToken);
    }
}
