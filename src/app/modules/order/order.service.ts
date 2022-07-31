import { BadRequestException, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';

import { BillRepository } from 'src/app/repositories/bill.repository';
import { CartRepository } from 'src/app/repositories/cart.repository';
import { OrderRepository } from 'src/app/repositories/order.repository';
import { OrderEntity } from 'src/app/database/entities/order.entity';
import { BillEntity } from 'src/app/database/entities/bill.entity';
import { CartEntity } from 'src/app/database/entities/cart.entity';
import { OrderStatus } from 'src/app/vendors/common/enums';

@Injectable()
export class OrderService {
  constructor(
    private readonly dbConnection: Connection,
    private readonly billRepository: BillRepository,
    private readonly cartRepository: CartRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  private makeOrderCode(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * length));
    }
    return new Date().toISOString().split('T')[0].replace('-', '') + result;
  }

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
          orderCode: this.makeOrderCode(5),
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

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(CartEntity)
        .where('user_id = :userId', { userId })
        .execute();

      await queryRunner.commitTransaction();

      return newOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderDetail(userId: number, orderCode: string) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.bills', 'bill')
      .leftJoinAndSelect('bill.product', 'product')
      .leftJoinAndSelect('bill.size', 'size')
      .where('order.order_code = :orderCode', { orderCode })
      .getOne();

    if (!order || order.userId !== userId) return null;

    return order;
  }

  async updateGHN(orderCode: string, ghnCode: string) {
    const order = await this.orderRepository.findOne({ where: { orderCode } });

    if (!order) throw new BadRequestException('order not found!');

    order.ghnShippingCode = ghnCode;

    if (order.status === OrderStatus.PROCESSING)
      order.status = OrderStatus.PREPARING_SHIPMENT;

    return await this.orderRepository.save(order);
  }

  async markDelivered(orderCode: string) {
    const order = await this.orderRepository.findOne({ where: { orderCode } });

    if (!order) throw new BadRequestException('order not found!');

    if (!order.ghnShippingCode) {
      order.status = OrderStatus.PROCESSING;
      return await this.orderRepository.save(order);
    }

    if (
      order.ghnShippingCode &&
      order.status === OrderStatus.PREPARING_SHIPMENT
    ) {
      order.status = OrderStatus.DELIVERED;
      return await this.orderRepository.save(order);
    }

    if (order.ghnShippingCode && order.status === OrderStatus.DELIVERED) {
      order.status = OrderStatus.PREPARING_SHIPMENT;
      return await this.orderRepository.save(order);
    }
  }

  getOrderHistory(userId: number) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.bills', 'bill')
      .leftJoinAndSelect('bill.product', 'product')
      .leftJoinAndSelect('bill.size', 'size')
      .where('order.user_id = :userId', { userId })
      .orderBy('order.created_at', 'DESC')
      .getMany();
  }

  getAll() {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.bills', 'bill')
      .leftJoinAndSelect('bill.product', 'product')
      .leftJoinAndSelect('bill.size', 'size')
      .orderBy('order.created_at', 'DESC')
      .getMany();
  }

  async getOrderDetailForAdmin(orderCode: string) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.bills', 'bill')
      .leftJoinAndSelect('bill.product', 'product')
      .leftJoinAndSelect('bill.size', 'size')
      .where('order.order_code = :orderCode', { orderCode })
      .getOne();

    return order;
  }

  updateOrderPayment(orderCode: string, paymentIntentId: string) {
    return this.orderRepository.update(
      { orderCode },
      { stripeSucceededPaymentIntentId: paymentIntentId },
    );
  }
}
