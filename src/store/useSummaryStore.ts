import { create } from 'zustand'
import { api } from '@/lib/axios'

interface TopProduct {
  name: string
  quantity: number
}

interface DashboardSummary {
  totalAmountToday: number
  totalSalesToday: number
  averageSale: number
  lastSaleTime: string | null
  topProduct: TopProduct | null
}

interface SummaryStore extends DashboardSummary {
  loading: boolean
  fetchSummary: () => Promise<void>
}

export const useSummaryStore = create<SummaryStore>((set) => ({
  totalAmountToday: 0,
  totalSalesToday: 0,
  averageSale: 0,
  lastSaleTime: null,
  topProduct: null,
  loading: false,

  fetchSummary: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get<DashboardSummary>('/api/stats/summary')
      set({ ...data, loading: false })
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      set({ loading: false })
    }
  },
}))
