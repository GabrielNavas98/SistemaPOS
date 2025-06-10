import { redirect } from "next/navigation"
import { CategoryTable } from "@/components/categories/CategoryTable"
import { getServerCategories } from "@/lib/services/getCategories"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
    
    const session = await getServerSession(authOptions)
    if (!session) redirect("/login")

    const categories = await getServerCategories()

    return (
        <main className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Listado de Categorias</h1>
            </div>
            <CategoryTable initialData={categories} />
        </main>
    )
}
