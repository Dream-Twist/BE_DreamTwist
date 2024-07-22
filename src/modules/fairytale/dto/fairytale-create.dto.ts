/**
File Name : fairytale-create.dto
Description : 동화 스토리 생성 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateFairytaleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    labeling: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsBoolean()
    @IsNotEmpty()
    isPublic: boolean;
}
