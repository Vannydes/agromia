'use client';

import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const supabaseClient = useMemo(() => supabase, []);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('[Auth] session load start');

      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      if (error) {
        console.error('[Auth] session load error:', error.message);
      }

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      console.log('[Auth] session loaded', session?.user?.email ?? 'no user');
    };

    initializeAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        console.log('[Auth] auth state change', event, session?.user?.email ?? 'no user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const signIn = async (email: string, password: string) => {
    console.log('[Auth] login start', { email });

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[Auth] login error', error.message);
        return { error: error.message };
      }

      const session = data.session;
      const user = session?.user;

      if (!session || !user) {
        console.error('[Auth] login error no session returned');
        return {
          error:
            'Impossibile autenticare. Controlla email e password o conferma il tuo account.',
        };
      }

      setSession(session);
      setUser(user);
      console.log('[Auth] login success', user.email);
      return { error: null };
    } catch (err) {
      console.error('[Auth] login exception', err);
      return { error: 'Si è verificato un errore durante il login' };
    }
  };

  const signOut = async () => {
    console.log('[Auth] sign out start');
    setLoading(true);
    await supabaseClient.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
    console.log('[Auth] sign out complete');
    router.push('/');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}