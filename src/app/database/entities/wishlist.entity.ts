import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { CommonBaseEntity } from './common_base.entity';
import { ProductEntity } from './product.entity';
import { UserEntity } from './user.entity';

@Entity('wishlist')
export class WishlistEntity extends CommonBaseEntity {
  @Column({
    type: 'tinyint',
    name: 'is_favorite',
    default: 0,
    comment: '0 is false, 1 is true',
  })
  isFavorite: number;

  @PrimaryColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @PrimaryColumn({ type: 'int', name: 'product_id' })
  productId: number;

  @ManyToOne(() => UserEntity, (user) => user.wishlists)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => ProductEntity, (product) => product.wishlists)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
