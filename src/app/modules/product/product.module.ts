import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from 'src/app/repositories/product.repository';
import { SizeRepository } from 'src/app/repositories/size.repository';
import { FirebaseStorageService } from './firebase_storage.service';
import { WishlistRepository } from 'src/app/repositories/wishlist.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
      SizeRepository,
      WishlistRepository,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, FirebaseStorageService],
})
export class ProductModule {}
