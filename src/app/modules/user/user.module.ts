import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { UserRepository } from 'src/app/repositories/user.repository';
import { UserLogRepository } from 'src/app/repositories/user_log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserLogRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
