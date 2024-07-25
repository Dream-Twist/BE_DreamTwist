/**
File Name : user.dto
Description : 유저 DTO
Author : 박수정

History
Date        Author   Status    Description
2024.07.19  박수정   Created
2024.07.25  강민규   Modified
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateFairytaleDto } from 'src/modules/fairytale/dto/fairytale-create.dto';
export class UserDto {
    @ApiProperty()
    @IsNumber() // Assuming ID is a UUID; use @IsNumber() if it's a numeric ID
    @IsOptional() 
    id: number;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @ApiProperty()
    @IsBoolean()
    isOnline: boolean;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @IsOptional() 
    @IsDate()
    deletedAt?: Date;

    @ApiProperty()
    @IsOptional()
    fairytales?: CreateFairytaleDto[];
}