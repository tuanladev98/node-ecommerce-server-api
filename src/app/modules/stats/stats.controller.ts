import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { StatsService } from './stats.service';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { UserRole } from 'src/app/vendors/common/enums';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  async statsSummary() {
    return {
      transactionSummary: await this.statsService.statsSummaryTransaction(),
      loginQuantitySummary: await this.statsService.statsSummaryLoginQuantity(),
      incomeSummary: await this.statsService.statsSummaryIncome(),
    };
  }

  @Get('customer-analytics')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  chartCustomerAnalytics() {
    return this.statsService.statsCustomerAnalyticsByRecentMonth();
  }

  @Get('list-newest-customer')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  statsListNewestCustomer() {
    return this.statsService.getNewestCustomers();
  }

  @Get('list-newest-transaction')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  statsListNewestTransaction() {
    return this.statsService.getNewestTransactions();
  }

  @Get('product-sales-performance/:productId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  statsProductSalesPerformance(@Param('productId') productId: number) {
    return this.statsService.statsProductSalesPerformance(productId);
  }

  @Get('total-by-units')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  statsTotalByUnits() {
    return this.statsService.statsTotalByUnits();
  }

  @Get('sales-performance-by-cat')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  statsSalePerformanceByCategory() {
    return this.statsService.statsSalePerformanceByCategory();
  }

  @Get('transactions-latest-six-month')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  statsTransactionsLatestSixMonth() {
    return this.statsService.statsTransactionsLatestSixMonth();
  }

  @Get('income-latest-six-month')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  statsIncomeLatestSixMonth() {
    return this.statsService.statsIncomeLatestSixMonth();
  }
}
