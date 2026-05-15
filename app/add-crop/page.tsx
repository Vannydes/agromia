'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cropOptions, getAllCropOptions } from '@/lib/crops';
import {
  createCrop,
  getUserCustomCrops,
  createCustomCrop,
  type CustomCrop,
} from '@/lib/cropDataService';

export default function AddCropPage() {
  const router = useRouter();
  const [cropKey, setCropKey] = useState<string>(cropOptions[0]?.key ?? 'pomodoro');
  const [plants, setPlants] = useState('1');
  const [transplantDate, setTransplantDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [customCrops, setCustomCrops] = useState<CustomCrop[]>([]);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customSpacing, setCustomSpacing] = useState('');
  const [customMinYield, setCustomMinYield] = useState('');
  const [customMaxYield, setCustomMaxYield] = useState('');

  const allCropOptions = getAllCropOptions(customCrops);

  useEffect(() => {
    async function loadCustomCrops() {
      try {
        const crops = await getUserCustomCrops();
        setCustomCrops(crops);
      } catch {
        setError('Impossibile caricare le colture personalizzate. Riprova più tardi.');
      }
    }
    loadCustomCrops();
  }, []);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const parsedPlants = Number(plants);
      const normalizedPlants = Number.isNaN(parsedPlants) || parsedPlants < 0 ? 0 : parsedPlants;

      let cropName: string;
      let customCropId: string | null = null;

      if (isCreatingCustom) {
        if (!customName.trim()) {
          throw new Error('Nome coltura obbligatorio');
        }

        const newCustomCrop = await createCustomCrop({
          name: customName.trim(),
          spacing_cm: customSpacing ? Number(customSpacing) : 50, // default 50cm
          min_yield: customMinYield ? Number(customMinYield) : 1, // default 1kg
          max_yield: customMaxYield ? Number(customMaxYield) : 5, // default 5kg
        });

        cropName = newCustomCrop.name;
        customCropId = newCustomCrop.id;

        // Aggiorna lista custom crops per refresh immediato
        setCustomCrops(prev => [newCustomCrop, ...prev]);
      } else {
        // Coltura standard
        const cropOption = allCropOptions.find(option => option.key === cropKey);
        if (!cropOption) {
          throw new Error('Coltura non valida');
        }
        cropName = cropOption.config.name;
        customCropId = cropOption.isCustom ? cropOption.key.replace('custom-', '') : null;
      }

      await createCrop({
        name: cropName,
        plants: normalizedPlants,
        custom_crop_id: customCropId,
        transplant_date: transplantDate || null,
        selling_price: null,
      });

      setSuccessMessage('Coltura creata con successo. Reindirizzamento alla dashboard...');
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      console.error('[AddCrop] Error saving crop:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToCustom = () => {
    setIsCreatingCustom(true);
    setCropKey(''); // Reset select
  };

  const handleCancelCustom = () => {
    setIsCreatingCustom(false);
    setCustomName('');
    setCustomSpacing('');
    setCustomMinYield('');
    setCustomMaxYield('');
    setCropKey(cropOptions[0]?.key ?? 'pomodoro'); // Reset to first option
  };

  return (
    <main className="min-h-screen bg-beige px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4 rounded-3xl border border-olive/15 bg-white p-6 shadow-sm">
          {successMessage ? (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              {successMessage}
            </div>
          ) : null}
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
              {!isCreatingCustom ? (
                <>
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
                </>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Nome coltura"
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="es. Basilico, Fragola, Melanzana..."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Spaziatura (cm)"
                      type="number"
                      min="1"
                      value={customSpacing}
                      onChange={(e) => setCustomSpacing(e.target.value)}
                      disabled={loading}
                      placeholder="50"
                    />
                    <Input
                      label="Prod. min (kg/pianta)"
                      type="number"
                      min="0"
                      step="0.1"
                      value={customMinYield}
                      onChange={(e) => setCustomMinYield(e.target.value)}
                      disabled={loading}
                      placeholder="1.0"
                    />
                    <Input
                      label="Prod. max (kg/pianta)"
                      type="number"
                      min="0"
                      step="0.1"
                      value={customMaxYield}
                      onChange={(e) => setCustomMaxYield(e.target.value)}
                      disabled={loading}
                      placeholder="5.0"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Solo il nome è obbligatorio. Gli altri campi sono opzionali e possono essere lasciati vuoti.
                  </p>
                </div>
              )}
            </label>

            {!isCreatingCustom ? (
              <button
                type="button"
                onClick={handleSwitchToCustom}
                className="text-sm text-olive hover:text-emerald-700 font-medium transition"
              >
                + Aggiungi coltura manualmente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelCustom}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium transition"
              >
                ← Torna alle colture esistenti
              </button>
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
