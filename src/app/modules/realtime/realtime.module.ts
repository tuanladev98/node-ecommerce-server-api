import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RealtimeGateway } from './realtime.gateway';

import { MessageRepository } from 'src/app/repositories/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MessageRepository])],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}
