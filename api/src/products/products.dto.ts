import { IsNumber, IsPositive, IsString, Min } from 'class-validator'

export class CreateProductDto {
    @IsString()
    name: string

    @IsNumber()
    @IsPositive({ message: "O preço deve ser maior que zero" })
    price: number

    @IsNumber()
    @Min(0, { message: "O estoque não pode ser menor que zero" })
    stock: number

    @IsString()
    category: string
}

export class FilterProductDto {
    @IsNumber()
    @Min(0)
    page?: number

    @IsString()
    name?: string

    @IsString()
    category?: string
}

export class UpdateProductDto {

    @IsString()
    name?: string

    @IsString()
    id?: string

    @IsString()
    newName: string

    @IsNumber()
    @IsPositive({ message: "O preço deve ser maior que zero" })
    price?: number

    @IsNumber()
    stock?: number

    @IsString()
    category?: string
}

export class EditStockDto {
    @IsString()
    name?: string

    @IsString()
    id?: string

    @IsNumber()
    stock: number
}