import { Controller, Get } from '@nestjs/common';

import { CategoryEntity } from 'src/app/database/entities/m_category.entity';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategory(): Promise<CategoryEntity[]> {
    return this.categoryService.getAllCategory();
  }
}
