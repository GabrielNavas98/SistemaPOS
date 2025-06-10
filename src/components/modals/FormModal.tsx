'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/index'
import { ProductForm } from '@/components/forms/ProductForm'
import { CategoryForm } from '@/components/forms/CategoryForm'

type Mode = 'create' | 'edit'
type Type = 'product' | 'category'

interface Props {
    open: boolean
    onClose: () => void
    mode: Mode
    type: Type
    data?: Partial<FormData> & { id: string }
}

export function FormModal({ open, onClose, mode, type, data }: Props) {
    const isEdit = mode === 'edit'

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className='w-full flex justify-center'>
                        {isEdit ? `Editar ${type === 'product' ? 'producto' : 'categoría'}` : `Nuevo ${type === 'product' ? 'producto' : 'categoría'}`}
                    </DialogTitle>
                </DialogHeader>

                {type === 'product' ? (
                    <ProductForm mode={mode} data={data} onClose={onClose} />
                ) : (
                    <CategoryForm mode={mode} data={data} onClose={onClose} />
                )}
            </DialogContent>
        </Dialog>
    )
}
