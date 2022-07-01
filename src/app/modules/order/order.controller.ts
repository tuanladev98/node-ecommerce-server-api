import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import { UserRole } from 'src/app/vendors/common/enums';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  createOrder(
    @Req() req,
    @Body('receiver') receiver: string,
    @Body('address') address: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('province') province: string,
    @Body('district') district: string,
    @Body('ward') ward: string,
    @Body('postcode') postcode: string,
  ) {
    const userId: number = req.user.userId;
    return this.orderService.createOrder(
      userId,
      receiver,
      address,
      phoneNumber,
      province,
      district,
      ward,
      postcode,
    );
  }
}
