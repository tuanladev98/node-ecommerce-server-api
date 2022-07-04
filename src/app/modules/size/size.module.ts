import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { SizeRepository } from 'src/app/repositories/size.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SizeRepository])],
  controllers: [SizeController],
  providers: [SizeService],
})
export class SizeModule {}
