/**
File Name : point-rates.controller
Description : 포인트 상품 관련 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
2024.08.03  박수정      Modified    Swagger Decorator 적용
*/

import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PointRatesService } from 'src/modules/billing/point-rates.service';
import { ApiGetOperation } from 'shared/utils/swagger.decorators';

@ApiTags('Point-Rates')
@Controller('point-rates')
export class PointRatesController {
    constructor(private readonly pointRatesService: PointRatesService) {}

    @ApiGetOperation({
        summary: '상품 전체 검색',
        successResponseSchema: {
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
        notFoundMessage: '요청한 리소스를 찾을 수 없습니다.',
    })
    @Get()
    getAllPointRates() {
        return this.pointRatesService.findAll();
    }
}
