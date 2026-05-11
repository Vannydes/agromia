'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email.trim() || !password) {
      setError('Inserisci email e password per accedere.');
      setLoading(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(email.trim(), password);

      if (signInError) {
        setError(signInError);
        setLoading(false);
        return;
      }

      router.replace('/dashboard');
    } catch {
      setError('Si è verificato un errore durante il login. Riprova più tardi.');
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