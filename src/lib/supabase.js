import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials required (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

let _supabase = null;

const getSupabase = () => {
  if (_supabase) return _supabase;

  // Re-read from process.env to pick up inlined values from next.config.mjs at runtime
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    console.log('✅ Supabase initialized successfully');
    _supabase = createClient(url, key);
    return _supabase;
  }

  const configurationError = new Error('Supabase is not configured. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment or next.config.mjs and that you have REDEPLOYED.');

  // Comprehensive mock to prevent crashes throughout the app
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({ data: { session: null }, error: configurationError }),
      signUp: async () => ({ data: { session: null }, error: configurationError }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: configurationError }),
          order: () => ({ data: [], error: configurationError }),
        }),
        order: () => ({ data: [], error: configurationError }),
      }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: configurationError }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: configurationError }) }) }) }),
      delete: () => ({ eq: async () => ({ error: configurationError }) }),
    }),
    storage: { from: () => ({ upload: async () => ({ error: configurationError }), getPublicUrl: () => ({ data: { publicUrl: null } }) }) }
  };
};

export const supabase = new Proxy({}, {
  get: (target, prop) => {
    return getSupabase()[prop];
  }
});
