import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        // Optional: auto-verify if that fits the business logic, otherwise remove
        emailVerified: new Date(),
      },
    });

    const { password: newUserPassword, ...rest } = user;

    return NextResponse.json(
      { user: rest, message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error details:', error);

    // Debug: Check which DB is being used (safe mask)
    const debugUrl = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':***@') : 'UNDEFINED';

    return NextResponse.json(
      {
        message: 'Registration failed',
        error: error.message,
        details: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        debug_db: debugUrl
      },
      { status: 500 }
    );
  }
}
