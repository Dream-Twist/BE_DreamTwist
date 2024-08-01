/**
File Name : fairytale-create.dto
Description : 동화 스토리 생성 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가     
2024.07.22  박수정      Modified    Swagger 설정
2024.08.01  박수정      Modified    Entity 변경에 대한 DTO 변경
*/

import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateFairytaleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    theme: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    privatedAt: boolean;
}
