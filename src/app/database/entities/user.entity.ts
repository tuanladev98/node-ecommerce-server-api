import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonBaseEntity } from './common_base.entity';
import { Gender, UserRole } from 'src/app/vendors/common/enums';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { MessageEntity } from './message.entity';
import { UserLogEntity } from './user_log.entity';
import { WishlistEntity } from './wishlist.entity';

@Entity('user')
export class UserEntity extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password', select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'user_color' })
  userColor: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @OneToMany(() => CartEntity, (cart) => cart.user)
  carts: CartEntity[];

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @OneToMany(() => UserLogEntity, (userLog) => userLog.user)
  userLogs: UserLogEntity[];

  @OneToMany(() => WishlistEntity, (wishlist) => wishlist.user)
  wishlists: WishlistEntity[];
}
