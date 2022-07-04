import { Controller, Get, UseGuards } from '@nestjs/common';

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
      quantitySummary: await this.statsService.statsSummaryQuantity(),
      incomeSummary: await this.statsService.statsSummaryIncome(),
    };
  }
}
