/**
File Name : ai-fairytale-create.dto
Description : AI 동화 스토리 생성 DTO
Author : 이유민

History
Date        Author      Status      Desc=ription
2024.07.29  이유민      Created     
2024.07.29  이유민      Modified    AI 동화 스토리 생성 기능 추가
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAIFairytaleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    prompt: string;
}
