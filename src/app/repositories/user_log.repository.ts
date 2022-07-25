import { EntityRepository, Repository } from 'typeorm';

import { UserLogEntity } from '../database/entities/user_log.entity';

@EntityRepository(UserLogEntity)
export class UserLogRepository extends Repository<UserLogEntity> {}
