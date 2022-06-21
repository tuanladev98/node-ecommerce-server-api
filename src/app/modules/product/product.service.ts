import { BadRequestException, Injectable } from '@nestjs/common';

import { ProductRepository } from 'src/app/repositories/product.repository';
import { SizeRepository } from 'src/app/repositories/size.repository';
import { Gender } from 'src/app/vendors/common/enums';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly sizeRepository: SizeRepository,
  ) {}

  createProduct(
    productName: string,
    description: string,
    price: number,
    gender: Gender,
    image01: string,
    image02: string,
    categoryId: number,
  ) {
    return this.productRepository.createProduct(
      this.productRepository.create({
        productName,
        description,
        price,
        gender,
        image01,
        image02,
        categoryId,
      }),
    );
  }

  async updateProduct(
    productId: number,
    productName: string,
    description: string,
    price: number,
    gender: Gender,
    image01: string,
    image02: string,
    categoryId: number,
  ) {
    const product = await this.productRepository.findOne(productId);
    if (!product) throw new BadRequestException('Product does not exist.');

    product.productName = productName ?? product.productName;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.gender = gender ?? product.gender;
    product.image01 = image01 ?? product.image01;
    product.image02 = image02 ?? product.image02;
    product.categoryId = categoryId ?? product.categoryId;

    return await this.productRepository.save(product);
  }

  async deleteProduct(productId: number) {
    const product = await this.productRepository.findOne(productId);
    if (!product || product.isDelete)
      throw new BadRequestException('Product does not exist.');

    return await this.productRepository.save({ ...product, isDelete: 1 });
  }

  async getOne(productId: number) {
    const product = await this.productRepository.findOne(productId);
    if (!product || product.isDelete)
      throw new BadRequestException('Product does not exist.');

    return product;
  }

  filter(categoryId: number, gender: string, sort: string) {
    const query = this.productRepository
      .createQueryBuilder('booth')
      .where('booth.is_delete = 0');
    if (categoryId)
      query.andWhere('booth.category_id = :categoryId', { categoryId });
    if (gender) query.andWhere('booth.gender = :gender', { gender });
    if (sort) {
      if (sort === 'NEWEST') query.orderBy('booth.created_at', 'DESC');
      if (sort === 'PRICE_ASC') query.orderBy('booth.price', 'ASC');
      if (sort === 'PRICE_DESC') query.orderBy('booth.price', 'DESC');
    }

    return query.getMany();
  }
}
