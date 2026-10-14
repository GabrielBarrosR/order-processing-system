import { StatusEnum } from "./orders.enum.js"

export interface IOrderItem {
    productId: string,
    quantity: number,
}

export interface IOrderResponse {
    _id: string,
    orders: IOrderItem[]
    status: StatusEnum
    createdAt: Date
}

export interface IOrder {
    orders: IOrderItem[]
    status: StatusEnum
}

export interface IOrderStatusUpdate {
    order: [
        {
            id: string,
            status: StatusEnum
        }
    ]
}

export interface JobOrderResponse {
    items: {
        name: string | undefined;
        price: number;
    }[],
    totalPrice: number
}
