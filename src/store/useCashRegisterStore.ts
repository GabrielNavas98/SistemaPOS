import { create } from 'zustand'
import { openCashRegister, closeCashRegister } from '@/lib/services/cashRegister/actionsCashRegister'

export interface CashRegister {
    id: string
    openTime: Date
    closeTime: Date | null
    openingAmount: number
    closingAmount: number | null
    totalSales: number
    notes: string | null
    userId: string
}

interface CashRegisterStore {
    data: CashRegister | null
    isOpen: boolean
    loading: boolean
    error: string | null
    hydrate: (data: CashRegister) => void
    open: (amount: number) => Promise<void>
    close: (note?: string) => Promise<void>
}

export const useCashRegisterStore = create<CashRegisterStore>((set) => ({
    data: null,
    isOpen: false,
    loading: false,
    error: null,

    hydrate: (data) => set({
        data,
        isOpen: !data.closeTime,
    }),

    open: async (amount) => {
        set({ loading: true, error: null })
        try {
            const data = await openCashRegister(amount)
            set({ data, isOpen: true })
        } catch (err) {
            console.log('err', err);
            set({ error: 'Error al abrir caja' })
        } finally {
            set({ loading: false })
        }
    },

    close: async (note) => {
        set({ loading: true, error: null })
        try {
            const data = await closeCashRegister(note)
            set({ data, isOpen: false })
        } catch (err) {
            console.log('err', err);
            set({ error: 'Error al cerrar caja' })
        } finally {
            set({ loading: false })
        }
    }
}))
