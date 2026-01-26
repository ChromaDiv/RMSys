import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  try { return Boolean(new URL(url)); } catch (e) { return false; }
}

export const supabase = (isValidUrl(supabaseUrl) && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

