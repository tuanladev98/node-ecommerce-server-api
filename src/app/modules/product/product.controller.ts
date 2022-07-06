import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Gender, UserRole } from 'src/app/vendors/common/enums';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  addProduct(
    @Body('productName') productName: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('gender') gender: Gender,
    @Body('image01') image01: string,
    @Body('image02') image02: string,
    @Body('categoryId') categoryId: number,
  ) {
    return this.productService.createProduct(
      productName,
      description,
      price,
      gender,
      image01,
      image02,
      categoryId,
    );
  }

  @Post('update/:productId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  updateProduct(
    @Param('productId') productId: number,
    @Body('productName') productName: string,
    @Body('description') description: string,
    @Body('price') price: number,
    @Body('gender') gender: Gender,
    @Body('image01') image01: string,
    @Body('image02') image02: string,
    @Body('categoryId') categoryId: number,
  ) {
    return this.productService.updateProduct(
      productId,
      productName,
      description,
      price,
      gender,
      image01,
      image02,
      categoryId,
    );
  }

  @Post('delete/:productId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  deleteProduct(@Param('productId') productId: number) {
    return this.productService.deleteProduct(productId);
  }

  @Get()
  @HttpCode(200)
  filter(
    @Query('categoryId') categoryId: number,
    @Query('gender') gender: string,
    @Query('sort') sort: string,
  ) {
    return this.productService.filter(categoryId, gender, sort);
  }

  @Get('popular')
  @HttpCode(200)
  getPopularProduct() {
    return this.productService.getPopularProduct();
  }

  @Get('find/:code')
  @HttpCode(200)
  getOne(@Param('code') code: string) {
    return this.productService.getOne(code);
  }
}
