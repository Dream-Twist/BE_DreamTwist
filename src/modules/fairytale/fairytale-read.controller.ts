/**
File Name : fairytale-read.controller
Description : 동화 스토리 조회 controller
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    create 리포지토리 기반
2024.07.25  강민규      Modified    GET: 동화 스토리 조회
2024.07.26  강민규      Modified    DELETE: 동화 스토리 및 줄거리 제거
2024.07.27  강민규      Modified    GET: 동화 목록 및 특정 동화 상세 조회
2024.07.30  강민규      Modified    GET: 조회수 기록
2024.07.31  강민규      Modified    GET: 동화 목록 최신순 검색, 닉네임 이미지 조회
2024.08.03  강민규      Modified    PUT: 동화 작성자가 수정
2024.08.03  박수정      Modified    Controller 분리 - 조회 / 생성, 수정, 삭제

*/

// import { Controller, Post, Body, Request } from '@nestjs/common';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ReadFairytaleService } from 'src/modules/fairytale/fairytale-read.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Fairytale')
@Controller('fairytale')
export class ReadFairytaleController {
    constructor(private readonly readFairytaleService: ReadFairytaleService) {}

    // 동화 조회
    @ApiOperation({ summary: '동화 전체 조회' })
    @ApiResponse({
        status: 200,
        description: '동화 전체 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '동화 목록 10개를 성공적으로 조회했습니다.' },
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
            properties: { error: { type: 'string', example: '요청한 유저 {id}의 동화 목록을 찾을 수 없습니다' } },
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
    @Get()
    async getAllFairytalesForUser() {
        return this.readFairytaleService.getFairytales();
    }

    // 동화 상세 조회
    @ApiOperation({ summary: '동화 상세 조회' })
    @ApiResponse({
        status: 200,
        description: '동화 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '해당되는 동화를 성공적으로 조회했습니다.' },
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
            properties: { error: { type: 'string', example: '{id}번 동화 줄거리를 찾을 수 없습니다.' } },
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
    @Get(':fairytaleId')
    async getFairytaleContent(@Param('fairytaleId', ParseIntPipe) fairytaleId: number) {
        // 임시 유저
        const userId = 1;
        const content = await this.readFairytaleService.getFairytaleContent(fairytaleId, userId);
        return content;
    }

    // 동화 제목 검색
    @ApiOperation({ summary: '동화 제목으로 검색' })
    @ApiResponse({
        status: 200,
        description: '동화 조회 성공',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: '해당되는 동화를 성공적으로 조회했습니다.' },
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
            properties: { error: { type: 'string', example: '{title}에 해당되는 동화 줄거리를 찾을 수 없습니다.' } },
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
    @Get('byTitle')
    async getFairytalebyTitle(@Query('title') title: string) {
        const content = await this.readFairytaleService.getAllbyTitle(title);
        return content;
    }
}
