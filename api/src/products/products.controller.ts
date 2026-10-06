import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CreateProductDto, FilterProductDto, UpdateProductDto } from './products.dto.js';
import { Product, updateResponse } from './products.interface.js';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    async createProduct(@Body()body: CreateProductDto[]): Promise<Product[]>{
        return this.productsService.createProduct(body)
    }

    @Get()
    async getProduct(@Query()query: FilterProductDto): Promise<Product[] | null>{
        return this.productsService.getProduct(query)
    }

    @Put()
    async editProduct(@Body()body: UpdateProductDto[]): Promise<updateResponse>{
        return this.productsService.editProduct(body)
    }
}
