import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, ordersSchema } from './orders.schema.js';
import { BullModule } from '@nestjs/bullmq';
import { ProductsService } from '../products/products.service.js';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Orders.name,
    schema: ordersSchema
  }]), BullModule.registerQueue({
    "name": "orders"  
  }), ProductsService],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
