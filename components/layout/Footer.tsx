import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-emerald-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-white">Agromia</p>
          <p className="text-slate-300">© {currentYear} · v1 Beta</p>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-4 text-sm sm:justify-end">
          <Link href="/privacy-policy" className="text-slate-200 transition hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="text-slate-200 transition hover:text-white">
            Termini di Servizio
          </Link>
        </div>
      </div>
    </footer>
  );
}
