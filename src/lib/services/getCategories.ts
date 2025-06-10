import { prisma } from '@/lib/prisma'
import { api } from '../axios'

export interface Category {
  id: string
  name: string
  description: string | null
}

export async function getServerCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' }
    })
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>('/api/categories')
  return res.data
}