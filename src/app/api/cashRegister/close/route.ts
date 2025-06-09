import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/withAuth"
import { NextRequest, NextResponse } from "next/server"
import { startOfDay } from "date-fns"

export const POST = withAuth(async (req: NextRequest, ctx, session) => {
    const userId = session.user.id
    const today = startOfDay(new Date())
     const { note } = await req.json()

    // Buscar caja abierta de hoy para el usuario
    const openRegister = await prisma.cashRegister.findFirst({
        where: {
            userId,
            openTime: { gte: today },
            closeTime: null,
            deletedAt: null,
        },
    })

    if (!openRegister) {
        return NextResponse.json({ error: "No hay una caja abierta" }, { status: 400 })
    }

    // Calcular ventas del día del usuario
    const sales = await prisma.sale.findMany({
        where: {
            userId,
            createdAt: { gte: openRegister.openTime },
            deletedAt: null,
        },
    })

    const totalSales = sales.reduce((acc, sale) => acc + sale.totalAmount, 0)

    // Cerrar caja
    const closedRegister = await prisma.cashRegister.update({
        where: { id: openRegister.id },
        data: {
            closeTime: new Date(),
            closingAmount: openRegister.openingAmount + totalSales,
            totalSales,
            notes: note || null,
        },
    })

    return NextResponse.json({ message: "Caja cerrada", data: closedRegister })
})
