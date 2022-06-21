import { EntityRepository, Repository } from 'typeorm';

import { CategoryEntity } from '../database/entities/m_category.entity';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {}
