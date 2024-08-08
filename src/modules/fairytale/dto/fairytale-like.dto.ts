/**
File Name : fairytale-like.dto
Description : 동화 스토리 좋아요 DTO
Author : 박수정

History
Date        Author      Status      Description
2024.08.03  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 좋아요 DTO 생성
2024.08.07  강민규      Modified    리포지토리 기반 추가 행 생성
2024.08.08  강민규      Modified    동화 ID만 활용
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeFairytaleDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    fairytaleId: number;
}
