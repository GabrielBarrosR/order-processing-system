import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { StatusEnum } from "./orders.enum.js";

@Schema({timestamps: true})
export class Orders {
    @Prop()
    orders: OrderItem[]

    @Prop({enum: StatusEnum, type: String})
    status: StatusEnum
}

export class OrderItem{
    @Prop({required: true})
    productId: string

    @Prop({required: true})
    quantity: number
}

export const ordersSchema = SchemaFactory.createForClass(Orders)