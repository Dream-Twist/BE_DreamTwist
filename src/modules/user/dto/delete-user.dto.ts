/**
File Name : delete-user.dto
Description : 회원탈퇴 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    회원탈퇴 기능 추가
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class DeleteUserDTO {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
