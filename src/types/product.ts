export interface Category {
    id: string
    name: string
    description?: string
    createdAt: string
    deletedAt?: string | null
}

export interface Product {
    id: string
    name: string
    description?: string
    price: number
    discount?: number
    stock: number
    category?: Category
    categoryId?: string
    createdAt: string
    deletedAt?: string | null
}

export interface ProductFormInput {
    name: string
    description?: string
    price: number | string
    discount?: number | string
    stock: number | string
    categoryId?: string
}
