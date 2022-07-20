import { Injectable } from '@nestjs/common';

import { MessageRepository } from 'src/app/repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: MessageRepository,
  ) {}

  getAllConversations() {}
}
