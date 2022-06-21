import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from 'src/app/repositories/cart.repository';
import { ProductRepository } from 'src/app/repositories/product.repository';
import { SizeRepository } from 'src/app/repositories/size.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartRepository,
      ProductRepository,
      SizeRepository,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
