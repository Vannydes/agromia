'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const session = data?.session;
      const user = session?.user;

      if (!session || !user) {
        setError('Impossibile autenticare. Controlla email e password o conferma il tuo account.');
        return;
      }

      // Ensure the client session is persisted before redirecting
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        setError('Errore nel recupero della sessione. Riprova.');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Si è verificato un errore durante il login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-olive">Accedi al tuo account</h1>
        <p className="mt-2 text-slate-600">Usa email e password per iniziare.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-5">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="esempio@agromia.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Accesso in corso...' : 'Accedi'}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Non hai ancora un account?{' '}
        <a href="/register" className="font-semibold text-olive hover:underline">
          Registrati
        </a>
      </p>
    </div>
  );
}