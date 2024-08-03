/**
File Name : billing.controller
Description : 상품 결제 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.03  박수정      Modified    Swagger Decorator 적용
*/

import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillingService } from 'src/modules/billing/billing.service';
import { BillingDTO } from 'src/modules/billing/billing.dto';
import { ApiPostOperation } from 'shared/utils/swagger.decorators';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) {}

    @ApiPostOperation({
        summary: '주문 생성',
        successMessage: '가주문 테이블 생성 성공',
        successDescription: '가주문 테이블 생성 성공',
    })
    @Post()
    tossPayment(@Body() billingDTO: BillingDTO) {
        return this.billingService.tossPayment(billingDTO);
    }
}
