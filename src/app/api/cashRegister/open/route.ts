import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/withAuth"
import { NextRequest, NextResponse } from "next/server"
import { startOfDay } from "date-fns"

export const POST = withAuth(async (req: NextRequest, ctx, session) => {
    const userId = session.user.id
    const today = startOfDay(new Date())

    const { openingAmount }: { openingAmount: number } = await req.json()

    if (openingAmount == null || isNaN(openingAmount)) {
        return NextResponse.json({ error: "Debe indicar un monto de apertura" }, { status: 400 })
    }

    // Verificar si ya hay una caja abierta
    const alreadyOpen = await prisma.cashRegister.findFirst({
        where: {
            userId,
            openTime: { gte: today },
            closeTime: null,
            deletedAt: null,
        },
    })

    if (alreadyOpen) {
        return NextResponse.json({ error: "Ya hay una caja abierta hoy" }, { status: 400 })
    }

    // Crear nueva caja
    const newCashRegister = await prisma.cashRegister.create({
        data: {
            userId,
            openTime: new Date(),
            openingAmount,
        },
    })

    return NextResponse.json({ message: "Caja abierta", data: newCashRegister })
})
