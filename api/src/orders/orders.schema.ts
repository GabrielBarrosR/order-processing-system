import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Orders {
    @Prop({required: true})
    productId: string

    @Prop({required: true})
    quantity: string

}


export const ordersSchema = SchemaFactory.createForClass(Orders)