import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics = {
    steps: [],
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      DATABASE_URL: process.env.DATABASE_URL ? 'Present' : 'Missing'
    }
  };

  try {
    // 1. Check Cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('supa_token')?.value;
    diagnostics.steps.push({
      step: 'Cookie Check',
      status: token ? 'Found' : 'Missing',
      tokenLength: token?.length,
      sample: token ? token.substring(0, 10) + '...' : 'N/A'
    });

    if (!token) {
      return NextResponse.json({ status: 'Failed', reason: 'No supa_token cookie found. Browser is not sending the cookie.', diagnostics });
    }

    // 2. Check Supabase Identity
    diagnostics.steps.push({ step: 'Supabase getUser', status: 'Attempting' });
    let user = null;
    let authError = null;

    try {
      const result = await supabase.auth.getUser(token);
      user = result.data.user;
      authError = result.error;
      diagnostics.steps.push({
        step: 'Supabase Result',
        userFound: !!user,
        email: user?.email,
        error: authError?.message || null
      });
    } catch (sbError) {
      diagnostics.steps.push({ step: 'Supabase Crash', error: sbError.message });
      return NextResponse.json({ status: 'Failed', reason: 'Supabase client crashed during validation', diagnostics });
    }

    if (!user) {
      return NextResponse.json({ status: 'Failed', reason: 'Token invalid or Supabase rejected it.', diagnostics });
    }

    // 3. Check Prisma Database
    diagnostics.steps.push({ step: 'Prisma Lookup', email: user.email });
    let dbUser = null;

    try {
      dbUser = await prisma.user.findUnique({ where: { email: user.email } });
      diagnostics.steps.push({ step: 'Prisma Result', found: !!dbUser, id: dbUser?.id });
    } catch (dbError) {
      diagnostics.steps.push({ step: 'Prisma Find Crash', error: dbError.message });
    }

    if (!dbUser) {
      diagnostics.steps.push({ step: 'Prisma Create', status: 'Attempting Lazy Sync' });
      try {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.user_metadata?.full_name || 'Debug User'
          }
        });
        diagnostics.steps.push({ step: 'Prisma Create Success', id: dbUser.id });
      } catch (createError) {
        diagnostics.steps.push({ step: 'Prisma Create Failed', error: createError.message });
        return NextResponse.json({ status: 'Failed', reason: 'User authenticated but failed to create DB record', diagnostics });
      }
    }

    return NextResponse.json({ status: 'Success', message: 'Auth flow is perfectly valid.', user: dbUser, diagnostics });

  } catch (error) {
    return NextResponse.json({ status: 'Crash', error: error.message, stack: error.stack, diagnostics });
  }
}
