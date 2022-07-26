import { EntityRepository, getConnection, Repository } from 'typeorm';

import { ProductEntity } from '../database/entities/product.entity';
import { ProductSizeEntity } from '../database/entities/product_size.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async createProduct(prodInstance: ProductEntity, sizeIds?: number[]) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newProduct = await queryRunner.manager.save(prodInstance);

      if (sizeIds && sizeIds.length > 0)
        await queryRunner.manager.save(
          sizeIds.map((sizeId) => {
            return queryRunner.manager.create(ProductSizeEntity, {
              productId: newProduct.id,
              sizeId,
              quantity: Math.floor(Math.random() * 20),
            });
          }),
        );

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return newProduct;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
  }

  async updateProduct(prodInstance: ProductEntity, sizeIds?: number[]) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await queryRunner.manager.save(prodInstance);

      if (sizeIds) {
        await queryRunner.manager.delete(ProductSizeEntity, {
          productId: product.id,
        });

        await queryRunner.manager.save(
          sizeIds.map((sizeId) => {
            return queryRunner.manager.create(ProductSizeEntity, {
              productId: product.id,
              sizeId,
              quantity: Math.floor(Math.random() * 20),
            });
          }),
        );
      }

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
  }
}
