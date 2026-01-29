import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/db';

export async function getAuthSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('supa_token')?.value;

  if (!token) {
    // console.log('getAuthSession: No supa_token found in cookies');
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('getAuthSession: Supabase auth error or user missing:', error?.message);
      return null;
    }

    // Attempt to find or CREATE the user in Prisma (Lazy Sync)
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      console.log('getAuthSession: Syncing Supabase user to Prisma DB:', user.email);
      try {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
          }
        });
        console.log('getAuthSession: Successfully created Prisma user:', dbUser.id);
      } catch (createError) {
        console.error('getAuthSession: Failed to create Prisma user:', createError.message);
        // If creation fails (e.g. unique constraint or DB error), we might still want to proceed if it was a race condition
        dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        if (!dbUser) return null;
      }
    }

    // console.log('getAuthSession: Success', dbUser.email, dbUser.id);

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
      }
    };
  } catch (e) {
    console.error('getAuthSession Critical Error:', e.message);
    return null;
  }
}
