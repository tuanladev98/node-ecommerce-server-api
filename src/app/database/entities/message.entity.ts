import { MessageSender, MessageType } from 'src/app/vendors/common/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CommonBaseEntity } from './common_base.entity';
import { UserEntity } from './user.entity';

@Entity('message')
export class MessageEntity extends CommonBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', name: 'sender', enum: MessageSender })
  sender: MessageSender;

  @Column({
    type: 'enum',
    name: 'message_type',
    enum: MessageType,
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Column({ type: 'text', name: 'text', nullable: true })
  text?: string;

  @Column({
    type: 'tinyint',
    name: 'seen',
    default: 0,
    comment: '0 is false, 1 is true',
  })
  seen: number;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
