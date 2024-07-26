/**
File Name : fairytale-board.controller
Description : 동화 스토리 controller
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    create 리포지토리 기반
2024.07.25  강민규      Modified    GET: 동화 스토리 조회
2024.07.26  강민규      Modified    DELETE: 동화 스토리 및 줄거리 제거
*/

// import { Controller, Post, Body, Request } from '@nestjs/common';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Put } from '@nestjs/common';
import { BoardFairytaleService } from './fairytale-board.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardFairytaleDto } from './dto/fairytale-board.dto';
import { UserDto } from '../user/dto/user.dto';
import { Fairytale } from './entity/fairytale.entity';
@ApiTags('Fairytale')
@Controller('fairytale')
export class BoardFairytaleController {
    constructor(private readonly fairytaleService: BoardFairytaleService) {}

    // 조회
    @ApiOperation({ summary: '유저 조회' })
    @ApiResponse({
        status: 200,
        description: '유저 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '유저를 성공적으로 조회했습니다.' },
            },
        },
    })
    @ApiResponse({
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
            properties: { error: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다' } },
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
    
    @Get('user/:userId')
    async getUserWithFairytales(@Param('userId') userId: string) {
        return await this.fairytaleService.getUserWithFairytales(userId);
    }
    // 수정
    // @ApiOperation({ summary: '동화 스토리 수정' })
    // @ApiResponse({
    //     status: 201,
    //     description: '동화 스토리 수정 성공',
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             message: { type: 'string', example: '동화 스토리가 성공적으로 수정되었습니다.' },
    //         },
    //     },
    // })
    // @ApiResponse({
    //     status: 400,
    //     description: '잘못된 요청',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
    //     },
    // })
    // @ApiResponse({
    //     status: 401,
    //     description: '인증 실패',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
    //     },
    // })
    // @ApiResponse({
    //     status: 404,
    //     description: '요청한 리소스를 찾을 수 없음',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다.' } },
    //     },
    // })
    // @ApiResponse({
    //     status: 500,
    //     description: '서버 내부 오류',
    //     schema: {
    //         type: 'object',
    //         properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
    //     },
    // })
    // @Put(':contentId')
    // async editUserFairytale(@Param('contentId') contentId: number, @Body() boardFairytaleDto: BoardFairytaleDto) {
    //     try {
    //         const updatedFairytale = await this.fairytaleService.updateFairytale(contentId, boardFairytaleDto);
    //         return { message: '동화 스토리가 성공적으로 수정되었습니다.', fairytale: updatedFairytale };
    //     } catch (error) {
    //         return { message: error.message }; // Handle and return meaningful error messages
    //     }
    // }

    @ApiOperation({ summary: '동화 스토리 삭제' })
    @ApiResponse({
        status: 200,
        description: '해당 동화 스토리 삭제 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '${id} 번째 동화책을 삭제했습니다' },
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
        status: 403,
        description: '권한 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '해당 동화에 대한 삭제 권한이 없습니다.' } },
        },
    })
    @ApiResponse({
        status: 404,
        description: '요청한 리소스를 찾을 수 없음',
        schema: {
            type: 'object',
            properties: { error: { type: 'string', example: '동화책을 찾을 수 없습니다' } },
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
    // 동화 스토리 지우기
    @Delete(':id')
    async deleteFairytale(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.fairytaleService.deleteFairytale(id);
    }
    

    
}

