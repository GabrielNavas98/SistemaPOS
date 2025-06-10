import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/authOptions"
import { NextRequest, NextResponse } from 'next/server'

export function withAuth(
  handler: (req: NextRequest, ctx: { params: { id: string } }, session: { user: { id: string } }) => Promise<NextResponse>
) {
  return async function (req: NextRequest, ctx: { params: { id: string } }) {
    const session = await getServerSession(authOptions) as { user: { id: string } }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, ctx, session)
  }
}
