import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/database';
import User from '@/database/models/users';
import { registerSchema } from '@/lib/authSchemas';
import { sendEmail } from '@/lib/email';
import { welcomeEmailTemplate } from '@/lib/emailTemplates/welcome';

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnection();

    // Obtener datos del body
    const body = await request.json();

    // Validar datos con Yup
    try {
      await registerSchema.validate(body);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || 'Error de validación' },
        { status: 400 }
      );
    }

    const { name, email, username, password } = body;

    // Verificar si ya existe el username
    const existingUsername = await User.findOne({
      username: username.toLowerCase().trim()
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Verificar si ya existe el email
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Crear nuevo usuario (SIEMPRE como Customer)
    const newUser = await User.create({
      username: username.toLowerCase().trim(),
      password, // TODO: Hashear con bcrypt en el futuro
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'Customer', // HARDCODED - solo customers desde el registro
      isActive: true,
    });

    // Enviar email de bienvenida al nuevo usuario
    try {
      await sendEmail({
        to: newUser.email,
        subject: '¡Bienvenido a Techland! 🎉',
        html: welcomeEmailTemplate(newUser.name),
      });
    } catch (emailError) {
      console.error('Error enviando email de bienvenida:', emailError);
      // No fallar el registro si el email falla
    }

    // Retornar datos del usuario creado (sin la contraseña)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser._id,
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isActive: newUser.isActive,
        },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

