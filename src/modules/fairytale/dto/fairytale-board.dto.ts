/**
File Name : fairytale-board.dto
Description : 동화 스토리 보드 DTO
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    based on create dto
*/

import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class BoardFairytaleDto {
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
