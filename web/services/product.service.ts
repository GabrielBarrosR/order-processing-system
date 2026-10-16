import { IGetFilters } from "../types/product.types.js";

export async function getProducts(filters: IGetFilters = {}) {
    const { page = 0, ...restFilters } = filters
    const params = new URLSearchParams()

    params.append('page', String(page))

    Object.entries(restFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
        }
    })
    console.log(`${ process.env.NEXT_PUBLIC_API_URL }/products?${ params }`)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`)
    if(!response.ok){
        throw new Error('Erro ao consultar Produtos')
    }

    const data = await response.json()
    return data
}