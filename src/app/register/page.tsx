'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Input,
    Label,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/index'; 
import { api } from '@/lib/axios';

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        dni: '',
        cuil: '',
        cuit: '', 
        role: 'SELLER', 
        address: '', 
        city: '', 
        country: '', 
        birthdate: '', 
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // Para mensajes de éxito

    // Manejador de cambios en los inputs del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null); // Limpiar mensaje de éxito previo

        // Validaciones básicas del frontend
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        // Puedes añadir más validaciones aquí (ej. email válido, contraseña mínima)

        try {
            const { data } = await api.post('/api/auth/register', {
                    name: formData.name,
                    lastname: formData.lastname,
                    email: formData.email,
                    phone: formData.phone,
                    dni: formData.dni,
                    cuil: formData.cuil,
                    cuit: formData.cuit || undefined, // Envía undefined si está vacío
                    role: formData.role, // Asegúrate de que el backend valide esto también
                    address: formData.address || undefined,
                    city: formData.city || undefined,
                    country: formData.country || undefined,
                    birthdate: formData.birthdate ? new Date(formData.birthdate).toISOString() : undefined,
                    password: formData.password,
            });

            console.log('data',data);

            setSuccess('¡Registro exitoso! Redireccionando...');
            // Opcional: Podrías intentar iniciar sesión automáticamente aquí después del registro
            // const signInRes = await signIn('credentials', {
            //   email: formData.email,
            //   password: formData.password,
            //   redirect: false,
            // });
            // if (signInRes?.ok) {
            //   router.push('/dashboard/products');
            // } else {
            //   router.push('/login');
            // }

            // Redirigir al usuario a la página de login
            setTimeout(() => {
                router.push('/login');
            }, 2000); // Pequeña demora para que el usuario vea el mensaje de éxito

        } catch (err) {
            console.error('Error al enviar el formulario:', err);
            setError('No se pudo conectar con el servidor. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-lg p-6"> {/* Aumenté el max-w-lg para más campos */}
                <CardHeader>
                    <CardTitle className="text-center">Registrar nuevo usuario</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Campos de texto */}
                            <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="lastname">Apellido</Label>
                                <Input id="lastname" name="lastname" type="text" value={formData.lastname} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="email@ejemplo.com" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="dni">DNI</Label>
                                <Input id="dni" name="dni" type="text" value={formData.dni} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="cuil">CUIL</Label>
                                <Input id="cuil" name="cuil" type="text" value={formData.cuil} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="cuit">CUIT (Opcional)</Label>
                                <Input id="cuit" name="cuit" type="text" value={formData.cuit} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="address">Dirección (Opcional)</Label>
                                <Input id="address" name="address" type="text" value={formData.address} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="city">Ciudad (Opcional)</Label>
                                <Input id="city" name="city" type="text" value={formData.city} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="country">País (Opcional)</Label>
                                <Input id="country" name="country" type="text" value={formData.country} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="birthdate">Fecha de Nacimiento (Opcional)</Label>
                                <Input id="birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} />
                            </div>

                            {/* Selector de Rol */}
                            <div>
                                <Label htmlFor="role">Rol</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="SELLER">Vendedor</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                            </div>

                            {/* Contraseñas */}
                            <div>
                                <Label htmlFor="password">Contraseña</Label>
                                <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div> {/* Fin de la grilla */}

                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                        {success && <p className="text-sm text-green-600 mt-2">{success}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}