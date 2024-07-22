/**
File Name : main
Description : main.ts
Author : 강민규

History
Date        Author      Status      Description
2024.07.19  강민규      Created     
*/

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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
