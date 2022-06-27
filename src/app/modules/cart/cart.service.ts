import { BadRequestException, Injectable } from '@nestjs/common';

import { CartRepository } from 'src/app/repositories/cart.repository';
import { ProductRepository } from 'src/app/repositories/product.repository';
import { SizeRepository } from 'src/app/repositories/size.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly sizeRepository: SizeRepository,
  ) {}

  getCart(userId: number) {
    return this.cartRepository.find({ where: { userId } });
  }

  async getCartDetail(userId: number) {
    const cartItems = await this.cartRepository
      .createQueryBuilder('cart')
      .where('cart.user_id = :userId', { userId })
      .leftJoinAndSelect('cart.product', 'product')
      .leftJoinAndSelect('cart.size', 'size')
      .getMany();
    let total = 0;
    cartItems.forEach((item) => {
      total += item.quantity * item.product.price;
    });
    return {
      cartItems,
      total,
    };
  }

  async addItem(
    userId: number,
    productId: number,
    sizeId: number,
    quantity?: number,
  ) {
    quantity = quantity ?? 1;

    const product = await this.productRepository.findOne(productId);
    if (!product || product.isDelete)
      throw new BadRequestException('Product does not exist.');

    const size = await this.sizeRepository.findOne(sizeId);
    if (!size) throw new BadRequestException('Size does not exist.');

    const cartItem = await this.cartRepository.findOne({
      where: { userId, productId, sizeId },
    });
    console.log(cartItem);

    if (!cartItem)
      await this.cartRepository.save(
        this.cartRepository.create({ userId, productId, sizeId, quantity }),
      );
    else
      await this.cartRepository.save({
        ...cartItem,
        quantity: cartItem.quantity + quantity,
      });

    return await this.cartRepository.find({ where: { userId } });
  }

  async updateItem(
    userId: number,
    productId: number,
    sizeId: number,
    quantity: number,
  ) {
    const cartItem = await this.cartRepository.findOne({
      where: { userId, productId, sizeId },
    });

    if (!cartItem) {
      return this.cartRepository.save(
        this.cartRepository.create({ userId, productId, sizeId, quantity }),
      );
    } else {
      return await this.cartRepository.save({
        ...cartItem,
        quantity,
      });
    }
  }

  async deleteItem(userId: number, productId: number, sizeId: number) {
    return this.cartRepository.delete({ userId, productId, sizeId });
  }
}
