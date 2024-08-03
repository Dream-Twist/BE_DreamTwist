/**
File Name : fairytale-manage.controller
Description : 동화 스토리 생성, 수정, 삭제 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
2024.07.22  박수정      Modified    Swagger 설정
2024.07.26  박수정      Modified    동화 이미지 업로드 기능 추가
2024.08.02  박수정      Modified    이미지 업로드 방식 변경 - Presigned URL
2024.08.03  박수정      Modified    Controller 분리 - 조회 / 생성, 수정, 삭제
2024.08.03  박수정      Modified    Swagger Decorator 적용
*/

import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UseInterceptors,
    Put,
    ParseIntPipe,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ManageFairytaleService } from 'src/modules/fairytale/fairytale-manage.service';
import { CreateFairytaleDto } from 'src/modules/fairytale/dto/fairytale-create.dto';
import { CreateFairytaleImgDto } from 'src/modules/fairytale/dto/fairytale-img.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateFairytaleDto } from './dto/fairytale-update.dto';
import { ApiDeleteOperation, ApiPostOperation, ApiPutOperation } from 'shared/utils/swagger.decorators';

@ApiTags('Fairytale')
@Controller('fairytale')
export class ManageFairytaleController {
    constructor(private readonly manageFairytaleService: ManageFairytaleService) {}

    // 동화 스토리 생성
    @ApiPostOperation({
        summary: '동화 스토리 직접 생성',
        successMessage: '동화 스토리가 성공적으로 생성되었습니다.',
    })
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createFairytale(
        @Body(new ValidationPipe({ transform: true })) createFairytaleDto: CreateFairytaleDto,
        @Body() createFairytaleImgDto: CreateFairytaleImgDto,
    ) {
        const result = await this.manageFairytaleService.createFairytale(createFairytaleDto, createFairytaleImgDto);
        return {
            message: '동화 스토리가 성공적으로 생성되었습니다.',
            result,
        };
    }

    // Presigned URL 요청
    @ApiPostOperation({
        summary: 'Presigned URL 요청',
        successMessage: 'Presigned URL이 성공적으로 생성되었습니다.',
    })
    @Post('presigned-url')
    async getPresignedURL(@Body() body: { userId: number; fileName: string }) {
        const presignedURL = await this.manageFairytaleService.getPresignedURL(body.userId, body.fileName);
        return { presignedURL };
    }

    // 동화 스토리 수정
    @ApiPutOperation({
        summary: '동화 스토리 수정',
        successMessage: '동화 스토리가 성공적으로 수정되었습니다.',
    })
    @Put(':fairytaleId')
    @UseInterceptors(FileInterceptor('image'))
    async updateFairytale(
        @Body(new ValidationPipe({ transform: true })) updateFairytaleDto: UpdateFairytaleDto,
        @Body() createFairytaleImgDto: CreateFairytaleImgDto,
        @Param('fairytaleId', ParseIntPipe) fairytaleId: number,
    ) {
        const result = await this.manageFairytaleService.editUserFairytale(
            fairytaleId,
            updateFairytaleDto,
            createFairytaleImgDto,
        );
        return {
            message: '동화 스토리가 성공적으로 수정되었습니다.',
            result,
        };
    }

    // 동화 스토리 삭제
    @ApiDeleteOperation({
        summary: '동화 스토리 삭제',
        successMessage: '${id} 번 동화를 삭제했습니다',
        notFoundMessage: '{id}번 동화를 찾을 수 없습니다',
    })
    @Delete(':fairytaleId')
    async deleteFairytale(@Param('fairytaleId', ParseIntPipe) id: number): Promise<string> {
        await this.manageFairytaleService.deleteFairytale(id);
        return `${id} 번 동화를 삭제했습니다`;
    }

    // 동화 스토리 좋아요
    // @ApiPostOperation({
    //     summary: '좋아요 생성',
    //     successMessage: '1개의 좋아요가 성공적으로 생성되었습니다.',
    // })
    // @Post('like')
    // async createFairytaleLike(@Body() boardFairytaleDto: BoardFairytaleDto) {
    //     await this.manageFairytaleService.createFairytaleLike(boardFairytaleDto);
    //     return { message: '1개의 좋아요가 성공적으로 생성되었습니다.' };
    // }
}
