import { create } from 'zustand'

interface ProductItem {
  id: string
  name: string
  price: number
  discount?: number
  quantity: number
}

interface SaleState {
  items: ProductItem[]
  total: number
  addItem: (product: ProductItem) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearSale: () => void
}

function calculateTotal(items: ProductItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price
    return sum + price * item.quantity
  }, 0)
}

export const useSaleStore = create<SaleState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    const items = get().items
    const exists = items.find((p) => p.id === product.id)

    const updatedItems = exists
      ? items.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + product.quantity }
            : p
        )
      : [...items, product]

    set({
      items: updatedItems,
      total: calculateTotal(updatedItems),
    })
  },

  updateQuantity: (productId, quantity) => {
    const updatedItems = get().items.map((p) =>
      p.id === productId ? { ...p, quantity } : p
    )
    set({
      items: updatedItems,
      total: calculateTotal(updatedItems),
    })
  },

  removeItem: (productId) => {
    const updatedItems = get().items.filter((p) => p.id !== productId)
    set({
      items: updatedItems,
      total: calculateTotal(updatedItems),
    })
  },

  clearSale: () => set({ items: [], total: 0 }),
}))
