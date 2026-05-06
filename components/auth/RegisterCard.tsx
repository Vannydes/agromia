'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RegisterCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Redirect to login or show success message
        router.push('/login?message=Controlla la tua email per confermare l\'account');
      }
    } catch (err) {
      setError('Si è verificato un errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-olive">Crea il tuo account</h1>
        <p className="mt-2 text-slate-600">Inizia a gestire il tuo orto oggi stesso.</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-5">
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
          {loading ? 'Registrazione in corso...' : 'Registrati'}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600">
        Hai già un account?{' '}
        <a href="/login" className="font-semibold text-olive hover:underline">
          Accedi
        </a>
      </p>
    </div>
  );
}