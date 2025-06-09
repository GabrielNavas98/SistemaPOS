'use client'

import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Label } from '../ui'
import { useCategoryStore } from "@/store/useCategoriesStore"
import { ComboBox } from '../ui/ComboBox'
import { useProductStore } from '@/store/useProductsStore'
import { api } from '@/lib/axios'


const schema = z.object({
    name: z.string().min(2, 'Requerido'),
    price: z.coerce.number().positive(),
    discount: z.coerce.number().min(0).max(100),
    stock: z.coerce.number().int().nonnegative(),
    categoryId: z.string().uuid('Elegí una categoría'),
    description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
    mode: 'create' | 'edit'
    data?: Partial<FormData> & { id: string }
    onClose: () => void
}

export function ProductForm({ mode, data, onClose }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            price: 0,
            discount: 0,
            stock: 0,
            categoryId: '',
            description: ''
        },
    })

    const { fetchProducts } = useProductStore()
    const { categories } = useCategoryStore()

    useEffect(() => {
        if (mode === 'edit' && data) {
            reset({ ...data })
        }
    }, [mode, data, reset])

    const onSubmit = async (values: FormData) => {
        let res
        try {
            if (mode === 'edit') {
                res = await api.put(`/api/products/${data?.id}`, {
                    name: values.name,
                    description: values.description,
                    price: values.price,
                    discount: values.discount,
                    stock: values.stock,
                    categoryId: values.categoryId
                })
            } else {
                res = await api.post(`/api/products`, {
                    name: values.name,
                    description: values.description,
                    price: values.price,
                    discount: values.discount,
                    stock: values.stock,
                    categoryId: values.categoryId
                })
            }

            if (!res) throw new Error('Error al guardar el producto')
            await fetchProducts()
            toast.success('Producto guardado correctamente')
            onClose()
        } catch (err) {
            console.log('err', err);
            toast.error('Error al guardar el producto')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className='grid w-full max-w-sm items-center gap-3'>
                <Label htmlFor='name'>Producto</Label>
                <Input {...register('name')} placeholder="Nombre del producto" id='name' />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex gap-4">
                <div className="flex-1 grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor='price'>Precio $</Label>
                    <Input id='price' type="number" step="0.01" {...register('price')} placeholder="Precio" />
                    {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                </div>
                <div className="flex-1 grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor='discount'>Descuento %</Label>
                    <Input id='discount' type="number" step="1" {...register('discount')} placeholder="Descuento %" />
                    {errors.discount && <p className="text-sm text-red-500">{errors.discount.message}</p>}
                </div>
                <div className="flex-1 grid w-full max-w-sm items-center gap-3">
                    <Label htmlFor='quantity'>Cantidad (stock)</Label>
                    <Input id='quantity' type="number" {...register('stock')} placeholder="Stock disponible" />
                    {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
                </div>
            </div>

            <div className="flex-1 grid w-full max-w-sm items-center gap-3">
                <Label htmlFor='description'>Descripción (opcional)</Label>
                <Input id='description' type="string" {...register('description')} placeholder="Descripción..." />
            </div>

            <div>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <ComboBox
                            options={categories.map((cat) => ({
                                label: cat.name,
                                value: cat.id,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Seleccionar categoría"
                        />
                    )}
                />
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {mode === 'edit' ? 'Actualizar producto' : 'Crear producto'}
            </Button>
        </form>
    )
}
