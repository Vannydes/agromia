import { createBrowserClient } from '@supabase/ssr';

// Client-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export function createClient() {
  return supabase;
}

// Types for auth
export type User = {
  id: string;
  email: string;
  // Add other user properties as needed
};