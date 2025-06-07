import { verifyToken } from './jwt'
import { NextRequest, NextResponse } from 'next/server'

export function withAuth(handler: (req: NextRequest, user: unknown) => Promise<NextResponse>) {
  return async function (req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Token missing' }, { status: 401 })
    }

    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    return handler(req, user)
  }
}
