import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CommonBaseEntity } from './common_base.entity';
import { ProductEntity } from './product.entity';

@Entity('review')
export class ReviewEntity extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'product_id' })
  productId: number;

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({
    type: 'enum',
    name: 'rating_point',
    enum: [1, 2, 3, 4, 5],
    default: 5,
  })
  ratingPoint: number;

  @Column({ type: 'text', name: 'comment' })
  comment: string;

  @ManyToOne(() => ProductEntity, (product) => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
