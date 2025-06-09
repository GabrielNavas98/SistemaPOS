'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Button, Label } from '@/components/ui/index'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { useCategoryStore } from '@/store/useCategoriesStore'

const schema = z.object({
    name: z.string().min(2, 'Nombre requerido'),
    description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
    mode: 'create' | 'edit'
    data?: Partial<FormData> & { id: string }
    onClose: () => void
}

export function CategoryForm({ mode, data, onClose }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            description: '',
        },
    })

  const { fetchCategories } = useCategoryStore()

    useEffect(() => {
        if (mode === 'edit' && data) {
            reset({ ...data })
        }
    }, [mode, data, reset])

    const onSubmit = async (values: FormData) => {
        try {
            let res
            if (mode === 'edit') {
                res = await api.put(`/api/categories/${data?.id}`, {
                    name: values.name,
                    description: values.description
                })
            } else {
                res = await api.post(`/api/categories`, {
                    name: values.name,
                    description: values.description,
                })
            }
            if (!res) throw new Error('Error al guardar la categoría')
            await fetchCategories()
            toast.success('Categoría guardada correctamente')
            onClose()
        } catch (err) {
            console.log('err', err);
            toast.error('Error al guardar la categoría')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className='grid w-full max-w-sm items-center gap-3'>
                <Label htmlFor='name'>Categoría: </Label>
                <Input id='name' {...register('name')} placeholder="Nombre de la categoría" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className='grid w-full max-w-sm items-center gap-3'>
                <Label htmlFor='description'>Descripción: </Label>
                <Input id='description' {...register('description')} placeholder="Descripción (opcional)" />
                {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {mode === 'edit' ? 'Actualizar categoría' : 'Crear categoría'}
            </Button>
        </form>
    )
}
