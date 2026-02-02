import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Basic Connection Check
    console.log('Testing DB Connection...');

    // 2. Simple Query
    const userCount = await prisma.user.count();

    // 3. Return Success
    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      userCount: userCount,
      environment: {
        node_env: process.env.NODE_ENV,
        database_url_configured: !!process.env.DATABASE_URL
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });

  } catch (error) {
    console.error('DB Check Failed:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }
}
