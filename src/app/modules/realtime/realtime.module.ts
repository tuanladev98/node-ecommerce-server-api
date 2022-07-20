import { Module } from '@nestjs/common';

import { RealtimeGateway } from './realtime.gateway';

@Module({
  imports: [],
  providers: [RealtimeGateway],
})
export class RealtimeModule {}
