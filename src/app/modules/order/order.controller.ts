import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as stripe from 'stripe';

import { UserRole } from 'src/app/vendors/common/enums';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  private stripePayment: stripe.Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly orderService: OrderService,
  ) {
    this.stripePayment = new stripe.Stripe(
      this.configService.get('STRIPE_KEY'),
      { apiVersion: '2020-08-27' },
    );
  }

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

  @Get('order-detail/:orderCode')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  getOrderDetail(@Req() req, @Param('orderCode') orderCode: string) {
    const userId: number = req.user.userId;
    return this.orderService.getOrderDetail(userId, orderCode);
  }

  // @Post('stripe-payment')
  // @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.CLIENT)
  // handleStripePayment(
  //   @Body('tokenId') tokenId: string,
  //   @Body('amount') amount: number,
  // ) {
  //   // stripe.
  //   return this.stripePayment.charges.create({
  //     source: tokenId,
  //     amount,
  //     currency: 'usd',
  //   });
  // }

  @Post('create-stripe-payment-intent')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  createStripePaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Body('paymentMethodType') paymentMethodType: string,
  ) {
    return this.stripePayment.paymentIntents.create({
      amount,
      currency,
      payment_method_types: [paymentMethodType],
    });
  }
}
