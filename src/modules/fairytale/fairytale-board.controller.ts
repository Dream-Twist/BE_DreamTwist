/**
File Name : fairytale-board.controller
Description : 동화 스토리 controller
Author : 강민규

History
Date        Author      Status      Description
2024.07.22  강민규      Created     
2024.07.22  강민규      Modified    based on create controller
*/

// import { Controller, Post, Body, Request } from '@nestjs/common';
import { Controller, Body, Post, Get, Patch, Delete } from '@nestjs/common';
import { BoardFairytaleService } from './fairytale-board.service';
import { BoardFairytaleDto } from './dto/fairytale-board.dto';

// 동화 스토리 생성
@Controller('fairytale')
export class BoardFairytaleController {
    constructor(private readonly fairytaleService: BoardFairytaleService) {}

    @Get()
    // async createFairytale(@Body() createFairytaleDto: CreateFairytaleDto, @Request() req) {
    async read(@Body() boardFairytaleDto: BoardFairytaleDto) {
        // return this.fairytaleService.createFairytale(createFairytaleDto, req.user);
        return this.fairytaleService.createFairytale(boardFairytaleDto);
    }

    @Patch()
    // async createFairytale(@Body() createFairytaleDto: CreateFairytaleDto, @Request() req) {
    async update(@Body() boardFairytaleDto: BoardFairytaleDto) {
        // return this.fairytaleService.createFairytale(createFairytaleDto, req.user);
        return this.fairytaleService.createFairytale(boardFairytaleDto);
    }

    @Delete()
    // async createFairytale(@Body() createFairytaleDto: CreateFairytaleDto, @Request() req) {
    async delete(@Body() boardFairytaleDto: BoardFairytaleDto) {
        // return this.fairytaleService.createFairytale(createFairytaleDto, req.user);
        return this.fairytaleService.createFairytale(boardFairytaleDto);
    }
}
