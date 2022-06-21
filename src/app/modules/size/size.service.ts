import { Injectable } from '@nestjs/common';

import { SizeEntity } from 'src/app/database/entities/m_size.entity';
import { SizeRepository } from 'src/app/repositories/size.repository';

@Injectable()
export class SizeService {
  constructor(private readonly sizeRepository: SizeRepository) {}

  getAllSize(): Promise<SizeEntity[]> {
    return this.sizeRepository.find();
  }
}
