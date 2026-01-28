import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  let dbStatus = 'UNKNOWN';
  let dbError = null;

  try {
    // Try to connect/query
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'CONNECTED';
  } catch (e) {
    dbStatus = 'FAILED';
    dbError = e.message;
  }

  return NextResponse.json({
    env_check: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'UNDEFINED',
      NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL || 'UNDEFINED',
      NODE_ENV: process.env.NODE_ENV,
      HAS_SECRET: !!process.env.NEXTAUTH_SECRET,
    },
    db_check: {
      status: dbStatus,
      error: dbError
    },
    message: "Check db_check.status. If FAILED, the DATABASE_URL is wrong."
  });
}
