'use client'

import { TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Table } from "../ui/table";
import { useState, useRef } from "react";
import { IProduct } from "@/types/product.types";
import { getProductsAction } from "@/app/actions/profissoinal-actions";

interface ProductsTableProps {
    initialProducts: IProduct[];
}

export default function ProductsTable({ initialProducts }: ProductsTableProps) {
    const [products, setProducts] = useState<IProduct[]>(initialProducts);
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true); 

    async function handleScroll(e: React.UIEvent<HTMLDivElement>) {
        if (loading || !hasMore) return;

        const target = e.currentTarget;
        const scrollPosition = target.scrollTop + target.clientHeight;
        const scrollHeight = target.scrollHeight;

        if (scrollHeight - scrollPosition <= 50) {
            setLoading(true);
            const nextPage = page + 1;

            try {
                const newProducts = await getProductsAction({ page: nextPage });

                if (!newProducts || newProducts.length === 0) {
                    setHasMore(false); 
                } else {
                    setProducts(prev => [...prev, ...newProducts]);
                    setPage(nextPage);
                }
            } catch (error) {
                console.error("Erro ao carregar mais produtos:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div>
            {products.length === 0 ? (
                <div>
                    <h1 className="text-lg font-medium text-muted-foreground">
                        Não há produtos ativos, crie o primeiro produto
                    </h1>
                </div>
            ) : (
                <div 
                    className="overflow-y-auto max-h-[300px] border rounded-md"
                    onScroll={handleScroll}
                >
                    <Table>
                        {loading && (<TableCaption>Produtos "(Carregando mais...)"</TableCaption>)}
                        <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                                <TableHead className="w-[100px]">Nome</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead>Estoque</TableHead>
                                <TableHead>Categoria</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow key={`${product.id}-${index}`}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}