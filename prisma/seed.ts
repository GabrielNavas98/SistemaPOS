// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10)

  // Crear usuario ADMIN
  await prisma.user.upsert({
    where: { email: 'admin@local.com' },
    update: {},
    create: {
      name: 'Admin',
      lastname: 'User',
      email: 'admin@local.com',
      phone: '123456789',
      dni: '12345678',
      cuil: '20-12345678-9',
      cuit: '20-12345678-9',
      role: 'ADMIN',
      birthdate: new Date('1990-01-01'),
      accounts: {
        create: {
          provider: 'credentials',
          providerId: 'admin@local.com',
          passwordHash
        }
      }
    }
  })

  // Categorías y productos
  await prisma.category.createMany({
    data: [
      { name: 'Food', description: 'Edible items' },
      { name: 'Drinks', description: 'Beverages' },
      { name: 'Cleaning', description: 'Cleaning supplies' },
    ],
    skipDuplicates: true
  })

  const food = await prisma.category.findUnique({ where: { name: 'Food' } })
  const drinks = await prisma.category.findUnique({ where: { name: 'Drinks' } })

  if (food && drinks) {
    await prisma.product.createMany({
      data: [
        {
          name: 'Pan',
          description: 'Pan blanco',
          price: 150,
          discount: 0,
          stock: 50,
          categoryId: food.id
        },
        {
          name: 'Queso',
          description: 'Reggianito',
          price: 450,
          discount: 10,
          stock: 20,
          categoryId: food.id
        },
        {
          name: 'Soda',
          description: '500ml',
          price: 200,
          stock: 40,
          categoryId: drinks.id
        }
      ]
    })
  }

  // Métodos de pago
  await prisma.paymentMethod.createMany({
    data: [
      { name: 'EFECTIVO', description: 'Pago en efectivo' },
      { name: 'TARJETA CREDITO', description: 'Tarjeta de crédito' },
      { name: 'TARJETA DEBITO', description: 'Tarjeta de débito' },
      { name: 'QR', description: 'Pago por QR' },
      { name: 'Mercado Pago', description: 'Mercado pago' },
    ],
    skipDuplicates: true
  })

  console.log('✅ Datos iniciales cargados')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
