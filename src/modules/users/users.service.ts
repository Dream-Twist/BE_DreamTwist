import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(user: Users): Promise<Users> {
    return this.usersRepository.save(user);
  }

  async update(id: number, user: Partial<Users>): Promise<Users> {
    await this.usersRepository.update(id, user);
    return this.usersRepository.findOneBy({ id });
  }

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}