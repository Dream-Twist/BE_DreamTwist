/**
File Name : point-rates.module
Description : 포인트 상품 관련 Module
Author : 이유민

History
Date        Author      Status      Description
2024.08.02  이유민      Created     
2024.08.02  이유민      Modified    포인트 기능 추가
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointRates } from 'src/modules/billing/entity/point-rates.entity';
import { PointRatesController } from 'src/modules/billing/point-rates.controller';
import { PointRatesService } from 'src/modules/billing/point-rates.service';
import { PointRatesRepository } from 'src/modules/billing/repository/point-rates.repository';

@Module({
    imports: [TypeOrmModule.forFeature([PointRates])],
    controllers: [PointRatesController],
    providers: [PointRatesService, PointRatesRepository],
    exports: [PointRatesService],
})
export class PointRatesModule {}
