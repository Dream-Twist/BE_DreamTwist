/**
File Name : create-user.dto
Description : 회원가입 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.07.30  박수정      Created
2024.07.30  박수정      Modified    회원가입 기능 추가
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateUserDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    googleId: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    nickname?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    profileImageId?: number;
}
