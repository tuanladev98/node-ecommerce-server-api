import { Injectable } from '@nestjs/common';
import { MessageEntity } from 'src/app/database/entities/message.entity';

import { MessageRepository } from 'src/app/repositories/message.repository';
import { UserRole } from 'src/app/vendors/common/enums';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: MessageRepository,
  ) {}

  getAllConversations() {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin(MessageEntity, 'message', 'message.user_id = user.id')
      .where('user.role = :role', { role: UserRole.CLIENT })
      .getRawMany();
  }

  getMessages() {
    return this.messageRepository.find();
  }
}
