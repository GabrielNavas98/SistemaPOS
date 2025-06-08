import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextRequest, NextResponse } from 'next/server'

export function withAuth(
  handler: (req: NextRequest, ctx: { params: {id: string} }, session: unknown) => Promise<NextResponse>
) {
  return async function (req: NextRequest, ctx: { params: {id: string} }) {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, ctx, session)
  }
}
