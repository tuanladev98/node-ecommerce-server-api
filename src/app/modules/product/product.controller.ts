import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

import { Gender, UserRole } from 'src/app/vendors/common/enums';
import { Roles } from 'src/app/vendors/decorators/role.decorator';
import { JwtAuthGuard } from 'src/app/vendors/guards/jwt_auth.guard';
import { FirebaseStorageService } from './firebase_storage.service';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}

  @Post('upload-prd-img')
  // @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', { storage: multer.memoryStorage() }),
  )
  uploadProductImage(@UploadedFile() image: Express.Multer.File) {
    if (!image) throw new BadRequestException('Image is required!');

    const blob = this.firebaseStorageService.bucket.file(`products/test.jpeg`);

    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });

    blobWriter.on('error', (err) => {
      console.log(err);
    });

    blobWriter.on('finish', () => {
      console.log('File uploaded.');
    });

    blobWriter.end(image.buffer);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  addProduct(
    @Body('categoryId') categoryId: number,
    @Body('productName') productName: string,
    @Body('price') price: number,
    @Body('gender') gender: Gender,
    @Body('description') description: string,
    @Body('image01') image01: string,
    @Body('image02') image02: string,
    @Body('sizeIds') sizeIds?: number[],
  ) {
    return this.productService.createProduct(
      categoryId,
      productName,
      price,
      gender,
      description,
      image01,
      image02,
      sizeIds,
    );
  }

  @Put('update/:productId')
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
    @Body('sizeIds') sizeIds?: number[],
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
      sizeIds,
    );
  }

  @Delete('delete/:productId')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  deleteProduct(@Param('productId') productId: number) {
    return this.productService.deleteProduct(productId);
  }

  @Get('filter')
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

  @Get('all-for-admin')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  getAllForAdminSite() {
    return this.productService.getAllForAdminSite();
  }

  @Get('detail-for-admin/:productId')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  getDetailForAdminSite(@Param('productId') productId: number) {
    return this.productService.getDetailForAdminSite(productId);
  }
}
