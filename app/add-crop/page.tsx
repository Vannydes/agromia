'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cropOptions, type CropKey } from '@/lib/crops';
import { createCrop } from '@/lib/cropService';

export default function AddCropPage() {
  const router = useRouter();
  const [cropKey, setCropKey] = useState<CropKey>(cropOptions[0]?.key ?? 'pomodoro');
  const [plants, setPlants] = useState('1');
  const [transplantDate, setTransplantDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const parsedPlants = Number(plants);
      const normalizedPlants = Number.isNaN(parsedPlants) || parsedPlants < 0 ? 0 : parsedPlants;

      const cropOption = cropOptions.find(option => option.key === cropKey);
      if (!cropOption) {
        throw new Error('Coltura non valida');
      }

      await createCrop({
        name: cropOption.config.name,
        plants: normalizedPlants,
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-beige px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4 rounded-3xl border border-olive/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-olive/80">Aggiungi coltura</p>
              <h1 className="text-3xl font-semibold text-slate-900">Nuova coltura</h1>
              <p className="mt-2 text-slate-600">
                Scegli la coltura, inserisci il numero di piante e la data del trapianto.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              ← Torna indietro
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <label className="block space-y-2 text-sm font-medium text-slate-700">
              <span>Coltura</span>
              <select
                value={cropKey}
                onChange={(event) => setCropKey(event.target.value as CropKey)}
                disabled={loading}
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20 disabled:opacity-50"
              >
                {cropOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.config.name}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="Numero piante"
              type="number"
              min="0"
              value={plants}
              onChange={(event) => setPlants(event.target.value)}
              disabled={loading}
              className="text-base"
            />

            <Input
              label="Data trapianto"
              type="date"
              value={transplantDate}
              onChange={(event) => setTransplantDate(event.target.value)}
              disabled={loading}
            />

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 text-base sm:w-auto"
              >
                {loading ? 'Salvataggio...' : 'Salva coltura'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
