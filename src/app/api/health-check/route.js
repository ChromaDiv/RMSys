import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics = {
    database: 'checking',
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? 'Present' : 'Missing',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
    }
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    diagnostics.database = 'connected';
    return NextResponse.json({ status: 'ok', ...diagnostics });
  } catch (error) {
    diagnostics.database = 'disconnected';
    return NextResponse.json(
      { status: 'error', ...diagnostics, message: error.message },
      { status: 500 }
    );
  }
}
