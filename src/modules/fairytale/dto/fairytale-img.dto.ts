/**
File Name : fairytale-img.dto
Description : 동화 이미지 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.08.01  박수정      Created     
2024.08.01  박수정      Modified    동화 이미지 업로드 DTO 추가
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreateFairytaleImgDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    creationWay: 'default' | 'upload' | 'ai' | 'palette' | 'mix';

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    coverImage: string;

    @ApiProperty()
    @IsJSON()
    @IsNotEmpty()
    images: string;
}
