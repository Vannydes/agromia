import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-olive/20 bg-amber-50/80 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>© Agromia {new Date().getFullYear()}</p>
          <p className="text-slate-600">Agromia v1 Beta</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link href="/privacy-policy" className="text-slate-700 hover:text-olive transition">
            Privacy Policy
          </Link>
          <Link href="/termini-di-servizio" className="text-slate-700 hover:text-olive transition">
            Termini di Servizio
          </Link>
        </div>
      </div>
    </footer>
  );
}
