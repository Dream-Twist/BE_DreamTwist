/**
File Name : point-rates.controller
Description : 포인트 상품 관련 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PointRatesService } from 'src/modules/billing/point-rates.service';
import { PointRates } from 'src/modules/billing/entity/point-rates.entity';

@ApiTags('Point-Rates')
@Controller('point-rates')
export class PointRatesController {
    constructor(private readonly pointRatesService: PointRatesService) {}

    @ApiOperation({ summary: '상품 전체 검색' })
    @ApiResponse({
        status: 200,
        description: '상품 검색 성공',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    points: { type: 'integer', example: 10 },
                    amount: { type: 'integer', example: 3000 },
                },
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
    @Get()
    getAllPointRates() {
        return this.pointRatesService.findAll();
    }

    @ApiOperation({ summary: '가격으로 상품 포인트 검색' })
    @ApiResponse({
        status: 200,
        description: '상품 포인트 검색 성공',
        schema: {
            type: 'object',
            properties: {
                points: { type: 'number', example: '10' },
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
            properties: { error: { type: 'string', example: '해당 가격의 포인트 상품이 없습니다.' } },
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
    @Get(':amount')
    async getPointsByAmount(@Param('amount') amount: string): Promise<PointRates> {
        const parsedAmount = parseInt(amount, 10);

        if (isNaN(parsedAmount)) {
            throw new BadRequestException('유효한 금액이 아닙니다.');
        }

        return this.pointRatesService.findPointsByAmount(parsedAmount);
    }
}
