import { api } from "@/lib/axios"

interface SaleItem {
  productId: string
  quantity: number
  unitPrice: number
}

interface SalePayment {
  paymentMethodId: string
  amount: number
}

export interface CreateSaleInput {
  items: SaleItem[]
  payments: SalePayment[]
}

export async function createSale(data: CreateSaleInput) {
  const response = await api.post('/api/sales', data)
  return response.data
}
