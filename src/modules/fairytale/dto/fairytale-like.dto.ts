/**
File Name : fairytale-like.dto
Description : 동화 스토리 좋아요 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.08.03  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 좋아요 DTO 생성
*/

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class LikeFairytaleDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    fairytaleId: number;

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    theme: '우화' | '환경' | '사랑' | '모험' | '추리' | '기타';

    @ApiProperty()
    content: string;

    @ApiProperty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    privatedAt: boolean;
}
