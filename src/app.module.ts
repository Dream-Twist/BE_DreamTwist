/**
File Name : app.module
Description : app.module.ts
Author : 강민규

History
Date        Author      Status      Description
2024.07.19  강민규      Created     
2024.07.20  박수정      Modified    app.module 설정
2024.07.23  박수정      Modified    DB 설정
*/

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FairytaleModule } from './modules/fairytale/fairytale.module';
import { AIFairytaleModule } from './modules/fairytale/ai-fairytale.module';
import { ImagesModule } from './modules/images/images.module';
import { AudioModule } from './modules/audio/audio.module';
import { CharactersModule } from './modules/characters/characters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: false, // 초기 스키마 생성 시에만 true
                autoLoadEntities: true,
                charset: 'utf8mb4',
                keepConnectionAlive: true,
            }),
            inject: [ConfigService],
        }),
        FairytaleModule,
        AIFairytaleModule,
        ImagesModule,
        AudioModule,
        CharactersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
