import { EntityRepository, Repository } from 'typeorm';

import { ReviewEntity } from '../database/entities/review.entity';

@EntityRepository(ReviewEntity)
export class ReviewRepository extends Repository<ReviewEntity> {}
