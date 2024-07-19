import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ModulesModule } from './modules/modules.module';
import { UsersController } from './modules/users/users.controller';
import { StoriesModule } from './modules/stories/stories.module';
import { ImagesModule } from './modules/images/images.module';
import { AudioModule } from './modules/audio/audio.module';
import { CharactersModule } from './modules/characters/characters.module';

@Module({
  imports: [StoriesModule, ImagesModule, AudioModule,CharactersModule,ConfigModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
