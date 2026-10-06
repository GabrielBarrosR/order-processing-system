export interface Product {
     id: string,
     name: string,
     price: number,
     stock: number,
     category: string,
     createdAt: Date
}


export interface updateResponse {
    success: Product[],
    failed: string[] | null
}