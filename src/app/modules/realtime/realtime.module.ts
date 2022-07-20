import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RealtimeController } from './realtime.controller';
import { RealtimeGateway } from './realtime.gateway';
import { MessageService } from './message.service';

import { MessageRepository } from 'src/app/repositories/message.repository';
import { UserRepository } from 'src/app/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, MessageRepository])],
  controllers: [RealtimeController],
  providers: [RealtimeGateway, MessageService],
})
export class RealtimeModule {}
