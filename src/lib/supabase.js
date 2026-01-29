import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials required (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

let _supabase = null;

const getSupabase = () => {
  if (_supabase) return _supabase;

  // 1. Try to read from environment (preferred)
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 2. Nuclear Option: Hardcoded fallbacks specifically for Hostinger environment issues
  if (!url || url === 'undefined') url = 'https://pjlifzwsxqbeetliyniw.supabase.co';
  if (!key || key === 'undefined') key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbGlmendzeHFiZWV0bGl5bml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNDkxOTQsImV4cCI6MjA4NDkyNTE5NH0.SNc3py6WkJozjskchIdq2oAmftSB2kmoRd_2eU1GsZQ';

  if (url && key) {
    console.log('✅ Supabase initialized successfully. URL:', url.substring(0, 15) + '...');
    _supabase = createClient(url, key);
    return _supabase;
  }

  console.log('❌ Supabase Config missing. URL:', url ? 'Present' : 'Missing', 'Key:', key ? 'Present' : 'Missing');
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
