// /app/api/reports/sales-daily/route.ts
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

export async function GET() {
  const sales = await prisma.sale.findMany({
    where: { deletedAt: null },
    select: { createdAt: true, totalAmount: true },
  })

  const grouped: Record<string, { total: number; count: number }> = {}

  for (const sale of sales) {
    const date = format(sale.createdAt, 'dd-MM-yyyy')
    if (!grouped[date]) {
      grouped[date] = { total: 0, count: 0 }
    }
    grouped[date].total += sale.totalAmount
    grouped[date].count += 1
  }

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Ventas Diarias')

  worksheet.columns = [
    { header: 'Fecha', key: 'fecha', width: 15 },
    { header: 'Total Ventas', key: 'total', width: 20 },
    { header: 'Cantidad de Ventas', key: 'cantidad', width: 22 },
  ]

  Object.entries(grouped).forEach(([date, { total, count }]) => {
    worksheet.addRow({
      fecha: date,
      total,
      cantidad: count,
    })
  })

  worksheet.eachRow((row, rowNumber) => {
    row.alignment = { vertical: 'middle', horizontal: 'center' }

    if (rowNumber > 1) {
      const cell = row.getCell(2)
      cell.numFmt = '"$"#,##0.00'
    } else {
      row.font = { bold: true }
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="ventas-diarias.xlsx"',
    },
  })
}
