import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './products.schema.js';
import { Model, Types } from 'mongoose';
import { Product, updateResponse } from './products.interface.js';
import { CreateProductDto, UpdateProductDto, FilterProductDto } from './products.dto.js';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Products.name) private readonly productModel: Model<Products>) { }
    async createProduct(product: CreateProductDto[]): Promise<Product[]> {
        try {
            return await this.productModel.insertMany(product, { ordered: false })
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'writeErrors' in error) {
                const err = error as {
                    writeErrors: Array<{
                        code?: number;
                        err: {
                            code: number;
                            op: { name: string };
                        };
                    }>;
                };

                const duplicateErrors = err.writeErrors.filter((item) => item.err.code === 11000)

                if (duplicateErrors.length > 0) {
                    const duplicatedNames = duplicateErrors
                        .map((item) => item.err.op.name)
                        .join(', ');

                    throw new ConflictException(`Já existem produtos cadastrados com esses nomes: ${duplicatedNames}`);
                }
            }

            throw new InternalServerErrorException("Erro não mapeado");
        }
    }


    async getProduct(filters: FilterProductDto): Promise<Product[] | null> {
        const limit = 10
        const { page, ...queryFilters } = filters

        const query = Object.fromEntries(
            Object.entries(queryFilters).filter((prop) => prop[1] != undefined)
        )

        return this.productModel.find(query).limit(10).skip((limit * (page ? page - 1 : 0)))
    }

    async editProduct(updateProduct: UpdateProductDto[]): Promise<updateResponse> {
        if (!updateProduct) {
            throw new BadRequestException("Pelo menos um campo é obrigatório")
        }

        const notIdentifiedProducts = updateProduct.filter((updates) => !updates.name && !updates.id)
        if (notIdentifiedProducts.length > 0) {
            throw new BadRequestException("Há produtos sem nome ou id, é necessário fornecer um identificador ou nome para cada produto")
        }

        const idEdit = updateProduct.filter((edit) => edit.id).map((edit) => edit.id)
        const editNames = updateProduct.filter((edit) => edit.name && !edit.id).map((edit) => edit.name)

        const result = await this.productModel.find({
            $or: [
                { name: { $in: editNames } },
                { _id: { $in: idEdit } },
            ],
        }).lean()

        if (!result) {
            throw new NotFoundException("Não foram localizados os produtos")
        }

        const foundNamesSet = new Set<string>(result.map(p => p.name));
        const foundIdsSet = new Set<string>(result.map(p => p._id.toString()));

        const notFoundProducts = updateProduct.filter((edit) => edit.name ? !foundNamesSet.has(edit.name) : !foundIdsSet.has(edit.id!)).map((notFound) => notFound.name ? notFound.name : notFound.id)
        const foundProducts = updateProduct.filter((edit) => edit.name ? foundNamesSet.has(edit.name) : foundIdsSet.has(edit.id!))

        const foundProductsFormatted = foundProducts.map((found) => {
            return Object.fromEntries(
                Object.entries(found).filter((obj) => obj[1] != undefined)
            )
        })
        const updateResults = await Promise.all(
            foundProductsFormatted.map(async (product) => {
                const filter = product.id ? { _id: product.id } : { name: product.name };
                const { id, newName, ...restOfProduct } = product;

                const updateData = {
                    ...restOfProduct,
                    ...(newName && { name: newName }),
                };

                const updated = await this.productModel.findOneAndUpdate(
                    filter,
                    { $set: updateData },
                    { returnDocument: 'after', lean: true }
                );

                if (!updated) return null;

                return {
                    ...updated,
                    id: updated._id.toString()
                    };
            })
        );

        return {
            success: updateResults as Product[],
            failed: notFoundProducts as string[]
        }
    }

    async getById(id: string): Promise<Product> {
        const result = await this.productModel.findById(id)

        if (!result){
            throw new NotFoundException("Produto não encontrado")
        }
        return result
    }
}
