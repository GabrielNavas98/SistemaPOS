import { create } from "zustand"
import { getSalesStats } from "@/lib/services/sales/getSalesStats"

export interface StatsFormattedData {
    name: string
    total: number
}

export interface SalesStatsStore {
    data: StatsFormattedData[]
    loading: boolean
    fetchStats: (period: string, productId?: string) => Promise<void>
}

export const useSalesStatsStore = create<SalesStatsStore>((set) => ({
    data: [],
    loading: false,

    fetchStats: async (period, productId) => {
        set({ loading: true })
        try {
            const { labels, totals } = await getSalesStats(period, productId)
            const formatted = labels.map((name, i) => ({ name, total: totals[i] }))
            set({ data: formatted })
        } catch (err) {
            console.error("Error al obtener estadísticas", err)
        } finally {
            set({ loading: false })
        }
    },
}))
