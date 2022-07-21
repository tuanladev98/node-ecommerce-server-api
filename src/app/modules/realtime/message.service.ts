import { Injectable } from '@nestjs/common';

import { MessageRepository } from 'src/app/repositories/message.repository';
import { MessageEntity } from 'src/app/database/entities/message.entity';
import { UserRepository } from 'src/app/repositories/user.repository';
import {
  MessageSender,
  MessageType,
  UserRole,
} from 'src/app/vendors/common/enums';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  getAllConversations() {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .from(MessageEntity, 'm')
            .select([
              'm.*',
              'ROW_NUMBER() OVER (PARTITION BY m.user_id ORDER BY m.created_at DESC) AS rn',
            ])
            .where('m.sender = :sender', {
              sender: MessageSender.CLIENT,
            });
        },
        'latest_message',
        'latest_message.user_id = user.id AND latest_message.rn = 1',
      )
      .select([
        'user.id AS id',
        'user.name AS name',
        'user.user_color AS userColor',
        'latest_message.text AS latestMessage',
        'latest_message.created_at AS latestMessageDate',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(m1.id)')
          .from(MessageEntity, 'm1')
          .where('m1.user_id = user.id')
          .andWhere('m1.message_type = :messageType', {
            messageType: MessageType.TEXT,
          })
          .andWhere('m1.sender = :sender', {
            sender: MessageSender.CLIENT,
          })
          .andWhere('m1.seen = FALSE');
      }, 'totalUnseenMessage')
      .where('user.role = :role', { role: UserRole.CLIENT })
      .orderBy('latest_message.created_at', 'DESC')
      .getRawMany();
  }

  async getMessages(userId: number, beforeId?: number) {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .where('message.user_id = :userId', { userId })
      .orderBy('message.created_at', 'DESC');

    // if (beforeId) query.andWhere(`message.id < ${beforeId}`);

    const messages = await query.getMany();
    return messages.reverse();
  }
}
