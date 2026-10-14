import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, ordersSchema } from './orders.schema.js';
import { BullModule } from '@nestjs/bullmq';
import { ProductsService } from '../products/products.service.js';
import { OrdersProcessor } from './orders.processor.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Orders.name,
    schema: ordersSchema
  }]), BullModule.registerQueue({
    "name": "orders"
  }), ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersProcessor]
})
export class OrdersModule { }
