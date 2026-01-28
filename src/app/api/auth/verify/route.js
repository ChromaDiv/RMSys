import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=InvalidToken', req.url));
  }

  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.redirect(new URL('/login?error=TokenExpired', req.url));
    }

    // Verify user
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.redirect(new URL('/login?success=EmailVerified', req.url));
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.redirect(new URL('/login?error=SystemError', req.url));
  }
}
