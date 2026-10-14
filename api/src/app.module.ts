import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), 
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (ConfigService: ConfigService) => ({
      uri: ConfigService.get<string>('MONGODB_URI')
    }),
    inject: [ConfigService]
  }),  
  BullModule.forRoot({
    connection: {
      host: 'localhost',
      port: 6379
    }
  }),
  EventEmitterModule.forRoot(),
   ProductsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
