import StatsDashboard from "@/components/stats/StatsDashboard"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getSalesStatsServer } from "@/lib/services/sales/getSalesStats"
import { getServerProducts } from "@/lib/services/getProducts"
import DashboardSummaryCards from "@/components/stats/SummaryCards"
import DashboardActions from "@/components/stats/DashboardActions"
import { getCurrentCashRegisterServer } from "@/lib/services/cashRegister/actionsCashRegister"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) redirect("/login")

    const [products, stats, cashRegister] = await Promise.all([
        getServerProducts(),
        getSalesStatsServer(),
        getCurrentCashRegisterServer()
    ])

    return (
        <main className="p-6 space-y-6">
            <DashboardActions cashRegister={cashRegister} />
            <DashboardSummaryCards />
            <StatsDashboard initialData={{ products, stats }} />
        </main>
    )
}
