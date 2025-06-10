import Link from 'next/link'
import {
  Home,
  Package,
  List,
  ShoppingCart
} from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 text-white p-4 flex flex-col gap-4 text-xl">
      <h2 className="text-xl font-bold mb-6">Corralón Pereyra</h2>
      <Link href="/dashboard" className="p-2 flex items-center gap-2 hover:bg-gray-800 hover:text-gray-200 transition-colors rounded-md">
        <Home size={18} />
        Home
      </Link>
      <Link href="/dashboard/products" className="p-2 flex items-center gap-2 hover:bg-gray-800 hover:text-gray-200 transition-colors rounded-md">
        <Package size={18} />
        Productos
      </Link>
      <Link href="/dashboard/categories" className="p-2 flex items-center gap-2 hover:bg-gray-800 hover:text-gray-200 transition-colors rounded-md">
        <List size={18} />
        Categorías
      </Link>
      <Link href="/dashboard/sales" className="p-2 flex items-center gap-2 hover:bg-gray-800 hover:text-gray-200 transition-colors rounded-md">
        <ShoppingCart size={18} />
        Ventas
      </Link>
    </aside>
  )
}
