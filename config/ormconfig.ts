/**
File Name : ormconfig.ts
Description : ORM config
Author : 강민규

History
Date        Author      Status      Description
2024.07.19  강민규      Created     
2024.07.20  박수정      Modified    DB 설정
*/

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ormconfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false, // 초기 스키마 생성 시에만 true
    autoLoadEntities: true,
    charset: 'utf8mb4',
    keepConnectionAlive: true,
};

export default ormconfig;
