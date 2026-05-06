import { createBrowserClient } from '@supabase/ssr';

// Client-side Supabase client
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Types for auth
export type User = {
  id: string;
  email: string;
  // Add other user properties as needed
};