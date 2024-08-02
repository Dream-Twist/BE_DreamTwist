import { Module } from '@nestjs/common';
import { UsersService } from 'src/modules/user/user.service';

@Module({
    providers: [UsersService],
})
export class UsersModule {}
