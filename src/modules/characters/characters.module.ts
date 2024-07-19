import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';

@Module({
  providers: [CharactersService],
  controllers: [CharactersController]
})
export class CharactersModule {}
