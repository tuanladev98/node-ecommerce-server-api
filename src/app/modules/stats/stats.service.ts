import { Injectable } from '@nestjs/common';
import { OrderEntity } from 'src/app/database/entities/order.entity';

import { BillRepository } from 'src/app/repositories/bill.repository';
import { OrderRepository } from 'src/app/repositories/order.repository';

@Injectable()
export class StatsService {
  constructor(
    private readonly billRepository: BillRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async statsSummaryIncome() {
    const current = new Date();
    const currentYear = current.getUTCFullYear();
    const currentMonth = current.getUTCMonth() + 1;

    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    return {
      incomeLastMonth: Number(
        (
          await this.orderRepository
            .createQueryBuilder()
            .select('SUM(amount) AS income')
            .where('YEAR(created_at) = :lastYear', { lastYear })
            .andWhere('MONTH(created_at) = :lastMonth', { lastMonth })
            .getRawOne()
        ).income,
      ),
      incomeCurrentMonth: Number(
        (
          await this.orderRepository
            .createQueryBuilder()
            .select('SUM(amount) AS income')
            .where('YEAR(created_at) = :currentYear', { currentYear })
            .andWhere('MONTH(created_at) = :currentMonth', { currentMonth })
            .getRawOne()
        ).income,
      ),
    };
  }

  async statsSummaryTransaction() {
    const current = new Date();
    const currentYear = current.getUTCFullYear();
    const currentMonth = current.getUTCMonth() + 1;

    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    return {
      transactionsLastMonth: await this.orderRepository
        .createQueryBuilder()
        .where('YEAR(created_at) = :lastYear', { lastYear })
        .andWhere('MONTH(created_at) = :lastMonth', { lastMonth })
        .getCount(),
      transactionsCurrentMonth: await this.orderRepository
        .createQueryBuilder()
        .where('YEAR(created_at) = :currentYear', { currentYear })
        .andWhere('MONTH(created_at) = :currentMonth', { currentMonth })
        .getCount(),
    };
  }

  async statsSummaryQuantity() {
    const current = new Date();
    const currentYear = current.getUTCFullYear();
    const currentMonth = current.getUTCMonth() + 1;

    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    return {
      quantityLastMonth: Number(
        (
          await this.billRepository
            .createQueryBuilder('bill')
            .leftJoin(OrderEntity, 'order', 'order.id = bill.order_id')
            .where('YEAR(order.created_at) = :lastYear', { lastYear })
            .andWhere('MONTH(order.created_at) = :lastMonth', { lastMonth })
            .select('SUM(quantity) AS quantity')
            .getRawOne()
        ).quantity,
      ),
      quantityCurrentMonth: Number(
        (
          await this.billRepository
            .createQueryBuilder('bill')
            .leftJoin(OrderEntity, 'order', 'order.id = bill.order_id')
            .where('YEAR(order.created_at) = :currentYear', { currentYear })
            .andWhere('MONTH(order.created_at) = :currentMonth', {
              currentMonth,
            })
            .select('SUM(quantity) AS quantity')
            .getRawOne()
        ).quantity,
      ),
    };
  }
}
