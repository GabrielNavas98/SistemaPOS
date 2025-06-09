import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/withAuth"
import { NextRequest, NextResponse } from "next/server"
import { subDays, subMonths, startOfDay } from "date-fns"

export const GET = withAuth(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "7d"
    const productId = searchParams.get("productId")

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
        const key = item.product.name // agrupar por producto

        const value = item.unitPrice * item.quantity
        map.set(key, (map.get(key) || 0) + value)
    }

    const labels = Array.from(map.keys()).sort()
    const totals = labels.map((label) => map.get(label) || 0)

    return NextResponse.json({ labels, totals })
})
