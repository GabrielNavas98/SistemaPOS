import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { CreateSaleInput } from '@/types/sale'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async () => {
  const sales = await prisma.sale.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: {
        include: { product: true }
      },
      payments: {
        include: { paymentMethod: true }
      }
    }
  })

  return NextResponse.json(sales)
})

export const POST = withAuth(async (req: NextRequest, ctx, session) => {
  const { items, payments }: CreateSaleInput = await req.json()

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Sale must contain items' }, { status: 400 })
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  const sale = await prisma.sale.create({
    data: {
      userId: session.user.id,
      totalAmount,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      },
      payments: {
        create: payments.map((payment) => ({
          paymentMethodId: payment.paymentMethodId,
          amount: payment.amount
        }))
      }
    },
    include: {
      items: true,
      payments: true
    }
  })

  return NextResponse.json(sale, { status: 201 })
})
