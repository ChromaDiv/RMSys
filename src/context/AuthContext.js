'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const syncCookie = (session) => {
      if (session?.access_token) {
        console.log('AuthContext: Setting supa_token cookie', session.access_token.substring(0, 10) + '...');
        document.cookie = `supa_token=${session.access_token}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax`;
      } else {
        console.log('AuthContext: Clearing supa_token cookie');
        document.cookie = 'supa_token=; path=/; max-age=0';
      }
    };

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      syncCookie(session);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      syncCookie(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    status: loading ? 'loading' : session ? 'authenticated' : 'unauthenticated',
    signOut: () => supabase.auth.signOut(),
    signInWithPassword: (credentials) => supabase.auth.signInWithPassword(credentials),
    signUp: (credentials) => supabase.auth.signUp(credentials),
    // Compatibility with NextAuth useSession structure
    data: session ? {
      user: {
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
        email: session.user.email,
        image: session.user.user_metadata?.avatar_url,
        id: session.user.id
      }
    } : null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useSession = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return context;
};

// Compatibility export
export const signOut = async (options) => {
  await supabase.auth.signOut();
  if (options?.callbackUrl) {
    window.location.href = options.callbackUrl;
  }
};
