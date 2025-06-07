import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = withAuth(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { name, description, price, discount, stock, categoryId } = body

    const updated = await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            price: price !== undefined ? parseFloat(price) : undefined,
            discount: discount !== undefined ? parseFloat(discount) : undefined,
            stock: stock !== undefined ? parseInt(stock) : undefined,
            categoryId
        }
    })

    return NextResponse.json(updated)
})

export const DELETE = withAuth(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const deleted = await prisma.product.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })

    return NextResponse.json({
        message: 'Product deleted successfully',
        deleted
    })
})