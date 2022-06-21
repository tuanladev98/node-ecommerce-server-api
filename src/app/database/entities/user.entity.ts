import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonBaseEntity } from './common_base.entity';
import { Gender, UserRole } from 'src/app/vendors/common/enums';
import { CartEntity } from './cart.entity';

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

  // @Column({ type: 'varchar', name: 'address', nullable: true })
  // address: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @OneToMany(() => CartEntity, (cart) => cart.user)
  carts: CartEntity[];
}
