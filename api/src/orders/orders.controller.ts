import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './orders.dto.js';
import { Orders } from './orders.schema.js';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async createOrder(@Body()body: CreateOrderDto): Orders {
        return this.ordersService.createOrder(body)
    }
}
