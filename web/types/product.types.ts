export interface IGetFilters {
    name?: string,
    page?: number,
    category?: string
}

export interface IProduct {
    id: string
    name: string,
    price: number,
    stock: number
    category: string
}