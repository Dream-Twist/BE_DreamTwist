/**
File Name : main
Description : main.ts
Author : 강민규

History
Date        Author      Status      Description
2024.07.19  강민규      Created     
2024.07.22  박수정      Modified     Swagger 설정
2024.07.23  박수정      Modified     Hot Reload 설정
2024.07.31  이유민      Modified     CORS 관련 코드 수정
*/

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AppModule } from 'src/app.module';

declare const module: any; // Hot Reload 설정

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS 관련 코드
    app.enableCors({
        origin: ['http://localhost:3000', 'http://kdt-ai-10-team01.elicecoding.com', 'http://34.22.84.223'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    });

    // 로그 확인
    app.useLogger(new Logger('debug'));

    // Swagger 설정
    const config = new DocumentBuilder()
        .setTitle('꿈틀 (DreamTwist)')
        .setDescription('DreamTwist API 문서')
        .setVersion('1.0')
        .addServer('http://kdt-ai-10-team01.elicecoding.com/api')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(4000);

    // Hot Reload 설정
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

bootstrap();
