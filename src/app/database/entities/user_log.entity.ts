import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CommonBaseEntity } from './common_base.entity';
import { UserEntity } from './user.entity';
import { UserLogType } from 'src/app/vendors/common/enums';

@Entity('user_log')
export class UserLogEntity extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', name: 'log_type', enum: UserLogType })
  logType: UserLogType;

  @ManyToOne(() => UserEntity, (user) => user.userLogs)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
