'use client'
import { useSummaryStore } from "@/store/useSummaryStore"
import SummaryCard from "./SummaryCard"
import { useEffect } from "react"
import LiveClockCard from "./LiveClock"

export interface SummaryCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
}

export default function DashboardSummaryCards() {

  const { totalAmountToday, fetchSummary, totalSalesToday, averageSale, topProduct, lastSaleTime } = useSummaryStore()

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <SummaryCard
        title="Total vendido hoy"
        value={`$ ${totalAmountToday.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={<span>💰</span>} />
      <SummaryCard
        title="Ventas realizadas" value={totalSalesToday} icon={<span>🧾</span>} />
      <SummaryCard 
        title="Promedio por venta" 
        value={`$ ${averageSale.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`} 
        icon={<span>📊</span>} />
      {topProduct
        ? <SummaryCard title="Producto más vendido" value={topProduct.name + " (" + topProduct.quantity + "u)"} icon={<span>🏆</span>} />
        : null
      }
      {/* <SummaryCard title="Última venta" value={lastSaleTime + "hs"} icon={<span>⏱️</span>} /> */}
      <LiveClockCard />
    </div>
  )
}
