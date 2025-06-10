import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

export async function POST(req: Request) {
    console.log('aca', req);
    try {
        const {
            name,
            lastname,
            email,
            phone,
            dni,
            cuil,
            cuit,      // Campo opcional
            role,      // Debe ser 'ADMIN' o 'SELLER'
            address,   // Campo opcional
            city,      // Campo opcional
            country,   // Campo opcional
            birthdate, // Campo opcional (puede venir como string, se parseará a Date)
            password
        } = await req.json();
        console.log('name',name);

        // 1. Validaciones básicas de campos obligatorios
        if (!name || !lastname || !email || !phone || !dni || !cuil || !role || !password) {
            console.log('aaaa');
            return NextResponse.json({ error: 'Faltan campos obligatorios para el registro.' }, { status: 400 });
        }

        // Validación de formato de email simple
        if (!/\S+@\S+\.\S+/.test(email)) {
            console.log('bbbb');
            return NextResponse.json({ error: 'El formato del email no es válido.' }, { status: 400 });
        }

        // Validar el rol: Asegura que el rol recibido sea uno de los valores del enum UserRole
        const normalizedRole = role.toUpperCase();
        if (!Object.values(UserRole).includes(normalizedRole as UserRole)) {
            return NextResponse.json({ error: 'El rol de usuario no es válido. Debe ser ADMIN o SELLER.' }, { status: 400 });
        }

        // 2. Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Este email ya está registrado.' }, { status: 409 }); // 409 Conflict
        }

        // 3. Hashear la contraseña
        // Se recomienda usar una variable de entorno para BCRYPT_SALT_ROUNDS
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Crear el Usuario y la Cuenta en una transacción
        // Esto asegura que ambas operaciones se completen exitosamente o ninguna lo haga
        const newUser = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data: {
                    name,
                    lastname,
                    email,
                    phone,
                    dni,
                    cuil,
                    cuit,
                    role: normalizedRole as UserRole, // Asigna el rol validado
                    address,
                    city,
                    country,
                    // Si birthdate viene como string, convertirlo a Date
                    birthdate: birthdate ? new Date(birthdate) : undefined,
                },
            });

            await tx.account.create({
                data: {
                    userId: createdUser.id,
                    provider: 'credentials',
                    providerId: email, // Usamos el email como providerId para el provider 'credentials'
                    passwordHash: hashedPassword,
                },
            });

            return createdUser; // Retornamos el usuario creado para generar el token
        });

        // 5. Generar un token JWT para la sesión (similar al login)
        const token = jwt.sign(
            {
                userId: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            process.env.JWT_SECRET!, // Asegúrate de tener JWT_SECRET en tus variables de entorno
            { expiresIn: '1d' } // El token expira en 1 día
        );

        // Retorna una respuesta de éxito con el token
        return NextResponse.json({ message: 'Usuario registrado exitosamente', token }, { status: 201 }); // 201 Created

    } catch (error) {
        console.error('Error durante el registro de usuario:', error);
        // Manejo genérico de errores del servidor
        return NextResponse.json({ error: 'Ocurrió un error interno del servidor durante el registro.' }, { status: 500 });
    }
}