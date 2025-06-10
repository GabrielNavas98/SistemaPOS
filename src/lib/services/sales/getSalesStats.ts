import { api } from "@/lib/axios"
import { prisma } from "@/lib/prisma"
import { subDays, subMonths, startOfDay } from "date-fns"

export interface SalesStatsResponse {
  labels: string[]
  totals: number[]
}

export async function getSalesStats(period: string, productId?: string): Promise<SalesStatsResponse> {
  const url = `/api/stats?period=${period}` + (productId ? `&productId=${productId}` : "")
  const { data } = await api.get<SalesStatsResponse>(url)
  return data
}

export async function getSalesStatsServer(period?: string, productId?: string): Promise<SalesStatsResponse> {
  const now = new Date()
  let from: Date

  switch (period) {
    case "day":
      from = startOfDay(now)
      break
    case "week":
      from = subDays(now, 7)
      break
    case "month":
      from = subMonths(now, 1)
      break
    case "year":
      from = subMonths(now, 12)
      break
    case "30d":
      from = subDays(now, 30)
      break
    default:
      from = subDays(now, 7)
  }

  const sales = await prisma.saleItem.findMany({
    where: {
      sale: {
        createdAt: { gte: from },
        deletedAt: null,
      },
      ...(productId && { productId }),
    },
    include: {
      sale: true,
      product: true,
    },
  })

  const map = new Map<string, number>()

  for (const item of sales) {
    const key = item.product.name

    const value = item.unitPrice * item.quantity
    map.set(key, (map.get(key) || 0) + value)
  }

  const labels = Array.from(map.keys()).sort()
  const totals = labels.map((label) => map.get(label) || 0)

  return { labels, totals }
}
