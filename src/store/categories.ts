import { create } from 'zustand'
import { Category, getCategories } from '@/lib/services/getCategories'

interface CategoryStore {
  categories: Category[]
  setCategories: (data: Category[]) => void
  fetchCategories: () => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (data) => set({ categories: data }),
  fetchCategories: async () => {
    try {
      const data = await getCategories()
      set({ categories: data })
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    }
  },
}))
