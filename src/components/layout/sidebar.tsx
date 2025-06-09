import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="w-60 bg-gray-900 text-white p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-6">Punto de Venta</h2>
      <Link href="/dashboard">Home</Link>
      <Link href="/dashboard/products">Productos</Link>
      <Link href="/dashboard/categories">Categorias</Link>
      <Link href="/dashboard/sales">Ventas</Link>
      <Link href="/dashboard/settings">Configuración</Link>
    </aside>
  )
}
