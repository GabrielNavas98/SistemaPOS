import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { NextResponse } from 'next/server'

export const GET = withAuth(async () => {
    const paymentMethods = await prisma.paymentMethod.findMany({
        where: {
            deletedAt: null
        },
        select: {
            name: true,
            id: true,
        }
    })

    return NextResponse.json(paymentMethods)
})
