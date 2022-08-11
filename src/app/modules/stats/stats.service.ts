import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { BillRepository } from 'src/app/repositories/bill.repository';
import { OrderRepository } from 'src/app/repositories/order.repository';
import { UserRepository } from 'src/app/repositories/user.repository';
import { UserLogType, UserRole } from 'src/app/vendors/common/enums';
import { UserLogRepository } from 'src/app/repositories/user_log.repository';
import { BillEntity } from 'src/app/database/entities/bill.entity';
import { ProductRepository } from 'src/app/repositories/product.repository';
import { ReviewRepository } from 'src/app/repositories/review.repository';
import { CategoryRepository } from 'src/app/repositories/category.repository';
import { ProductEntity } from 'src/app/database/entities/product.entity';

@Injectable()
export class StatsService {
  constructor(
    private readonly dbConnection: Connection,
    private readonly billRepository: BillRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly userLogRepository: UserLogRepository,
  ) {}

  async statsSummaryIncome() {
    const current = new Date();
    const currentYear = current.getUTCFullYear();
    const currentMonth = current.getUTCMonth() + 1;

    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    return {
      lastMonth: Number(
        (
          await this.orderRepository
            .createQueryBuilder()
            .select('SUM(amount) AS income')
            .where('stripe_succeeded_payment_intent_id IS NOT NULL')
            .andWhere('YEAR(created_at) = :lastYear', { lastYear })
            .andWhere('MONTH(created_at) = :lastMonth', { lastMonth })
            .getRawOne()
        ).income,
      ),
      currentMonth: Number(
        (
          await this.orderRepository
            .createQueryBuilder()
            .select('SUM(amount) AS income')
            .where('stripe_succeeded_payment_intent_id IS NOT NULL')
            .andWhere('YEAR(created_at) = :currentYear', { currentYear })
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
      lastMonth: await this.orderRepository
        .createQueryBuilder()
        .where('YEAR(created_at) = :lastYear', { lastYear })
        .andWhere('MONTH(created_at) = :lastMonth', { lastMonth })
        .getCount(),
      currentMonth: await this.orderRepository
        .createQueryBuilder()
        .where('YEAR(created_at) = :currentYear', { currentYear })
        .andWhere('MONTH(created_at) = :currentMonth', { currentMonth })
        .getCount(),
    };
  }

  async statsSummaryLoginQuantity() {
    const current = new Date();
    const currentYear = current.getUTCFullYear();
    const currentMonth = current.getUTCMonth() + 1;

    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;

    return {
      lastMonth: await this.userLogRepository
        .createQueryBuilder('user_log')
        .where('user_log.log_type = :logType', { logType: UserLogType.LOGIN })
        .andWhere('YEAR(user_log.created_at) = :lastYear', { lastYear })
        .andWhere('MONTH(user_log.created_at) = :lastMonth', { lastMonth })
        .getCount(),
      currentMonth: await this.userLogRepository
        .createQueryBuilder('user_log')
        .where('user_log.log_type = :logType', { logType: UserLogType.LOGIN })
        .andWhere('YEAR(user_log.created_at) = :currentYear', { currentYear })
        .andWhere('MONTH(user_log.created_at) = :currentMonth', {
          currentMonth,
        })
        .getCount(),
    };
  }

  getNewestCustomers() {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.CLIENT })
      .orderBy('user.created_at', 'DESC')
      .limit(5)
      .getMany();
  }

  getNewestTransactions() {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .orderBy('order.created_at', 'DESC')
      .limit(5)
      .getMany();
  }

  async statsCustomerAnalyticsByRecentMonth() {
    const fromDate: Date = (
      await this.dbConnection.query(
        'SELECT DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 12 MONTH)), INTERVAL 1 DAY) AS fromDate',
      )
    )[0].fromDate;

    const [yyyy, mm] = fromDate.toISOString().split('T')[0].split('-');

    const data = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'YEAR(user.created_at) AS createdYear',
        'MONTH(user.created_at) AS createdMonth',
        'COUNT(user.id) AS quantity',
      ])
      .where('user.created_at > :fromDate', {
        fromDate: fromDate.toISOString(),
      })
      .andWhere('user.role = :role', { role: UserRole.CLIENT })
      .groupBy('createdYear')
      .addGroupBy('createdMonth')
      .orderBy('createdYear', 'ASC')
      .addOrderBy('createdMonth', 'ASC')
      .getRawMany();

    const listMonth: { year: number; month: number; quantity: number }[] = [
      {
        year: Number(yyyy),
        month: Number(mm),
        quantity: Number(
          data.find(
            (ele) =>
              ele.createdYear === Number(yyyy) &&
              ele.createdMonth === Number(mm),
          )?.quantity,
        ),
      },
    ];

    let i = 1;
    while (i < 12) {
      const curLastItem = listMonth[listMonth.length - 1];
      if (curLastItem.month === 12) {
        listMonth.push({
          year: curLastItem.year + 1,
          month: 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year + 1 &&
                ele.createdMonth === 1,
            )?.quantity,
          ),
        });
      } else {
        listMonth.push({
          year: curLastItem.year,
          month: curLastItem.month + 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year &&
                ele.createdMonth === curLastItem.month + 1,
            )?.quantity,
          ),
        });
      }
      i++;
    }

    return listMonth;
  }

  async statsProductSalesPerformance(productId: number) {
    const fromDate: Date = (
      await this.dbConnection.query(
        'SELECT DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 3 MONTH)), INTERVAL 1 DAY) AS fromDate',
      )
    )[0].fromDate;

    const [yyyy, mm] = fromDate.toISOString().split('T')[0].split('-');

    const data = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin(BillEntity, 'bill', 'bill.order_id = order.id')
      .select([
        'YEAR(order.created_at) AS createdYear',
        'MONTH(order.created_at) AS createdMonth',
        'SUM(bill.quantity) AS quantity',
      ])
      .where('order.created_at > :fromDate', {
        fromDate: fromDate.toISOString(),
      })
      .andWhere('order.stripe_succeeded_payment_intent_id IS NOT NULL')
      .andWhere('bill.product_id = :productId', { productId })
      .groupBy('createdYear')
      .addGroupBy('createdMonth')
      .orderBy('createdYear', 'ASC')
      .addOrderBy('createdMonth', 'ASC')
      .getRawMany();

    const listMonth: { year: number; month: number; quantity: number }[] = [
      {
        year: Number(yyyy),
        month: Number(mm),
        quantity: Number(
          data.find(
            (ele) =>
              ele.createdYear === Number(yyyy) &&
              ele.createdMonth === Number(mm),
          )?.quantity,
        ),
      },
    ];

    let i = 1;
    while (i < 3) {
      const curLastItem = listMonth[listMonth.length - 1];
      if (curLastItem.month === 12) {
        listMonth.push({
          year: curLastItem.year + 1,
          month: 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year + 1 &&
                ele.createdMonth === 1,
            )?.quantity,
          ),
        });
      } else {
        listMonth.push({
          year: curLastItem.year,
          month: curLastItem.month + 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year &&
                ele.createdMonth === curLastItem.month + 1,
            )?.quantity,
          ),
        });
      }
      i++;
    }

    return listMonth;
  }

  async statsTotalByUnits() {
    const customers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.CLIENT })
      .getCount();

    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.is_delete = FALSE')
      .getCount();

    const transactions = await this.orderRepository
      .createQueryBuilder('order')
      .getCount();

    const reviews = await this.reviewRepository
      .createQueryBuilder('review')
      .getCount();

    return [
      {
        name: 'Customers',
        quantity: customers,
      },
      {
        name: 'Products',
        quantity: products,
      },
      {
        name: 'Transactions',
        quantity: transactions,
      },
      {
        name: 'Reviews',
        quantity: reviews,
      },
    ];
  }

  statsSalePerformanceByCategory() {
    return this.categoryRepository
      .createQueryBuilder('cat')
      .select([
        'cat.id AS id',
        'cat.category_name AS name',
        'SUM(bill.quantity) AS sales',
      ])
      .leftJoin(ProductEntity, 'prod', 'prod.category_id = cat.id')
      .leftJoin(BillEntity, 'bill', 'bill.product_id = prod.id')
      .groupBy('cat.id')
      .getRawMany();
  }

  async statsTransactionsLatestSixMonth() {
    const fromDate: Date = (
      await this.dbConnection.query(
        'SELECT DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 6 MONTH)), INTERVAL 1 DAY) AS fromDate',
      )
    )[0].fromDate;

    const [yyyy, mm] = fromDate.toISOString().split('T')[0].split('-');

    const data = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'YEAR(order.created_at) AS createdYear',
        'MONTH(order.created_at) AS createdMonth',
        'COUNT(order.id) AS quantity',
      ])
      .where('order.created_at > :fromDate', {
        fromDate: fromDate.toISOString(),
      })
      .groupBy('createdYear')
      .addGroupBy('createdMonth')
      .orderBy('createdYear', 'ASC')
      .addOrderBy('createdMonth', 'ASC')
      .getRawMany();

    const listMonth: { year: number; month: number; quantity: number }[] = [
      {
        year: Number(yyyy),
        month: Number(mm),
        quantity: Number(
          data.find(
            (ele) =>
              ele.createdYear === Number(yyyy) &&
              ele.createdMonth === Number(mm),
          )?.quantity,
        ),
      },
    ];

    let i = 1;
    while (i < 6) {
      const curLastItem = listMonth[listMonth.length - 1];
      if (curLastItem.month === 12) {
        listMonth.push({
          year: curLastItem.year + 1,
          month: 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year + 1 &&
                ele.createdMonth === 1,
            )?.quantity,
          ),
        });
      } else {
        listMonth.push({
          year: curLastItem.year,
          month: curLastItem.month + 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year &&
                ele.createdMonth === curLastItem.month + 1,
            )?.quantity,
          ),
        });
      }
      i++;
    }

    return listMonth;
  }

  async statsIncomeLatestSixMonth() {
    const fromDate: Date = (
      await this.dbConnection.query(
        'SELECT DATE_ADD(LAST_DAY(DATE_SUB(CURDATE(), INTERVAL 6 MONTH)), INTERVAL 1 DAY) AS fromDate',
      )
    )[0].fromDate;

    const [yyyy, mm] = fromDate.toISOString().split('T')[0].split('-');

    const data = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        'YEAR(order.created_at) AS createdYear',
        'MONTH(order.created_at) AS createdMonth',
        'SUM(order.amount) AS quantity',
      ])
      .where('order.created_at > :fromDate', {
        fromDate: fromDate.toISOString(),
      })
      .andWhere('order.stripe_succeeded_payment_intent_id IS NOT NULL')
      .groupBy('createdYear')
      .addGroupBy('createdMonth')
      .orderBy('createdYear', 'ASC')
      .addOrderBy('createdMonth', 'ASC')
      .getRawMany();

    const listMonth: { year: number; month: number; quantity: number }[] = [
      {
        year: Number(yyyy),
        month: Number(mm),
        quantity: Number(
          data.find(
            (ele) =>
              ele.createdYear === Number(yyyy) &&
              ele.createdMonth === Number(mm),
          )?.quantity,
        ),
      },
    ];

    let i = 1;
    while (i < 6) {
      const curLastItem = listMonth[listMonth.length - 1];
      if (curLastItem.month === 12) {
        listMonth.push({
          year: curLastItem.year + 1,
          month: 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year + 1 &&
                ele.createdMonth === 1,
            )?.quantity,
          ),
        });
      } else {
        listMonth.push({
          year: curLastItem.year,
          month: curLastItem.month + 1,
          quantity: Number(
            data.find(
              (ele) =>
                ele.createdYear === curLastItem.year &&
                ele.createdMonth === curLastItem.month + 1,
            )?.quantity,
          ),
        });
      }
      i++;
    }

    return listMonth;
  }
}
