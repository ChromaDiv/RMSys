import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/lib/db';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getAuthSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('supa_token')?.value;

  if (!token) return null;

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    // Find Prisma user to get the Integer ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) return null;

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
