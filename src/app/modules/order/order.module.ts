import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from 'src/app/repositories/order.repository';
import { BillRepository } from 'src/app/repositories/bill.repository';
import { CartRepository } from 'src/app/repositories/cart.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, BillRepository, CartRepository]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
