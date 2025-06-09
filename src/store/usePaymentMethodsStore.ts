import { create } from 'zustand'
import { PaymentMethod, getPaymentMethods } from '@/lib/services/paymentMethods/getPaymentMethods'

interface PaymentStoreState {
  paymentMethods: PaymentMethod[]
  selectedMethod: PaymentMethod | null
  loading: boolean
  fetchPaymentMethods: () => Promise<void>
  setSelectedMethod: (method: PaymentMethod) => void
}

export const usePaymentStore = create<PaymentStoreState>((set) => ({
  paymentMethods: [],
  selectedMethod: null,
  loading: false,

  fetchPaymentMethods: async () => {
    set({ loading: true })
    try {
      const data = await getPaymentMethods()
      set({ paymentMethods: data })
    } catch (error) {
      console.error('Error al obtener métodos de pago:', error)
    } finally {
      set({ loading: false })
    }
  },

  setSelectedMethod: (method) => {
    set({ selectedMethod: method })
  },
}))
