import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { OrderStatus } from 'src/app/vendors/common/enums';
import { CommonBaseEntity } from './common_base.entity';

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

  @Column({ type: 'varchar', name: 'province' })
  province: string;

  @Column({ type: 'varchar', name: 'district' })
  district: string;

  @Column({ type: 'varchar', name: 'ward' })
  ward: string;

  @Column({
    type: 'enum',
    name: 'status',
    enum: OrderStatus,
    default: OrderStatus.WAITING_CONFIRM,
  })
  status: OrderStatus;
}
