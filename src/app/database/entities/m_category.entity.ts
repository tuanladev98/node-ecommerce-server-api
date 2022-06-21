import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { BrandEntity } from './m_brand.entity';
import { ProductEntity } from './product.entity';

@Entity('m_category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'category_name' })
  categoryName: string;

  // @Column({ type: 'int', name: 'brand_id' })
  // brandId: number;

  // @ManyToOne(() => BrandEntity, (brand) => brand.categories)
  // @JoinColumn({ name: 'brand_id' })
  // brand: BrandEntity;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];
}
