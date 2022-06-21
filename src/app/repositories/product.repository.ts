import { EntityRepository, getConnection, Repository } from 'typeorm';

import { ProductEntity } from '../database/entities/product.entity';
import { SizeEntity } from '../database/entities/m_size.entity';
import { ProductSizeEntity } from '../database/entities/product_size.entity';

@EntityRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async createProduct(prodInstance: ProductEntity) {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newProduct = await queryRunner.manager.save(prodInstance);

      const sizes = await queryRunner.manager
        .createQueryBuilder(SizeEntity, 'size')
        .orderBy('RAND()')
        .take(10)
        .getMany();

      await queryRunner.manager.save(
        sizes.map((size) => {
          return queryRunner.manager.create(ProductSizeEntity, {
            productId: newProduct.id,
            sizeId: size.id,
            quantity: 10,
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
