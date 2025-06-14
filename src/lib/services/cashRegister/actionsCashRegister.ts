import { authOptions } from "@/lib/authOptions"
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { CashRegister } from "@/store/useCashRegisterStore"
import { startOfDay } from 'date-fns'
import { getServerSession } from 'next-auth'

export async function openCashRegister(openingAmount: number): Promise<CashRegister> {
    const { data } = await api.post<{ data: CashRegister }>('/api/cashRegister/open', {
        openingAmount,
    })
    return data.data
}

export async function closeCashRegister(note?: string): Promise<CashRegister> {
    const { data } = await api.post<{ data: CashRegister }>('/api/cashRegister/close', {
        note
    })
    return data.data
}

export async function getCurrentCashRegister(): Promise<CashRegister | null> {
    const { data } = await api.get<{ data: CashRegister | null }>("/api/cashRegister/current")
    return data.data
}

export async function getCurrentCashRegisterServer() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) return null

    const today = startOfDay(new Date())

    const current = await prisma.cashRegister.findFirst({
        where: {
            userId: session.user.id,
            openTime: { gte: today },
            closeTime: null,
            deletedAt: null,
        },
    })

    return current
}