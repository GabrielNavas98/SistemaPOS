import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/withAuth"
import { NextResponse } from "next/server"
import { startOfDay } from "date-fns"

export const GET = withAuth(async () => {
    const today = startOfDay(new Date())

    const [sales, topProduct] = await Promise.all([
        prisma.sale.findMany({
            where: {
                createdAt: { gte: today },
                deletedAt: null,
            },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: { product: true }
                }
            }
        }),
        prisma.saleItem.groupBy({
            by: ['productId'],
            where: {
                sale: {
                    createdAt: { gte: today },
                    deletedAt: null,
                },
            },
            _sum: { quantity: true },
            orderBy: {
                _sum: { quantity: 'desc' }
            },
            take: 1,
        })
    ])

    const totalAmountToday = sales.reduce((acc, sale) => acc + sale.totalAmount, 0)
    const totalSalesToday = sales.length
    const averageSale = totalSalesToday > 0 ? totalAmountToday / totalSalesToday : 0

    const lastSale = sales[0]
    const lastSaleTime = lastSale?.createdAt.toTimeString().slice(0, 5) || null

    const topProductId = topProduct[0]?.productId
    let topProductData = null

    if (topProductId) {
        const product = await prisma.product.findUnique({ where: { id: topProductId } })
        topProductData = {
            name: product?.name || "",
            quantity: topProduct[0]._sum.quantity || 0,
        }
    }

    return NextResponse.json({
        totalAmountToday,
        totalSalesToday,
        averageSale,
        lastSaleTime,
        topProduct: topProductData,
    })
})
