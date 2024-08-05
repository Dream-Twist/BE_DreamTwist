/**
File Name : billing.dto
Description : 상품 결제 DTO
Author : 이유민

History
Date        Author      Status      Description
2024.08.01  이유민      Created     
2024.08.01  이유민      Modified    결제 관련 기능 추가
2024.08.04  이유민      Modified    결제 취소 추가
*/

import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BillingDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    paymentKey: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
    amount: number;
}

export class CancelDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    payment_key: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cancelReason: string;
}
