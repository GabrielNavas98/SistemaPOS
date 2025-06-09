import { api } from '@/lib/axios'

export interface PaymentMethod {
    id: string
    name: string
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
    const { data } = await api.get<PaymentMethod[]>('/api/paymentMethods')
    return data
}