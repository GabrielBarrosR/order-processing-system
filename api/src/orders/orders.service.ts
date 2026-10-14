import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from './orders.schema.js';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CreateOrderDto } from './orders.dto.js';
import { StatusEnum } from './orders.enum.js';
import { IOrderStatusUpdate } from './oders.interface.js';

@Injectable()
export class OrdersService {
    constructor(@InjectModel(Orders.name) private readonly ordersModel: Model<Orders>,
@InjectQueue("orders") private readonly ordersQueue: Queue) {}

     async createOrder(dto: CreateOrderDto): Promise<Record<string, string>>{
        const order = await this.ordersModel.create({...dto, status: StatusEnum.pending})
        const job = await this.ordersQueue.add('order', {id: order._id.toString()})
        return {
            jobId: job.id!,
            orderId: order.id
        }
     }

     async getById(id: string): Promise<Orders>{
        const order = await this.ordersModel.findById(id)
        if (!order){
            throw new NotFoundException("Pedido não encontrado")
        }
        return order
     }

     async udpateStatusOrder(id: string, status: StatusEnum): Promise<Orders[] | null>{
        return this.ordersModel.findByIdAndUpdate(id, {$set: {status}})
    }

    async getAllOrders(): Promise<Orders[]> {
        return this.ordersModel.find()
    }
}




