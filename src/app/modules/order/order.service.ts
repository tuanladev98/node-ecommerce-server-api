import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { BillRepository } from 'src/app/repositories/bill.repository';
import { CartRepository } from 'src/app/repositories/cart.repository';
import { OrderRepository } from 'src/app/repositories/order.repository';
import { OrderEntity } from 'src/app/database/entities/order.entity';
import { BillEntity } from 'src/app/database/entities/bill.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly dbConnection: Connection,
    private readonly billRepository: BillRepository,
    private readonly cartRepository: CartRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async createOrder(
    userId: number,
    receiver: string,
    address: string,
    phoneNumber: string,
    province: string,
    district: string,
    ward: string,
    postcode: string,
    note?: string,
  ) {
    const cartItems = await this.cartRepository
      .createQueryBuilder('cart_item')
      .where('cart_item.user_id = :userId', { userId })
      .leftJoinAndSelect('cart_item.product', 'product')
      .getMany();
    if (!cartItems || cartItems.length === 0)
      throw new BadRequestException('Your cart is empty!');

    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let amount = 0;
      cartItems.forEach((item) => {
        amount += item.quantity * item.product.price;
      });

      const newOrder = await queryRunner.manager.save(
        queryRunner.manager.create(OrderEntity, {
          userId,
          orderCode: uuidv4(),
          amount,
          receiver,
          address,
          phoneNumber,
          province,
          district,
          ward,
          postcode,
          note,
        }),
      );

      await queryRunner.manager.save(
        cartItems.map((item) => {
          return queryRunner.manager.create(BillEntity, {
            orderId: newOrder.id,
            productId: item.productId,
            sizeId: item.sizeId,
            quantity: item.quantity,
          });
        }),
      );

      await queryRunner.commitTransaction();

      return newOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
