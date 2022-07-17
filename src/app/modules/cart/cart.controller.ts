import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UserRole } from 'src/app/vendors/common/enums';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  addItem(
    @Req() req,
    @Body('productId') productId: number,
    @Body('sizeId') sizeId: number,
    @Body('quantity') quantity: number,
  ) {
    const userId: number = req.user.userId;
    return this.cartService.addItem(userId, productId, sizeId, quantity);
  }

  @Get('get-cart')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  getCart(@Req() req) {
    const userId: number = req.user.userId;
    return this.cartService.getCart(userId);
  }

  @Get('get-cart-detail')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  getCartDetail(@Req() req) {
    const userId: number = req.user.userId;
    return this.cartService.getCartDetail(userId);
  }

  @Put('update-item')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  updateItem(
    @Req() req,
    @Body('productId') productId: number,
    @Body('sizeId') sizeId: number,
    @Body('quantity') quantity: number,
  ) {
    const userId: number = req.user.userId;
    return this.cartService.updateItem(userId, productId, sizeId, quantity);
  }

  @Delete('delete-item')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.CLIENT)
  deleteItem(
    @Req() req,
    @Body('productId') productId: number,
    @Body('sizeId') sizeId: number,
  ) {
    const userId: number = req.user.userId;
    return this.cartService.deleteItem(userId, productId, sizeId);
  }
}
