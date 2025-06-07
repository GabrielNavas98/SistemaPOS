import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async () => {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { name: 'asc' }
  })

  return NextResponse.json(categories)
})

export const POST = withAuth(async (req: NextRequest) => {
  const { name, description } = await req.json()

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const category = await prisma.category.create({
    data: {
      name,
      description
    }
  })

  return NextResponse.json(category, { status: 201 })
})