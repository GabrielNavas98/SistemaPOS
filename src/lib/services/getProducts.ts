import { prisma } from '@/lib/prisma'
import { api } from '../axios'

export interface Product {
  id: string
  name: string
  price: number
  listPrice: number
  discount: number | null
  stock: number
  category: {
    id: string
    name: string
  } | null
}

export async function getServerProducts(): Promise<Product[]> {
  return await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export async function getProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>('/api/products')
  return res.data
}