import { create } from 'zustand'
import { Product, getProducts } from '@/lib/services/getProducts'

interface ProductStore {
  products: Product[]
  setProducts: (data: Product[]) => void
  fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (data) => set({ products: data }),
  fetchProducts: async () => {
    try {
      const data = await getProducts()
      set({ products: data })
    } catch (err) {
      console.error('Error al obtener productos:', err)
    }
  },
}))
