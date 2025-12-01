import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/database';
import User from '@/database/models/users';
import { loginSchema } from '@/lib/authSchemas';

export async function POST(request: NextRequest) {
    try {
        // Conectar a la base de datos
        await dbConnection();

        // Obtener datos del body
        const body = await request.json();

        // Validar datos con Yup
        try {
            await loginSchema.validate(body);
        } catch (error: any) {
            return NextResponse.json(
                { error: error.message || 'Error de validación' },
                { status: 400 }
            );
        }

        const { username, password } = body;

        // Buscar usuario en la base de datos
        const user = await User.findOne({
            username: username.toLowerCase().trim()
        });

        // Validar si el usuario existe
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Validar contraseña (por ahora sin hash)
        // TODO: Implementar bcrypt cuando se hasheen las contraseñas
        if (user.password !== password) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Validar si el usuario está activo
        if (!user.isActive) {
            return NextResponse.json(
                { error: 'Account is inactive. Contact support.' },
                { status: 403 }
            );
        }

        // Login exitoso - retornar datos del usuario (sin la contraseña)
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

