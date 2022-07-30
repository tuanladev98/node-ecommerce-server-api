import { EntityRepository, Repository } from 'typeorm';

import { WishlistEntity } from '../database/entities/wishlist.entity';

@EntityRepository(WishlistEntity)
export class WishlistRepository extends Repository<WishlistEntity> {}
