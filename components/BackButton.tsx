'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-color bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface"
      aria-label="Torna indietro"
    >
      ← Torna indietro
    </button>
  );
}
