'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cropOptions, type CropKey, getAllCropOptions, type CropOption } from '@/lib/crops';
import { createCrop, getUserCustomCrops, createCustomCrop, type CustomCrop } from '@/lib/cropService';

export default function AddCropPage() {
  const router = useRouter();
  const [cropKey, setCropKey] = useState<string>(cropOptions[0]?.key ?? 'pomodoro');
  const [plants, setPlants] = useState('1');
  const [transplantDate, setTransplantDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customCrops, setCustomCrops] = useState<CustomCrop[]>([]);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSpacing, setCustomSpacing] = useState('');
  const [customMinYield, setCustomMinYield] = useState('');
  const [customMaxYield, setCustomMaxYield] = useState('');
  const [customLoading, setCustomLoading] = useState(false);

  const [customCrops, setCustomCrops] = useState<CustomCrop[]>([]);
  const allCropOptions = getAllCropOptions(customCrops);

  useEffect(() => {
    async function loadCustomCrops() {
      try {
        const crops = await getUserCustomCrops();
        setCustomCrops(crops);
      } catch (err) {
        console.error('Error loading custom crops:', err);
      }
    }
    loadCustomCrops();
  }, []);
    event.preventDefault();
    setCustomLoading(true);

    try {
      const spacing = Number(customSpacing);
      const minYield = Number(customMinYield);
      const maxYield = Number(customMaxYield);

      if (!customName.trim()) throw new Error('Nome coltura obbligatorio');
      if (isNaN(spacing) || spacing <= 0) throw new Error('Spaziatura deve essere un numero positivo');
      if (isNaN(minYield) || minYield < 0) throw new Error('Produzione minima deve essere un numero non negativo');
      if (isNaN(maxYield) || maxYield < minYield) throw new Error('Produzione massima deve essere maggiore o uguale alla minima');

      const newCustomCrop = await createCustomCrop({
        name: customName.trim(),
        spacing_cm: spacing,
        min_yield: minYield,
        max_yield: maxYield,
      });

      setCustomCrops(prev => [newCustomCrop, ...prev]);
      setCropKey(`custom-${newCustomCrop.id}`);
      setShowCustomForm(false);
      setCustomName('');
      setCustomSpacing('');
      setCustomMinYield('');
      setCustomMaxYield('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio della coltura personalizzata');
    } finally {
      setCustomLoading(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const parsedPlants = Number(plants);
      const normalizedPlants = Number.isNaN(parsedPlants) || parsedPlants < 0 ? 0 : parsedPlants;

      const cropOption = allCropOptions.find(option => option.key === cropKey);
      if (!cropOption) {
        throw new Error('Coltura non valida');
      }

      const customCropId = cropOption.isCustom ? cropOption.key.replace('custom-', '') : null;

      await createCrop({
        name: cropOption.config.name,
        plants: normalizedPlants,
        custom_crop_id: customCropId,
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
                onChange={(event) => setCropKey(event.target.value)}
                disabled={loading}
                className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20 disabled:opacity-50"
              >
                {allCropOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.config.name}{option.isCustom ? ' 🌱 Personalizzata' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Non trovi la tua coltura? Creala manualmente.
              </p>
            </label>

            <button
              type="button"
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="text-sm text-olive hover:text-emerald-700 font-medium transition"
            >
              + Aggiungi coltura manualmente
            </button>

            {showCustomForm && (
              <div className="mt-4 p-4 bg-olive/5 rounded-2xl border border-olive/20">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Aggiungi coltura personalizzata</h3>
                <form onSubmit={handleSaveCustomCrop} className="space-y-4">
                  <Input
                    label="Nome coltura"
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    disabled={customLoading}
                    required
                  />
                  <Input
                    label="Spaziatura (cm)"
                    type="number"
                    min="1"
                    value={customSpacing}
                    onChange={(e) => setCustomSpacing(e.target.value)}
                    disabled={customLoading}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Produzione minima stimata per pianta (kg)"
                      type="number"
                      min="0"
                      step="0.1"
                      value={customMinYield}
                      onChange={(e) => setCustomMinYield(e.target.value)}
                      disabled={customLoading}
                      required
                    />
                    <Input
                      label="Produzione massima stimata per pianta (kg)"
                      type="number"
                      min="0"
                      step="0.1"
                      value={customMaxYield}
                      onChange={(e) => setCustomMaxYield(e.target.value)}
                      disabled={customLoading}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={customLoading}
                      className="flex-1 sm:flex-none"
                    >
                      {customLoading ? 'Salvataggio...' : 'Salva coltura'}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowCustomForm(false)}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      Annulla
                    </Button>
                  </div>
                </form>
              </div>
            )}

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
