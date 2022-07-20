import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CategoryModule } from './app/modules/category/category.module';
import { ProductModule } from './app/modules/product/product.module';
import { SizeModule } from './app/modules/size/size.module';
import { AuthModule } from './app/modules/auth/auth.module';
import { CartModule } from './app/modules/cart/cart.module';
import { OrderModule } from './app/modules/order/order.module';
import { StatsModule } from './app/modules/stats/stats.module';
import { UserModule } from './app/modules/user/user.module';
import { RealtimeModule } from './app/modules/realtime/realtime.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CategoryModule,
    ProductModule,
    SizeModule,
    AuthModule,
    CartModule,
    OrderModule,
    StatsModule,
    UserModule,
    RealtimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
