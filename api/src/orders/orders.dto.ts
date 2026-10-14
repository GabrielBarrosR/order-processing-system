import { IsNumber, IsString, IsArray } from "class-validator";

export class CreateOrderDto {
    @IsArray()
    orders: ItemOrderDto[]
}

export class ItemOrderDto {
    @IsString()
    productId: string

    @IsNumber()
    quantity: number
}