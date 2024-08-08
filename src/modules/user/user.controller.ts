/**
File Name : user.controller
Description : User Controller
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created     
2024.07.30  박수정      Modified    회원정보 수정, 회원탈퇴, 로그아웃 기능 추가
2024.08.01  박수정      Modified    프로필 이미지 업로드 기능 추가
2024.08.05  박수정      Modified    나의 동화, 댓글, 좋아요 기능 추가
2024.08.07  박수정      Modified    회원정보 조회 기능 추가
*/

import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';
import { UpdateUserDTO } from 'src/modules/user/dto/update-user.dto';
import { DeleteUserDTO } from 'src/modules/user/dto/delete-user.dto';
import { UserService } from 'src/modules/user/user.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 회원정보 조회
    @Get()
    async getUser(@Req() req): Promise<any> {
        const user = await this.userService.getUser(req.user.userId);
        return user;
    }

    // 회원정보 수정
    @Patch('update')
    async updateUser(@Req() req, @Body() updateUserDTO: UpdateUserDTO): Promise<{ nickname: string; message: string }> {
        const nickname = await this.userService.updateUser(req.user.userId, updateUserDTO);
        return {
            nickname: nickname,
            message: '회원정보가 수정되었습니다.',
        };
    }

    // Presigned URL 요청
    @Post('presigned-url')
    async getPresignedURL(@Req() req, @Body('') body: { fileName: string }): Promise<{ presignedURL: string }> {
        const presignedURL = await this.userService.getPresignedURL(req.user.userId, body.fileName);
        return { presignedURL };
    }

    // 회원탈퇴
    @Delete('delete')
    async deleteUser(@Req() req, @Body() deleteUserDTO: DeleteUserDTO): Promise<{ message: string }> {
        await this.userService.deleteUser(req.user.userId, deleteUserDTO);
        return { message: '회원탈퇴가 완료되었습니다.' };
    }

    // 로그아웃
    @Post('logout')
    async logout(@Req() req): Promise<{ message: string }> {
        await this.userService.logout(req.user.userId);
        return { message: '로그아웃 되었습니다.' };
    }

    // 나의 동화
    @Get('my-fairytales')
    async getMyFairytales(@Req() req): Promise<{ myFairytales: any }> {
        const myFairytales = await this.userService.getMyFairytales(req.user.userId);
        return { myFairytales };
    }

    // 나의 댓글
    @Get('my-comments')
    async getMyComments(@Req() req): Promise<{ myComments: any }> {
        const myComments = await this.userService.getMyComments(req.user.userId);
        return { myComments };
    }

    // 나의 좋아요
    @Get('my-likes')
    async getMyLikes(@Req() req): Promise<{ myLikes: any }> {
        const myLikes = await this.userService.getMyLikes(req.user.userId);
        return { myLikes };
    }
}
