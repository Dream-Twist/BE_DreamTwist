/**
File Name : main
Description : main.ts
Author : 강민규

History
Date        Author      Status      Description
2024.07.19  강민규      Created     
2024.07.22  박수정      Modified     Swagger 설정
*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle('꿈틀 (DreamTwist)')
        .setDescription('DreamTwist API 문서')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

//CORS 멀티 리포지토리 통신
async function repoCORS() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(4000);
}

bootstrap();
repoCORS();
