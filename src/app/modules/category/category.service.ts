import { Injectable } from '@nestjs/common';

import { CategoryEntity } from 'src/app/database/entities/m_category.entity';
import { CategoryRepository } from 'src/app/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  getAllCategory(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }
}
