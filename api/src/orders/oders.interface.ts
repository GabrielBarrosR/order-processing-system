export interface IOrderItem {
    productId: string,
    quantity: number,
}

export interface IOrderResponse{
    _id: string,
    ordersItems: IOrderItem
    createdAt: Date
}
