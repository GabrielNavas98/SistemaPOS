'use client'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function getCurrentTime() {
    const now = new Date()
    return {
        date: now.toLocaleDateString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
        time: now.toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),
    }
}

export default function LiveClockCard() {
    const [isMounted, setIsMounted] = useState(false)
    const [datetime, setDatetime] = useState(getCurrentTime())

    useEffect(() => {
        setIsMounted(true)
        const interval = setInterval(() => {
            setDatetime(getCurrentTime())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    if (!isMounted) return null

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{datetime.date}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xl font-bold mt-1">{datetime.time}</p>
            </CardContent>
        </Card>
    )
}
