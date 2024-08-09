/**
File Name : billing.controller
Description : 상품 결제 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.03  박수정      Modified    Swagger Decorator 적용
2024.08.04  이유민      Modified    결제 취소 추가
2024.08.04  이유민      Modified    결제 내역 조회 추가
2024.08.05  이유민      Modified    결제 전체 수정
2024.08.08  이유민      Modified    userId 수정
*/

import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillingService } from 'src/modules/billing/billing.service';
import { PointHistoryService } from 'src/modules/billing/point-history.service';
import { BillingDTO, CancelDTO } from 'src/modules/billing/billing.dto';
import { ApiPostOperation, ApiGetOperation } from 'shared/utils/swagger.decorators';
import { JwtAuthGuard } from 'shared/guards/jwt-auth.guard';

@ApiTags('Billing')
@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
    constructor(
        private readonly billingService: BillingService,
        private readonly pointHistoryService: PointHistoryService,
    ) {}

    @ApiPostOperation({
        summary: '결제 승인',
        successMessage: '결제 승인 성공',
        successDescription: '결제 승인 성공',
    })
    @Post()
    async tossPayment(@Req() req, @Body() billingDTO: BillingDTO): Promise<object> {
        return this.billingService.tossPayment(req.user.userId, billingDTO);
    }

    @ApiPostOperation({
        summary: '결제 취소',
        successMessage: '결제 취소 성공',
        successDescription: '결제 취소 성공',
    })
    @Post('cancel')
    async cancelPayment(@Req() req, @Body() cancelDTO: CancelDTO): Promise<object> {
        return this.billingService.cancelPayment(req.user.userId, cancelDTO);
    }

    @ApiGetOperation({
        summary: '사용자 결제내역 전체 조회',
        successResponseSchema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: 'tviva1234567890' },
                    createdAt: { type: 'string', example: '2024-08-05' },
                    amount: { type: 'number', example: 1000 },
                    method: { type: 'string', example: '간편결제' },
                    status: { type: 'string', example: 'DONE' },
                    description: { type: 'string', example: '꿈틀 700 포인트 충전' },
                    isRefundable: { type: 'string', example: 'F' },
                },
                required: ['id', 'createdAt', 'amount', 'method', 'status', 'description', 'isRefundable'],
            },
        },
        notFoundMessage: '해당 결제 내역이 없습니다.',
    })
    @Get()
    async getPointsByAmount(@Req() req): Promise<object> {
        return await this.billingService.findPaymentByUserId(req.user.userId);
    }
}
