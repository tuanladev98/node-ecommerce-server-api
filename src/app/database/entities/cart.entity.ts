import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SizeEntity } from './m_size.entity';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'user_id', unique: true })
  userId: number;

  @Column({ type: 'int', name: 'product_id', unique: true })
  productId: number;

  @Column({ type: 'int', name: 'size_id', unique: true })
  sizeId: number;

  @Column({ type: 'int', name: 'quantity' })
  quantity: number;

  @ManyToOne(() => UserEntity, (product) => product.carts)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.carts)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => SizeEntity, (size) => size.carts)
  @JoinColumn({ name: 'size_id' })
  size: SizeEntity;
}
