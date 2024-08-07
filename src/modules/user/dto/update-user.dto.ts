/**
File Name : update-user.dto
Description : 회원정보 수정 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    회원정보 수정 기능 추가
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    profileImageURL: string;
}
