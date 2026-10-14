import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { Product } from "../products/products.interface.js";
import { ProductsService } from "../products/products.service.js";
import { IOrder, JobOrderResponse } from "./oders.interface.js";
import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { OrdersService } from "./orders.service.js";
import { NotFoundError } from "rxjs";
import { ProductsModule } from "../products/products.module.js";
import { StatusEnum } from "./orders.enum.js";
import { EventEmitter2 } from "@nestjs/event-emitter";

interface IDataJob {
    id: string
}

@Processor('orders')
export class OrdersProcessor extends WorkerHost {
    constructor(private readonly productService: ProductsService,
        private readonly orderService: OrdersService,
        private readonly eventEmitter: EventEmitter2
    ) { super() }
    async process(job: Job<IDataJob>): Promise<JobOrderResponse | undefined> {
        try {
            const order = await this.orderService.getById(job.data.id)

            const products = await Promise.all(
                order.orders.map(async (orderItem) => {
                    const product = await this.productService.getById(orderItem.productId)
                    if (!product) return
                    return {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                        quantity: orderItem.quantity
                    }
                })
            )


            if (products.length === 0) {
                throw new NotFoundException("Nenhum produto encontrado")
            }
            let producterros: Record<string, string>[] = []

            const productsFoundId = products.map((product) => product?.id)
            const NotFoundProducts = order.orders.filter((products) => !productsFoundId.includes(products.productId))

            const validProductsFormatted = products.filter((product) => (product?.stock! - product?.quantity!) >= 0).map((product) => {
                const FindOrder = order.orders.find((order) => order.productId === product?.id)
                return { ...product, stock: (product?.stock! - FindOrder?.quantity!) }
            })

            const invalidProducts = products.filter((product) => (product?.stock! - product?.quantity!) < 0)

            if (invalidProducts.length > 0) {
                invalidProducts.forEach((invalid) => producterros.push({ error: "Estoque insuficiente", product: invalid?.id! }))
            }
            if (NotFoundProducts.length > 0) {
                NotFoundProducts.forEach((invalid) => producterros.push({ error: "Estoque insuficiente", product: invalid.productId }))
            }


            if (producterros.length > 0) {
                throw new BadRequestException(producterros)
            }
            await this.productService.editProduct(validProductsFormatted)
            await this.orderService.udpateStatusOrder(job.data.id, StatusEnum.success)
            const result = validProductsFormatted.map((valid) => ({ name: valid.name, price: valid.price! * valid.quantity! }))
            const totalPrice = result.reduce((acc, v) => acc + v.price, 0)
            const ItemsWithTotalPrice = {
                items: result,
                totalPrice: totalPrice
            }

            this.eventEmitter.emit(`order.${job.data.id}`, {
                status: StatusEnum.success,
                ...ItemsWithTotalPrice
            })
            return {
                ...ItemsWithTotalPrice
            }
        } catch (error) {
            await this.orderService.udpateStatusOrder(job.data.id, StatusEnum.failed)

            this.eventEmitter.emit(`order.${job.data.id}`, {
                status: StatusEnum.failed,
                message: error || "Erro ao processar pedido"
            })
        }
    }
}