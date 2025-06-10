'use client'
import { Button } from "@/components/ui/button"
import { CashRegister, useCashRegisterStore } from "@/store/useCashRegisterStore"
import { Download, PlusCircle } from "lucide-react"
import Link from "next/link"
import { OpenCashRegisterModal } from "../modals/OpenCashRegisterModal"
import { CloseCashRegisterModal } from "../modals/CloseCashRegisterModal"
import { useEffect } from "react"

interface Props {
    cashRegister: CashRegister | null
}

export default function DashboardActions({ cashRegister }: Props) {
    const { isOpen, hydrate } = useCashRegisterStore()

    useEffect(() => {
        if (cashRegister) {
            hydrate(cashRegister)
        }
    }, [cashRegister, hydrate])

    const reportsDaily = () => {
        const link = document.createElement('a')
        link.href = '/api/reports/daily'
        link.download = 'ventas-diarias.xlsx'
        link.click()
    }

    const reportProducts = (period: 'day' | 'month') => {
        const link = document.createElement('a')
        link.href = `/api/reports/products?period=${period}`
        link.download = `resumen-productos-${period}.xlsx`
        link.click()
    }

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <Link href="/dashboard/sales">
                <Button variant="default" className="gap-2 hover:cursor-pointer">
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
            <Button variant="secondary" className="gap-2 hover:bg-gray-300 hover:cursor-pointer" onClick={reportsDaily}>
                <Download size={16} />
                Descargar resumen de ventas diarias
            </Button>
            <Button variant="secondary" className="gap-2 hover:bg-gray-300 hover:cursor-pointer" onClick={() => reportProducts('month')}>
                <Download size={16} />
                Descargar resumen de ventas por producto
            </Button>
        </div>
    )
}
