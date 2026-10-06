import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './products.schema.js';
import { Model, Types } from 'mongoose';
import { Product, updateResponse } from './products.interface.js';
import { CreateProductDto, UpdateProductDto, FilterProductDto, EditStockDto } from './products.dto.js';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Products.name) private readonly productModel: Model<Products>) { }

    async createProduct(product: CreateProductDto[]): Promise<Product[]> {
        return this.productModel.create(product)
    }


    async getProduct(filters: FilterProductDto): Promise<Product[] | null> {
        const limit = 10
        const { page, ...queryFilters } = filters

        return this.productModel.find(queryFilters).limit(10).skip((limit * (page ? page - 1 : 0)))
    }

    async editProduct(updateProduct: UpdateProductDto[]): Promise<updateResponse> {
        if (!updateProduct) {
            throw new BadRequestException("Pelo menos um campo é obrigatório")
        }

        const notIdentifiedProducts = updateProduct.filter((updates) => !updates.name && !updates.id)
        if (notIdentifiedProducts){
            throw new BadRequestException("Há produtos sem nome ou id, é necessário fornecer um identificador ou nome para cada produto")
        }

        const editNames = updateProduct.map((edit) => edit.name)
        const idEdit = updateProduct.map((edit) => edit.id)

        const result = await this.productModel.find({
            $or: [
                { name: { $in: editNames } },
                { _id: { $in: idEdit } },
            ],
        })

        if (!result) {
            throw new NotFoundException("Não foram localizados os produtos")
        }

        const foundNamesSet = new Set<string>(result.map(p => p.name));
        const foundIdsSet = new Set<string>(result.map(p => p._id.toString()));

        const notFoundProducts = updateProduct.filter((edit) => edit.name ? !foundNamesSet.has(edit.name) : !foundIdsSet.has(edit.id!)).map((notFound) => notFound.name ?  notFound.name : notFound.id)
        const foundProducts = updateProduct.filter((edit) => edit.name ? foundNamesSet.has(edit.name) : foundIdsSet.has(edit.id!))
        

        const updateResults = await Promise.all(
            foundProducts.map((product) => this.productModel.findOneAndUpdate((product.name ? {name: product.name} : {id: product.id}), { $set: { ...(product.newName ? { ...product, name: product.newName } : { ...product }) } }, { new: true }))
        )

        return {
            success: updateResults as Product[],
            failed: notFoundProducts as string[]
        }
    }
}
