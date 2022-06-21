import { Module } from '@nestjs/common';

import { SizeService } from './size.service';
import { SizeController } from './size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeRepository } from 'src/app/repositories/size.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SizeRepository])],
  controllers: [SizeController],
  providers: [SizeService],
})
export class SizeModule {}
