import { EntityRepository, Repository } from 'typeorm';

import { BillEntity } from '../database/entities/bill.entity';

@EntityRepository(BillEntity)
export class BillRepository extends Repository<BillEntity> {}
