import { cookies } from 'next/headers'
import { verifyToken } from './jwt'

export async function getAuthUser() {
  const cookieStore = await cookies()
  const token = (await cookieStore).get('token')?.value

  if (!token) return null

  const payload = verifyToken(token)
  return payload
}
