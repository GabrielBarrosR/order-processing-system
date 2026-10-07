import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from './orders.schema.js';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateOrderDto } from './orders.dto.js';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
@InjectQueue("orders") private readonly ordersQueue: Queue) {}

     async createOrder(dto: CreateOrderDto): Promise<Orders>{
        return this.ordersQueue.add('order',{
            productId: dto.productId,
            quantity: dto.quantity
        })
     }

}




