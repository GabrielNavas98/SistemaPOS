import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async () => {
    const products = await prisma.product.findMany({
        where: {
            deletedAt: null
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return NextResponse.json(products)
})


export const POST = withAuth(async (req: NextRequest) => {
    const body = await req.json()

    const { name, description, price, discount, stock, categoryId } = body

    if (!name || !price || !stock) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.create({
        data: {
            name,
            description,
            price: parseFloat(price),
            discount: discount ? parseFloat(discount) : undefined,
            stock: parseInt(stock),
            categoryId
        }
    })

    return NextResponse.json(product, { status: 201 })
})