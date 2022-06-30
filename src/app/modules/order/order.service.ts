import { Injectable } from '@nestjs/common';

import { BillRepository } from 'src/app/repositories/bill.repository';
import { OrderRepository } from 'src/app/repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly billRepository: BillRepository,
  ) {}
}
