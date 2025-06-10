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
    Textarea
} from "@/components/ui/index"
import { Lock } from "lucide-react"
import { useCashRegisterStore } from "@/store/useCashRegisterStore"
import { useSummaryStore } from "@/store/useSummaryStore"

export function CloseCashRegisterModal() {
    const [openDialog, setOpenDialog] = useState(false)
    const [note, setNote] = useState("")
    const { close, loading } = useCashRegisterStore()
    const { totalAmountToday } = useSummaryStore()

    const handleClose = async () => {
        await close(note)
        setNote("")
        setOpenDialog(false)
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2 hover:cursor-pointer" disabled={loading}>
                    <Lock size={16} />
                    Cerrar caja
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cerrar caja</DialogTitle>
                    <DialogDescription>
                        A continuación se detalla el total actual. Podés agregar una nota si lo necesitás.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div>
                        <Label>Total actual en caja</Label>
                        <Input value={`$ ${totalAmountToday?.toFixed(2) || 0}`} readOnly />
                    </div>
                    <div>
                        <Label htmlFor="note">Nota (opcional)</Label>
                        <Textarea
                            id="note"
                            placeholder="Observaciones, ajustes, etc."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleClose} disabled={loading}>
                        Confirmar cierre
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
