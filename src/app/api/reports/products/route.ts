import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import ExcelJS from 'exceljs'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') ?? 'day'

    const from = new Date()
    const to = new Date()

    if (period === 'month') {
        from.setDate(1)
        from.setHours(0, 0, 0, 0)
    } else {
        from.setHours(0, 0, 0, 0)
    }

    to.setHours(23, 59, 59, 999)

    // Traer productos vendidos en el rango
    const products = await prisma.product.findMany({
        where: {
            deletedAt: null,
            saleItems: {
                some: {
                    sale: {
                        createdAt: { gte: from, lte: to },
                        deletedAt: null,
                    },
                },
            },
        },
        include: {
            saleItems: {
                where: {
                    sale: {
                        createdAt: { gte: from, lte: to },
                        deletedAt: null,
                    },
                },
                select: { quantity: true },
            },
        },
    })

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Resumen ${period === 'month' ? 'Mensual' : 'Diario'}`)

    worksheet.columns = [
        { header: 'Producto', key: 'name', width: 25 },
        { header: 'Descripción', key: 'description', width: 35 },
        { header: 'Precio Lista', key: 'listPrice', width: 15 },
        { header: 'Precio Público', key: 'price', width: 15 },
        { header: 'Stock', key: 'stock', width: 10 },
        { header: 'Cantidad Vendida', key: 'ventas', width: 18 },
    ]

    products.forEach(product => {
        const totalVentas = product.saleItems.reduce((sum, item) => sum + item.quantity, 0)

        const row = worksheet.addRow({
            name: product.name,
            description: product.description || '',
            listPrice: product.listPrice,
            price: product.price,
            stock: product.stock,
            ventas: totalVentas,
        })

        // Estilo común
        row.eachCell((cell, colNumber) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' }
            if (colNumber === 3 || colNumber === 4) {
                cell.numFmt = '"$"#,##0.00'
            }
        })

        // Estilo condicional para stock
        const stockCell = row.getCell(5)
        const stock = product.stock
        stockCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: stock < 5 ? 'FFFF0000' : 'FF00CC66' },
        }
    })

    // Encabezado en negrita
    worksheet.getRow(1).font = { bold: true }

    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
        status: 200,
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="resumen-productos-${period}.xlsx"`,
        },
    })
}
