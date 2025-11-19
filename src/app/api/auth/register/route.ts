import { NextRequest, NextResponse } from 'next/server';
import dbConnection from '@/lib/database';
import User from '@/database/models/users';

export async function POST(request: NextRequest) {
  try {
    // Conectar a la base de datos
    await dbConnection();

    // Obtener datos del body
    const { name, email, username, password } = await request.json();

    // Validar que vengan todos los campos
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validar longitud del username
    if (username.trim().length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email' },
        { status: 400 }
      );
    }

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

