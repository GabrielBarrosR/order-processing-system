import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator'

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
    @IsOptional()
    @IsNumber()
    @Min(0)
    page?: number

    @IsOptional()
    @IsString()
    name?: string
    
    @IsOptional()
    @IsString()
    category?: string
}

export class UpdateProductDto {

    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    id?: string

    @IsString()
    @IsOptional()
    newName?: string

    @IsNumber()
    @IsOptional()
    @IsPositive({ message: "O preço deve ser maior que zero" })
    price?: number

    @IsNumber()
    @IsOptional()
    stock?: number

    @IsString()
    @IsOptional()
    category?: string
}
