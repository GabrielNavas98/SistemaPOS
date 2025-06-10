import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { Session, SessionStrategy, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null

                const account = await prisma.account.findFirst({
                    where: {
                        provider: 'credentials',
                        user: { email: credentials.email },
                    },
                    include: { user: true }
                })

                if (!account || !account.passwordHash || !account.user) return null

                const isValid = await bcrypt.compare(credentials.password, account.passwordHash)
                if (!isValid) return null

                return account.user
            }
        })
    ],
    session: {
        strategy: 'jwt' as SessionStrategy
    },
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: User }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token && session.user) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        }
    },
    secret: process.env.JWT_SECRET
}