/**
File Name : swagger.decorators
Description : Swagger Decorator - CRUD 기능별 분류
Author : 박수정

History
Date        Author      Status      Description
2024.08.03  박수정      Created     
2024.08.03  박수정      Modified    Swagger Decorator 생성
*/

import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

interface ApiOperationOptions {
    summary: string;
    successMessage?: string;
    successResponseSchema?: object;
    successDescription?: string;
    description?: string;
    notFoundMessage?: string;
}

// Swagger - 조회
export function ApiGetOperation(options: ApiOperationOptions) {
    const { summary, successMessage, successResponseSchema, notFoundMessage, description } = options;

    const successSchema = successResponseSchema || {
        type: 'object',
        properties: {
            message: { type: 'string', example: successMessage },
        },
    };

    return applyDecorators(
        ApiOperation({ summary, description }),
        ApiResponse({
            status: 200,
            description: '성공',
            schema: successSchema,
        }),
        ApiResponse({
            status: 400,
            description: '잘못된 요청',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
            },
        }),
        ApiResponse({
            status: 401,
            description: '인증 실패',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
            },
        }),
        ApiResponse({
            status: 404,
            description: '요청한 리소스를 찾을 수 없음',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: notFoundMessage } },
            },
        }),
        ApiResponse({
            status: 500,
            description: '서버 내부 오류',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
            },
        }),
    );
}

// Swagger - 작성
export function ApiPostOperation(options: ApiOperationOptions) {
    const { summary, successMessage, successResponseSchema, successDescription = '성공', description } = options;

    const successSchema = successResponseSchema || {
        type: 'object',
        properties: {
            message: { type: 'string', example: successMessage },
        },
    };

    return applyDecorators(
        ApiOperation({ summary, description }),
        ApiResponse({
            status: 201,
            description: successDescription,
            schema: successSchema,
        }),
        ApiResponse({
            status: 400,
            description: '잘못된 요청',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
            },
        }),
        ApiResponse({
            status: 401,
            description: '인증 실패',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
            },
        }),
        ApiResponse({
            status: 404,
            description: '요청한 리소스를 찾을 수 없음',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다.' } },
            },
        }),
        ApiResponse({
            status: 500,
            description: '서버 내부 오류',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
            },
        }),
    );
}

// Swagger - 수정
export function ApiPutOperation(options: ApiOperationOptions) {
    const { summary, successMessage, successResponseSchema, successDescription = '성공', description } = options;

    const successSchema = successResponseSchema || {
        type: 'object',
        properties: {
            message: { type: 'string', example: successMessage },
        },
    };

    return applyDecorators(
        ApiOperation({ summary, description }),
        ApiResponse({
            status: 200,
            description: successDescription,
            schema: successSchema,
        }),
        ApiResponse({
            status: 400,
            description: '잘못된 요청',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
            },
        }),
        ApiResponse({
            status: 401,
            description: '인증 실패',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
            },
        }),
        ApiResponse({
            status: 404,
            description: '요청한 리소스를 찾을 수 없음',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '요청한 리소스를 찾을 수 없습니다.' } },
            },
        }),
        ApiResponse({
            status: 500,
            description: '서버 내부 오류',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
            },
        }),
    );
}

// Swagger - 삭제
export function ApiDeleteOperation(options: ApiOperationOptions) {
    const {
        summary,
        successMessage,
        successResponseSchema,
        successDescription = '성공',
        description,
        notFoundMessage,
    } = options;

    const successSchema = successResponseSchema || {
        type: 'object',
        properties: {
            message: { type: 'string', example: successMessage },
        },
    };

    return applyDecorators(
        ApiOperation({ summary, description }),
        ApiResponse({
            status: 200,
            description: successDescription,
            schema: successSchema,
        }),
        ApiResponse({
            status: 400,
            description: '잘못된 요청',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '잘못된 요청입니다.' } },
            },
        }),
        ApiResponse({
            status: 401,
            description: '인증 실패',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '인증에 실패했습니다.' } },
            },
        }),
        ApiResponse({
            status: 404,
            description: '요청한 리소스를 찾을 수 없음',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: notFoundMessage } },
            },
        }),
        ApiResponse({
            status: 500,
            description: '서버 내부 오류',
            schema: {
                type: 'object',
                properties: { error: { type: 'string', example: '서버 내부 에러가 발생했습니다.' } },
            },
        }),
    );
}
