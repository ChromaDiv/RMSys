import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/db';

export async function getAuthSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('supa_token')?.value;

  if (!token) {
    console.log('getAuthSession: No supa_token found in cookies');
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('getAuthSession: Supabase returned error or no user', error?.message);
      return null;
    }

    // Find Prisma user to get the Integer ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      console.log('getAuthSession: User authenticated in Supabase but not found in Prisma DB:', user.email);
      return null;
    }

    console.log('getAuthSession: Success', dbUser.email, dbUser.id);

    return {
      user: {
        id: dbUser.id, // Integer ID for legacy compatibility
        email: dbUser.email,
        name: dbUser.name,
      }
    };
  } catch (e) {
    console.error('getAuthSession Error:', e);
    return null;
  }
}
