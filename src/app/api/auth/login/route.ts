import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const account = await prisma.account.findUnique({
    where: {
      provider_providerId: {
        provider: 'credentials',
        providerId: email
      }
    },
    include: {
      user: true
    }
  })

  if (!account || !account.passwordHash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, account.passwordHash)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const { user } = account

  return NextResponse.json({
    message: 'Login successful',
    token: signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    }),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
}
