'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b border-olive/10 bg-white/95 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-olive">
          Agromia
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          {user ? (
            <>
              <span className="text-olive font-medium">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="rounded-full bg-olive px-4 py-2 text-white hover:bg-emerald-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-olive">
                Accedi
              </Link>
              <Link href="/register" className="rounded-full bg-olive px-4 py-2 text-white hover:bg-emerald-700">
                Registrati
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
