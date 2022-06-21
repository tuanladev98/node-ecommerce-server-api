import { Controller, Get } from '@nestjs/common';

import { SizeEntity } from 'src/app/database/entities/m_size.entity';
import { SizeService } from './size.service';

@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Get()
  getAllSize(): Promise<SizeEntity[]> {
    return this.sizeService.getAllSize();
  }
}
