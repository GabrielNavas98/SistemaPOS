import { redirect } from "next/navigation"
import { ProductTable } from "@/components/products/ProductTable"
import { getServerProducts } from "@/lib/services/getProducts"
import { getServerCategories } from "@/lib/services/getCategories"
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/authOptions"

export const dynamic = "force-dynamic"

export default async function ProductsPage() {
    const session = await getServerSession(authOptions)

    if (!session) redirect("/login")

    const [products, categories] = await Promise.all([
        getServerProducts(),
        getServerCategories(),
    ])

    return (
        <main className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Listado de Productos</h1>
            </div>
            <ProductTable initialData={products} categories={categories} />
        </main>
    )
}
