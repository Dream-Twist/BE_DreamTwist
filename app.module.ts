import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ModulesModule } from './modules/modules.module';
import { UsersController } from './src/modules/users/users.controller';
import { StoriesModule } from './src/modules/stories/stories.module';
import { ImagesModule } from './src/modules/images/images.module';
import { AudioModule } from './src/modules/audio/audio.module';
import { CharactersModule } from './src/modules/characters/characters.module';

@Module({
  imports: [StoriesModule, ImagesModule, AudioModule,CharactersModule,ConfigModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
