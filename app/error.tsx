'use client';

import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-beige px-4 py-10 text-primary">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-border-color bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Qualcosa è andato storto</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Abbiamo incontrato un problema con la pagina. Puoi riprovare o tornare alla home.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center rounded-full border border-border-color bg-olive/10 px-5 py-3 text-sm font-semibold text-olive transition hover:bg-olive/20"
          >
            Riprova
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border-color bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-surface"
          >
            Vai alla home
          </Link>
        </div>
        <pre className="mt-6 overflow-x-auto rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
          {error.message}
        </pre>
      </div>
    </main>
  );
}
