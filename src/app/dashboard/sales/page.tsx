'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2 } from "lucide-react"
import { useProductStore } from "@/store/useProductsStore"
import { useSaleStore } from "@/store/useSalesStore"
import { Product } from "@/lib/services/getProducts"
import { toast } from "sonner"
import { usePaymentStore } from "@/store/usePaymentMethodsStore"
import { createSale } from "@/lib/services/sales/postSale"

export default function SalesPage() {
    const [search, setSearch] = useState("")
    const [cashAmount, setCashAmount] = useState(0)
    const { products } = useProductStore()
    const { fetchPaymentMethods, paymentMethods, selectedMethod, setSelectedMethod } = usePaymentStore()
    const {
        items: cart,
        addItem,
        updateQuantity,
        removeItem,
        total,
        clearSale,
    } = useSaleStore()

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
        fetchPaymentMethods()
    }, [fetchPaymentMethods])

    const handleAdd = (product: Product) => {
        addItem({ ...product, quantity: 1 })
    }

    const handleSubmit = async () => {
        try {
            if (!selectedMethod) {
                toast.error("Seleccioná un método de pago")
                return
            }

            if (cart.length === 0) {
                toast.error("Agregá al menos un producto")
                return
            }

            if (selectedMethod.name === "EFECTIVO" && cashAmount < total) {
                toast.error("El monto en efectivo es insuficiente")
                return
            }

            const items = cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.discount
                    ? item.price - (item.price * item.discount) / 100
                    : item.price,
            }))

            const payments = [
                {
                    paymentMethodId: selectedMethod.id,
                    amount: total,
                },
            ]

            await createSale({ items, payments })
            toast.success("Venta finalizada correctamente")
            clearSale()
            setCashAmount(0)
        } catch (err) {
            console.error("Error al guardar la venta", err)
            toast.error("Error al guardar la venta")
        }
    }

    return (
        <div className="w-full p-4 rounded-sm shadow bg-gray-100">
            <h2 className="text-2xl font-bold">Nueva Venta</h2>
            <div className="grid grid-cols-3 gap-4 p-4">
                <div className="col-span-2 flex flex-col gap-4">
                    <Input
                        placeholder="Buscar productos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className=""
                    />
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {filteredProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="cursor-pointer hover:shadow-md"
                                    onClick={() => handleAdd(product)}
                                >
                                    <CardContent className="p-3">
                                        <p className="font-semibold text-lg">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            ${(product.price - (product.discount || 0)).toFixed(2)}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>

                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold">Productos en venta</h2>
                    <ScrollArea className="h-[300px] border rounded-md p-3">
                        {cart.length === 0 ? (
                            <p className="text-muted-foreground">Ningún producto seleccionado</p>
                        ) : (
                            cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-2 py-2 border-b"
                                >
                                    <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            ${item.price - (item.discount || 0)} x
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, +e.target.value)}
                                                className="w-12 ml-1 border rounded-sm text-center"
                                            />
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                    <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold mb-2">Método de pago</h3>
                        <div className="flex gap-3 mb-3 flex-wrap">
                            {paymentMethods.map((method) => (
                                <Button
                                    key={method.id}
                                    variant={selectedMethod?.name === method.name ? 'default' : 'outline'}
                                    onClick={() => setSelectedMethod(method)}
                                >
                                    {method.name}
                                </Button>
                            ))}
                        </div>

                        {selectedMethod?.name === 'EFECTIVO' && (
                            <Input
                                placeholder="Monto recibido"
                                type="number"
                                className="mb-2"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(Number(e.target.value))}
                            />
                        )}
                    </div>
                    <div className="mt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                        {selectedMethod?.name === 'EFECTIVO' && cashAmount >= total && (
                            <div className="flex justify-between text-green-700">
                                <span>Vuelto: </span>
                                <span>${(cashAmount - total).toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex w-full justify-between">
                        <Button className="mt-2 bg-red-400" onClick={clearSale}>Cancelar Venta</Button>
                        <Button className="mt-2 bg-green-500" onClick={handleSubmit}>Confirmar Venta</Button>
                    </div>
                </div>

            </div>
        </div>
    )
}
