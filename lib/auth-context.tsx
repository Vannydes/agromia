'use client';

import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
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

  const supabaseClient = useMemo(() => supabase, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabaseClient.auth.getSession();

      console.log('[AUTH INIT] session', session, 'error', error?.message);

      if (!error) {
        setSession(session);
        setUser(session?.user ?? null);
      }

      setLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AUTH STATE CHANGE]', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabaseClient]);

  const signIn = async (email: string, password: string) => {
    console.log('[LOGIN] attempt', email);
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[LOGIN] signInWithPassword result', { data, error });

      if (error) {
        return { error: error.message };
      }

      const session = data.session;
      const user = session?.user;

      if (!session || !user) {
        return {
          error:
            'Impossibile autenticare. Controlla email e password o conferma il tuo account.',
        };
      }

      const {
        data: { session: refreshedSession },
        error: refreshError,
      } = await supabaseClient.auth.getSession();

      console.log('[LOGIN] refreshed session', refreshedSession, refreshError);

      setSession(refreshedSession ?? session);
      setUser(refreshedSession?.user ?? user);

      return { error: null };
    } catch (err) {
      console.error('[LOGIN] signIn error', err);
      return { error: 'Si è verificato un errore durante il login' };
    }
  };

  const signOut = async () => {
    console.log('[LOGOUT] start');
    setLoading(true);
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.error('[LOGOUT] error', error.message);
    }

    setUser(null);
    setSession(null);
    setLoading(false);

    window.location.href = '/';
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