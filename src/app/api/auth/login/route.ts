import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

  if (!account || !account.passwordHash || !account.user) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, account.passwordHash)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const { user } = account

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )
  return NextResponse.json({ token })
}
