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
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);

      // Sync cookie for server-side API routes
      if (session?.access_token) {
        document.cookie = `supa_token=${session.access_token}; path=/; max-age=${session.expires_in || 3600}; SameSite=Lax`;
      } else if (_event === 'SIGNED_OUT' || !session) {
        document.cookie = 'supa_token=; path=/; max-age=0';
        setLoading(false);
      }
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
