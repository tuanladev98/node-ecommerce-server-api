import { EntityRepository, getConnection, Repository } from 'typeorm';

import { ProductEntity } from '../database/entities/product.entity';
import { ProductSizeEntity } from '../database/entities/product_size.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async createProduct(
    prodInstance: ProductEntity,
    listSize: { sizeId: number; quantity: number }[],
  ) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newProduct = await queryRunner.manager.save(prodInstance);

      await queryRunner.manager.save(
        listSize.map((ele) => {
          return queryRunner.manager.create(ProductSizeEntity, {
            productId: newProduct.id,
            sizeId: ele.sizeId,
            quantity: ele.quantity,
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
}
