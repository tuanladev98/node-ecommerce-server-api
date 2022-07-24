import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from 'src/app/vendors/common/enums';
import { CommonBaseEntity } from './common_base.entity';
import { UserEntity } from './user.entity';
import { BillEntity } from './bill.entity';

@Entity('order')
export class OrderEntity extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'order_code', unique: true })
  orderCode: string;

  @Column({ type: 'int', name: 'amount' })
  amount: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', name: 'receiver' })
  receiver: string;

  @Column({ type: 'varchar', name: 'address' })
  address: string;

  @Column({ type: 'varchar', name: 'phone_number' })
  phoneNumber: string;

  @Column({ type: 'varchar', name: 'province' })
  province: string;

  // @Column({ type: 'int', name: 'ghn_province_id' })
  // ghnProvinceId: number;

  @Column({ type: 'varchar', name: 'district' })
  district: string;

  // @Column({ type: 'int', name: 'ghn_district_id' })
  // ghnDistrictId: string;

  @Column({ type: 'varchar', name: 'ward' })
  ward: string;

  // @Column({ type: 'int', name: 'ghn_ward_id' })
  // ghnWardId: string;

  @Column({ type: 'varchar', name: 'postcode' })
  postcode: string;

  @Column({ type: 'text', name: 'note', nullable: true })
  note?: string;

  @Column({
    type: 'varchar',
    name: 'stripe_succeeded_payment_intent_id',
    nullable: true,
  })
  stripeSucceededPaymentIntentId?: string;

  @Column({
    type: 'varchar',
    name: 'ghn_shipping_code',
    nullable: true,
  })
  ghnShippingCode?: string;

  @Column({
    type: 'enum',
    name: 'status',
    enum: OrderStatus,
    default: OrderStatus.WAITING_CONFIRM,
  })
  status: OrderStatus;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => BillEntity, (bill) => bill.order)
  bills: BillEntity[];
}
