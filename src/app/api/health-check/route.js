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

    // Check if tables exist
    try {
      diagnostics.schema = {
        users: await prisma.user.count().catch(() => 'Missing'),
        categories: await prisma.category.count().catch(() => 'Missing'),
        menu: await prisma.menu.count().catch(() => 'Missing'),
        orders: await prisma.order.count().catch(() => 'Missing'),
      };
    } catch (schemaErr) {
      diagnostics.schema = 'Error checking schema: ' + schemaErr.message;
    }

    return NextResponse.json({ status: 'ok', ...diagnostics });
  } catch (error) {
    diagnostics.database = 'disconnected';
    return NextResponse.json(
      { status: 'error', ...diagnostics, message: error.message },
      { status: 500 }
    );
  }
}
