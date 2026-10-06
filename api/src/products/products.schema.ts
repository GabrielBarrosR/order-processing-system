import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true})
export class Products {
    @Prop({required: true, unique: true})
    name: string
    
    @Prop({required: true})
    price: number

    @Prop({required: true})
    stock: number

    @Prop({required: true})
    category: string

    createdAt: Date
}

export const ProductsSchema = SchemaFactory.createForClass(Products)