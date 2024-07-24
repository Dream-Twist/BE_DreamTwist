/**
File Name : fairytale-board.controller
Description : 동화 스토리 controller
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    based on create controller
2024.07.24  강민규      Modified    GET method
*/

// import { Controller, Post, Body, Request } from '@nestjs/common';
import { Controller, Body, Get, Patch, Delete, Param, NotFoundException, ParseIntPipe} from '@nestjs/common';
import { BoardFairytaleService } from './fairytale-board.service';
import { BoardFairytaleDto } from './dto/fairytale-board.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Fairytale } from './entity/fairytale.entity';

@ApiTags('Fairytale')
@Controller('fairytale')
export class BoardFairytaleController {
    constructor(private readonly fairytaleService: BoardFairytaleService) {}

    @ApiOperation({ summary: '동화 스토리 조회' })
    @ApiResponse({
        status: 201,
        description: '동화 스토리 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '동화 스토리가 성공적으로 생성되었습니다.' },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: '잘못된 요청',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
        },
    })
    @ApiResponse({
        status: 401,
        description: '인증 실패',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
        },
    })
    @ApiResponse({
        status: 404,
        description: '요청한 리소스를 찾을 수 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다.' } },
        },
    })
    @ApiResponse({
        status: 500,
        description: '서버 내부 오류',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
        },
    })
    // 동화 스토리 조회
    @Get(':id')
    async getFairytale(@Param('id') id: number): Promise<Fairytale> {
        return this.fairytaleService.getFairytaleById(id);
    }

    //동화 스토리 수정
    // @Patch(':id')
    // async update(@Param('id') fairytaleId: number, @Body() boardFairytaleDto: BoardFairytaleDto) {
    // }

    // //동화 스토리 지우기
    // @Delete()
    // // async createFairytale(@Body() createFairytaleDto: CreateFairytaleDto, @Request() req) {
    // async delete(@Body() boardFairytaleDto: BoardFairytaleDto) {
    //     // return this.fairytaleService.createFairytale(createFairytaleDto, req.user);
    //     return this.fairytaleService.createFairytale(boardFairytaleDto);
    // }
}
