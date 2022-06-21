import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SizeEntity } from './m_size.entity';
import { ProductEntity } from './product.entity';

@Entity('bill')
export class BillEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'order_id' })
  orderId: number;

  @Column({ type: 'int', name: 'product_id' })
  productId: number;

  @Column({ type: 'int', name: 'size_id' })
  sizeId: number;

  @Column({ type: 'int', name: 'quantity' })
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.bills)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => SizeEntity, (size) => size.bills)
  @JoinColumn({ name: 'size_id' })
  size: SizeEntity;
}
