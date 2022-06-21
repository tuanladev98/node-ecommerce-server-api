import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SizeEntity } from './m_size.entity';
import { ProductEntity } from './product.entity';

@Entity('product_size')
export class ProductSizeEntity {
  @PrimaryColumn({ type: 'int', name: 'product_id' })
  productId: number;

  @PrimaryColumn({ type: 'int', name: 'size_id' })
  sizeId: number;

  @Column({ type: 'int', name: 'quantity' })
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.productToSizes)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => SizeEntity, (size) => size.sizeToProducts)
  @JoinColumn({ name: 'size_id' })
  size: SizeEntity;
}
