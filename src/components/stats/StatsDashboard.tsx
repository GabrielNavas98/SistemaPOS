'use client'
import { useEffect, useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Select,
    SelectTrigger,
    SelectValue,
    SelectItem,
    SelectContent,
    Label
} from "@/components/ui/index"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Label as LabelCharts
} from "recharts"
import { StatsFormattedData, useSalesStatsStore } from "@/store/useSalesStats"
import { useProductStore } from "@/store/useProductsStore"
import { Product } from "@/lib/services/getProducts"

const periods = [
    { value: "day", label: "Hoy" },
    { value: "week", label: "Últimos 7 días" },
    { value: "30d", label: "Últimos 30 días" },
    { value: "year", label: "Este año" },
]

interface Props {
    initialData: {
        products: Product[],
        stats: StatsFormattedData[]
    }
}

export default function StatsDashboard({ initialData }: Props) {
    const [period, setPeriod] = useState("week")
    const [selectedProductId, setSelectedProductId] = useState<string>('all')

    const { data, fetchStats } = useSalesStatsStore()
    const { products } = useProductStore()

    useEffect(() => {
        fetchStats(period, selectedProductId === "all" ? undefined : selectedProductId)
    }, [period, selectedProductId, fetchStats])

    useEffect(() => {
        if (initialData?.products) {
            useProductStore.setState({ products: initialData.products })
        }
        if (initialData?.stats) {
            useSalesStatsStore.setState({ data: initialData.stats })
        }
    }, [initialData])

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl">Estadísticas de ventas</CardTitle>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-start gap-2 flex-col">
                        <Label>Resumen total por período</Label>
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccionar período" />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map((p) => (
                                    <SelectItem key={p.value} value={p.value}>
                                        {p.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-start gap-2 flex-col">
                        <Label>Producto</Label>
                        <Select
                            value={selectedProductId ?? ""}
                            onValueChange={(value) =>
                                setSelectedProductId(value)
                            }
                        >
                            <SelectTrigger className="w-[240px]">
                                <SelectValue placeholder="Todos los productos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {products.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

            </CardHeader>
            <CardContent className="pl-2">
                {
                    data.length
                        ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name">
                                        <LabelCharts value="Producto/s" offset={-5} position="insideBottom" />
                                    </XAxis>
                                    <YAxis label={{ value: 'Cantidad en $', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Bar dataKey="total" fill="#0B5195" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (<h2 className="w-full flex">Sin registros de ventas</h2>)
                }

            </CardContent>
        </Card>
    )
}
