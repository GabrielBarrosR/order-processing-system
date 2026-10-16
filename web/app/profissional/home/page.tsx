    import ProductsTable from "@/components/utils/products-table"
    import { getProducts } from "@/services/product.service"
    import { IProduct } from "@/types/product.types"

    export default async function Profissional() {
        const initialProducts: IProduct[] = await getProducts()
        return (
            <div className="flex-1 w-full flex items-center justify-center p-6">
                <ProductsTable initialProducts={initialProducts} />
            </div>
        )
    }