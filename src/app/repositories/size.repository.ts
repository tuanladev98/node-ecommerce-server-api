import { EntityRepository, Repository } from 'typeorm';

import { SizeEntity } from '../database/entities/m_size.entity';

@EntityRepository(SizeEntity)
export class SizeRepository extends Repository<SizeEntity> {}
