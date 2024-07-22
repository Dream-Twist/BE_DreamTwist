/**
File Name : app.module
Description : app.module.ts
Author : 강민규

History
Date        Author      Status      Description
2024.07.19  강민규      Created     
2024.07.22  박수정      Modified    app.module 설정
*/

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FairytaleModule } from './src/modules/fairytale/fairytale.module';
import { ImagesModule } from './src/modules/images/images.module';
import { AudioModule } from './src/modules/audio/audio.module';
import { CharactersModule } from './src/modules/characters/characters.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from 'config/ormconfig';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot(ormconfig),
        FairytaleModule,
        ImagesModule,
        AudioModule,
        CharactersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
