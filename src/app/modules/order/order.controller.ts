import { Controller, Post, Req, UseGuards } from '@nestjs/common';

import { UserRole } from 'src/app/vendors/common/enums';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  createOrder(@Req() req) {
    const userId: number = req.user.userId;
  }
}
