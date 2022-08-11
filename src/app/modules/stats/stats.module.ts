import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { OrderRepository } from 'src/app/repositories/order.repository';
import { ProductRepository } from 'src/app/repositories/product.repository';
import { UserRepository } from 'src/app/repositories/user.repository';
import { BillRepository } from 'src/app/repositories/bill.repository';
import { UserLogRepository } from 'src/app/repositories/user_log.repository';
import { ReviewRepository } from 'src/app/repositories/review.repository';
import { CategoryRepository } from 'src/app/repositories/category.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BillRepository,
      CategoryRepository,
      UserRepository,
      UserLogRepository,
      ProductRepository,
      OrderRepository,
      ReviewRepository,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
