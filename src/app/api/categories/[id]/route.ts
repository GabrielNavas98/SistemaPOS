import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/withAuth'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
  }

  const { name, description } = await req.json()

  const updated = await prisma.category.update({
    where: { id },
    data: { name, description }
  })

  return NextResponse.json(updated)
})

export const DELETE = withAuth(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
  }

  const deleted = await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() }
  })

  return NextResponse.json({
    message: 'Category deleted successfully',
    deleted
  })
})
