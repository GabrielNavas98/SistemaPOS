'use client'

import { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    Input,
    Label,
    Button,
} from "@/components/ui/index"
import { Lock } from "lucide-react"
import { useCashRegisterStore } from "@/store/useCashRegisterStore"

export function OpenCashRegisterModal() {
    const [openDialog, setOpenDialog] = useState(false)
    const [amount, setAmount] = useState("")
    const { open, loading } = useCashRegisterStore()

    const handleConfirm = async () => {
        const parsedAmount = parseFloat(amount)
        if (isNaN(parsedAmount)) return

        await open(parsedAmount)
        setAmount("")
        setOpenDialog(false)
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="default" className="gap-2 bg-green-500 hover:cursor-pointer"  disabled={loading}>
                    <Lock size={16} />
                    Abrir caja
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Abrir caja</DialogTitle>
                    <DialogDescription>
                        Ingresá el monto inicial con el que comenzás la jornada.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Label htmlFor="amount">Monto inicial</Label>
                    <Input
                        id="amount"
                        type="number"
                        placeholder="Ej: 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleConfirm} disabled={loading || !amount}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
