import { EntityRepository, Repository } from 'typeorm';

import { OrderEntity } from '../database/entities/order.entity';

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {}
