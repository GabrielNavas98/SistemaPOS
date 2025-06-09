export interface SaleItemInput {
  productId: string
  quantity: number
  unitPrice: number
}

export interface PaymentInput {
  paymentMethodId: string
  amount: number
}

export interface CreateSaleInput {
  items: SaleItemInput[]
  payments: PaymentInput[]
}
