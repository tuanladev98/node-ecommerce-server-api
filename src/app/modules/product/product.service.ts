import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductSizeEntity } from 'src/app/database/entities/product_size.entity';
import { WishlistEntity } from 'src/app/database/entities/wishlist.entity';

import { ProductRepository } from 'src/app/repositories/product.repository';
import { SizeRepository } from 'src/app/repositories/size.repository';
import { WishlistRepository } from 'src/app/repositories/wishlist.repository';
import { Gender } from 'src/app/vendors/common/enums';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly wishlistRepository: WishlistRepository,
    private readonly sizeRepository: SizeRepository,
  ) {}

  private makeProductCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let char = '';
    for (let i = 0; i < 2; i++) {
      char += characters.charAt(Math.floor(Math.random() * 2));
    }
    let num = '';
    for (let i = 0; i < 4; i++) {
      num += '0123456789'.charAt(Math.floor(Math.random() * 4));
    }
    return char + num;
  }

  createProduct(
    categoryId: number,
    productName: string,
    price: number,
    gender: Gender,
    description: string,
    image01: string,
    image02: string,
    sizeIds?: number[],
  ) {
    return this.productRepository.createProduct(
      this.productRepository.create({
        code: this.makeProductCode(),
        productName,
        description,
        price,
        gender,
        image01,
        image02,
        categoryId,
      }),
      sizeIds,
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
    sizeIds?: number[],
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

    return await this.productRepository.updateProduct(product, sizeIds);
  }

  async toggleFavoriteStatus(userId: number, productId: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (!wishlist) {
      await this.wishlistRepository.save(
        this.wishlistRepository.create({ userId, productId, isFavorite: 1 }),
      );
      return { isFavorite: true };
    }

    wishlist.isFavorite = wishlist.isFavorite === 0 ? 1 : 0;
    await this.wishlistRepository.save(wishlist);

    return {
      isFavorite: !!wishlist.isFavorite,
    };
  }

  async deleteProduct(productId: number) {
    const product = await this.productRepository.findOne(productId);
    if (!product || product.isDelete)
      throw new BadRequestException('Product does not exist.');

    return await this.productRepository.save({ ...product, isDelete: 1 });
  }

  async getOne(code: string) {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.code = :code', { code })
      .getOne();
    if (!product || product.isDelete)
      throw new BadRequestException('Product does not exist.');

    const availableSizes = await this.sizeRepository
      .createQueryBuilder('size')
      .leftJoin(
        ProductSizeEntity,
        'product_size',
        'product_size.size_id = size.id',
      )
      .where('product_size.product_id = :productId', { productId: product.id })
      .orderBy('size.id', 'ASC')
      .getMany();

    return { ...product, availableSizes };
  }

  filter(
    keyword: string,
    categoryId: number,
    gender: string,
    sort: string,
    userId?: number,
  ) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id AS id',
        'product.code AS code',
        'product.product_name AS productName',
        'product.description AS description',
        'product.price AS price',
        'product.gender AS gender',
        'product.image01 AS image01',
        'product.image01 AS image01',
        'category.category_name AS categoryName',
        'wishlist.is_favorite AS isFavorite',
      ])
      .leftJoin('product.category', 'category')
      .leftJoin(
        WishlistEntity,
        'wishlist',
        'wishlist.product_id = product.id AND wishlist.user_id = :userId',
        { userId },
      )
      .where('product.is_delete = 0');
    if (keyword) query.andWhere(`product.product_name LIKE '%${keyword}%'`);
    if (categoryId)
      query.andWhere('product.category_id = :categoryId', { categoryId });
    if (gender && gender !== 'ALL')
      query.andWhere('product.gender = :gender', { gender });
    if (sort) {
      if (sort === 'NEWEST') query.orderBy('product.created_at', 'DESC');
      if (sort === 'PRICE_ASC') query.orderBy('product.price', 'ASC');
      if (sort === 'PRICE_DESC') query.orderBy('product.price', 'DESC');
    }

    return query.getRawMany();
  }

  getPopularProduct(userId?: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id AS id',
        'product.code AS code',
        'product.product_name AS productName',
        'product.description AS description',
        'product.price AS price',
        'product.gender AS gender',
        'product.image01 AS image01',
        'product.image01 AS image01',
        'category.category_name AS categoryName',
        'wishlist.is_favorite AS isFavorite',
      ])
      .leftJoin('product.category', 'category')
      .leftJoin(
        WishlistEntity,
        'wishlist',
        'wishlist.product_id = product.id AND wishlist.user_id = :userId',
        { userId },
      )
      .where('product.is_delete = 0')
      .orderBy('RAND()')
      .limit(6)
      .getRawMany();
  }

  getAllForAdminSite() {
    return this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.id AS id',
        'product.code AS code',
        'product.product_name AS productName',
        'product.description AS description',
        'product.price AS price',
        'product.gender AS gender',
        'product.image01 AS image01',
        'product.image02 AS image02',
        'SUM(product_size.quantity) AS quantity',
      ])
      .leftJoin(
        ProductSizeEntity,
        'product_size',
        'product_size.product_id = product.id',
      )
      .where('product.is_delete = 0')
      .groupBy('product.id')
      .getRawMany();
  }

  getDetailForAdminSite(productId: number) {
    return (
      this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.productToSizes', 'prod_size')
        // .leftJoinAndSelect('prod_size.size', 'size')
        .where('product.id = :productId', { productId })
        .getOne()
    );
  }
}
