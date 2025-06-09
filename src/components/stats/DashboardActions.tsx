'use client'
import { Button } from "@/components/ui/button"
import { useCashRegisterStore } from "@/store/useCashRegisterStore"
import { Download, PlusCircle } from "lucide-react"
import Link from "next/link"
import { OpenCashRegisterModal } from "../modals/OpenCashRegisterModal"
import { CloseCashRegisterModal } from "../modals/CloseCashRegisterModal"
import { useEffect } from "react"

interface Props {
    cashRegister: {
        id: string
        openedAt: string
        closedAt: string | null
        openingAmount: number
        closingAmount: number | null
        totalSales: number
        notes: string | null
        userId: string
    } | null
}

export default function DashboardActions({ cashRegister }: Props) {
    const { isOpen, hydrate } = useCashRegisterStore()

    useEffect(() => {
        if (cashRegister) {
            hydrate(cashRegister)
        }
    }, [cashRegister, hydrate])

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <Link href="/dashboard/sales">
                <Button variant="default" className="gap-2">
                    <PlusCircle size={16} />
                    Nueva venta
                </Button>
            </Link>
            {
                isOpen
                    ? (
                        <CloseCashRegisterModal />
                    )
                    : (
                        <OpenCashRegisterModal />
                    )
            }
            <Button variant="secondary" className="gap-2">
                <Download size={16} />
                Descargar resumen
            </Button>
        </div>
    )
}
