import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Sale ID is required' }, { status: 400 })
  }

  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { product: true } },
      payments: { include: { paymentMethod: true } }
    }
  })

  if (!sale) {
    return NextResponse.json({ error: 'Sale not found' }, { status: 404 })
  }

  return NextResponse.json(sale)
})
