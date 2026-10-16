'use server'

import { getProducts } from "@/services/product.service";
import { IGetFilters, IProduct } from "@/types/product.types";

export async function getProductsAction(filters: IGetFilters): Promise<IProduct[]>{
    const products = await getProducts(filters)
    return products
}