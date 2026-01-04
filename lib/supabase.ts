import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Only validate at runtime, not build time
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

// Only log warning on server-side at runtime
if (typeof window === 'undefined' && !supabaseServiceKey && process.env.NODE_ENV !== 'production') {
  console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Admin operations will fail.');
}

// Client for public read operations (uses anon key, respects RLS)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Admin client for API routes (uses service role key, bypasses RLS)
// Only create admin client server-side
export const supabaseAdmin = typeof window === 'undefined' && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if service key is missing or on client-side

