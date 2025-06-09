import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/withAuth"
import { NextRequest, NextResponse } from "next/server"
import { startOfDay } from "date-fns"

export const GET = withAuth(async (req: NextRequest, ctx, session) => {
    const userId = session.user.id
    const today = startOfDay(new Date())

    const register = await prisma.cashRegister.findFirst({
        where: {
            userId,
            openTime: { gte: today },
            deletedAt: null,
        },
        orderBy: {
            openTime: "desc",
        },
    })

    if (!register) {
        return NextResponse.json({ data: null })
    }

    return NextResponse.json({ data: register })
})
