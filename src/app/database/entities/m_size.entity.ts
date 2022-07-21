import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BillEntity } from './bill.entity';
import { CartEntity } from './cart.entity';
import { ProductSizeEntity } from './product_size.entity';

@Entity('m_size')
export class SizeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'length' })
  length: string;

  @Column({ type: 'varchar', name: 'eu_size', nullable: true })
  euSize?: string;

  @Column({ type: 'varchar', name: 'uk_size', nullable: true })
  ukSize?: string;

  @Column({ type: 'varchar', name: 'us_men_size', nullable: true })
  usMenSize?: string;

  @Column({ type: 'varchar', name: 'us_women_size', nullable: true })
  usWomenSize?: string;

  @OneToMany(() => ProductSizeEntity, (sizeToProduct) => sizeToProduct.size)
  sizeToProducts: ProductSizeEntity[];

  @OneToMany(() => BillEntity, (bill) => bill.size)
  bills: BillEntity[];

  @OneToMany(() => CartEntity, (cart) => cart.size)
  carts: CartEntity[];
}
