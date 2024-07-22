/**
File Name : fairytale-create.controller
Description : 동화 스토리 생성 Entity
Author : 박수정

History
Date        Author      Status      Description
2024.07.19  박수정      Created     
2024.07.20  박수정      Modified    동화 스토리 생성 기능 추가
*/

// import { Controller, Post, Body, Request } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';
import { FairytaleService } from './fairytale-board.service';
import { CreateFairytaleDto } from './dto/fairytale-board.dto';

// 동화 스토리 생성
@Controller('fairytale')
export class FairytaleController {
    constructor(private readonly fairytaleService: FairytaleService) {}

    @Post()
    // async createFairytale(@Body() createFairytaleDto: CreateFairytaleDto, @Request() req) {
    async createFairytale(@Body() createFairytaleDto: CreateFairytaleDto) {
        // return this.fairytaleService.createFairytale(createFairytaleDto, req.user);
        return this.fairytaleService.createFairytale(createFairytaleDto);
    }
}
