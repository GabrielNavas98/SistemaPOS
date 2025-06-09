"use client"

import { Category } from "@/lib/services/getCategories"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/DataTable"
import { Button, Input } from "@/components/ui/index"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from 'react'
import { FormModal } from "../modals/FormModal"
import { useCategoryStore } from "@/store/useCategoriesStore"
import { deleteCategory } from "@/lib/services/categories/deleteCategories"
import { toast } from "sonner"

interface Props {
  initialData: Category[]
}

export function CategoryTable({ initialData }: Props) {

  const { categories, setCategories, fetchCategories } = useCategoryStore()

  useEffect(() => {
    setCategories(initialData)
  }, [initialData, setCategories])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [modalData, setModalData] = useState<Category | undefined>(undefined)

  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filteredData = categories.filter((category) =>
    category.name.toLowerCase().includes(filter.toLowerCase())
  )

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredData.length / pageSize)

  const columns: ColumnDef<Category>[] = [
    { accessorKey: "name", header: "Categoría" },
    {
      accessorKey: "description",
      header: "Descripción",
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}>Editar</Button>
          <Button size="sm" className="bg-red-500" onClick={() => handleDelete(row.original.id)}>Borrar</Button>
        </div>
      ),
    },
  ]

  const handleNew = () => {
    setModalMode('create')
    setModalData(undefined)
    setModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setModalMode('edit')
    setModalData(category)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar este producto?')
    if (!confirmed) return

    try {
      await deleteCategory(id)
      toast.success('Producto eliminado')
      await fetchCategories()
    } catch (err) {
      toast.error('Error al eliminar producto')
      console.error(err)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar Categoría..."
          value={filter}
          onChange={(e) => {
            setPage(1)
            setFilter(e.target.value)
          }}
          className="w-[300px]"
        />
        <Button onClick={handleNew}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <DataTable columns={columns} data={paginatedData} />

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Siguiente
          </Button>
        </div>
      </div>
      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        type="category"
        data={modalData}
      />
    </div>
  )
}

