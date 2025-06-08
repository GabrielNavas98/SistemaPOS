import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

interface AuthPayload {
  userId: string
  email: string
  role: string
}

export function signToken(payload: AuthPayload, expiresIn: string = '1d'): string {
  return jwt.sign(payload as jwt.JwtPayload, JWT_SECRET, { expiresIn })
}

export function verifyToken<T = unknown>(token: string): T | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as T
  } catch (err) {
    console.error('JWT Error:', err)
    return null
  }
}

