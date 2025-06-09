import {
    Card,
    CardContent,
    CardTitle,
    CardHeader,
} from "@/components/ui/card"
import { SummaryCardProps } from "./SummaryCards"

export default function SummaryCard({ title, value, icon }: SummaryCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon && <div className="text-muted-foreground">{icon}</div>}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}