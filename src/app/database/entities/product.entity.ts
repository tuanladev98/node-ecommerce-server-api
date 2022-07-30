import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonBaseEntity } from './common_base.entity';
import { Gender } from 'src/app/vendors/common/enums';
import { CategoryEntity } from './m_category.entity';
import { ProductSizeEntity } from './product_size.entity';
import { BillEntity } from './bill.entity';
import { CartEntity } from './cart.entity';
import { WishlistEntity } from './wishlist.entity';

@Entity('product')
export class ProductEntity extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'code', unique: true })
  code: string;

  @Column({ type: 'varchar', name: 'product_name' })
  productName: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description?: string;

  @Column({ type: 'int', name: 'price' })
  price: number;

  @Column({ type: 'enum', name: 'gender', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ type: 'varchar', name: 'image01' })
  image01: string;

  @Column({ type: 'varchar', name: 'image02' })
  image02: string;

  @Column({ type: 'tinyint', name: 'is_delete', default: 0 })
  isDelete: number;

  @Column({ type: 'int', name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @OneToMany(() => ProductSizeEntity, (productToSize) => productToSize.product)
  productToSizes: ProductSizeEntity[];

  @OneToMany(() => BillEntity, (bill) => bill.product)
  bills: BillEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.product)
  carts: CartEntity[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.product)
  wishlists: WishlistEntity[];
}
