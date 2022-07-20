import { EntityRepository, Repository } from 'typeorm';

import { MessageEntity } from '../database/entities/message.entity';

@EntityRepository(MessageEntity)
export class MessageRepository extends Repository<MessageEntity> {}
