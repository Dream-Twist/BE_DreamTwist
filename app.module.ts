import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
//Controller
import { AppController } from './app.controller';
import { UsersController } from './src/modules/users/users.controller';
import { PostsController } from 'src/modules/posts/posts.controller';
//Provider
import { AppService } from './app.service';
import { UsersService } from 'src/modules/users/users.service';
import { PostsService } from 'src/modules/posts/posts.service';
//Module
import { StoriesModule } from './src/modules/stories/stories.module';
import { ImagesModule } from './src/modules/images/images.module';
import { AudioModule } from './src/modules/audio/audio.module';
import { CharactersModule } from './src/modules/characters/characters.module';
import { PostsModule } from './src/modules/posts/posts.module';
import { UsersModule } from './src/modules/users/users.module'

//데이터베이스
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './src/modules/users/users.entity';
import { Posts } from './src/modules/posts/posts.entity';
import *as ormconfig from './ormconfig';



@Module({
  imports: [StoriesModule, ImagesModule, AudioModule,CharactersModule,ConfigModule, PostsModule,Users,
    Posts,TypeOrmModule.forRoot(ormconfig), UsersModule,],
  controllers: [AppController, UsersController, PostsController],
  providers: [AppService,UsersService,PostsService],
})
export class AppModule {}
