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
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class LikeFairytaleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    theme: '우화' | '환경' | '사랑' | '모험' | '추리' | '기타';

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    privatedAt: boolean;
}
