/**
File Name : fairytale-comments.dto
Description : 동화 댓글 생성 DTO
Author : 원경혜

History
Date        Author      Status      Description
2024.08.05  박수정      Created     
2024.08.06  원경혜      Modified    동화 댓글 생성 기능 추가     
*/

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CommentsFairytaleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    commentId: number;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    fairytaleId: number;
}
