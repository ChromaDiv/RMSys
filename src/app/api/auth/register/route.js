import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: new Date(), // Immediate verification
      },
    });

    return NextResponse.json(
      {
        message: 'Account created successfully!',
        userId: user.id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      {
        message: `Reg Error: ${error.message || 'Unknown'}`,
        error: error.toString(),
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
