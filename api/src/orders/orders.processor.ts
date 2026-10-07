import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Product } from "../products/products.interface.js";
import { ProductsService } from "../products/products.service.js";
import { IOrder } from "./oders.interface.js";
import { BadRequestException } from "@nestjs/common";

@Processor('orders')
export class OrdersProcessor extends WorkerHost {
    constructor(private readonly productService: ProductsService) { super()}
    async process(job: Job<IOrder>): Promise<Product>{
        const product = await this.productService.getById(job.data.productId)
        if ((product.stock - job.data.quantity) < 0 ){
            throw new BadRequestException("Quantidade de estoque insuficiente")
        }

        const value = product.price * job.data.quantity
        
    }
}