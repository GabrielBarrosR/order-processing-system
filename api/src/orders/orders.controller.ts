import { Body, Controller, Get, Param, Post, Sse } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './orders.dto.js';
import { Orders } from './orders.schema.js';
import { fromEvent, Observable, of } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { map } from 'rxjs/operators';
import { StatusEnum } from './orders.enum.js';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    @Post()
    async createOrder(@Body() body: CreateOrderDto): Promise<Record<string, string>> {
        return this.ordersService.createOrder(body)
    }

    @Get()
    async getOrder(): Promise<Orders[]> {
        return this.ordersService.getAllOrders()
    }

    @Sse(':id/stream')
    async connectToOrderStream(@Param('id') id: string): Promise<Observable<MessageEvent>> {
        const currentOrder = await this.ordersService.getById(id)

        if (currentOrder.status === StatusEnum.pending) {
            return fromEvent(this.eventEmitter, `order.${id}`).pipe(
                map((payload: any) => ({
                    data: payload,
                } as MessageEvent)),
            );
        }
        return of({
            data: {
                status: currentOrder.status,
                items: currentOrder
            }
        } as MessageEvent);
    }
}
