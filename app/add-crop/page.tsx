'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type UserCrop } from '@/lib/userCrops';
import { cropOptions, type CropKey } from '@/lib/crops';

type SearchResult = {
  cropKey: CropKey;
  cropName: string;
  variety: string;
};

const USER_CROPS_STORAGE_KEY = 'userCrops';

function getUserCropsFromStorage(): UserCrop[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(USER_CROPS_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUserCropsToStorage(crops: UserCrop[]) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(USER_CROPS_STORAGE_KEY, JSON.stringify(crops));
}

function addUserCropToStorage(crop: UserCrop) {
  const current = getUserCropsFromStorage();
  const next = [...current, crop];
  saveUserCropsToStorage(next);
}

export default function AddCropPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropKey, setSelectedCropKey] = useState<CropKey>(cropOptions[0]?.key ?? 'pomodoro');
  const [selectedVariety, setSelectedVariety] = useState<string>(cropOptions[0]?.config.varieties[0] ?? '');
  const [plants, setPlants] = useState('1');
  const [manualMode, setManualMode] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualSpacing, setManualSpacing] = useState('');
  const [manualYieldMin, setManualYieldMin] = useState('');
  const [manualYieldMax, setManualYieldMax] = useState('');
  const [validationError, setValidationError] = useState('');

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const searchResults = useMemo<SearchResult[]>(() => {
    return cropOptions.flatMap((option) =>
      option.config.varieties.map((variety) => ({
        cropKey: option.key,
        cropName: option.config.name,
        variety
      }))
    );
  }, []);

  const filteredResults = useMemo(() => {
    if (!normalizedSearch) {
      return searchResults;
    }

    return searchResults.filter((item) =>
      item.cropName.toLowerCase().includes(normalizedSearch) ||
      item.variety.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, searchResults]);

  const activeSelection = `${selectedCropKey}-${selectedVariety}`;
  const showNoResults = normalizedSearch.length > 0 && filteredResults.length === 0;

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError('');

    const parsedPlants = Number(plants);
    if (Number.isNaN(parsedPlants) || parsedPlants <= 0) {
      setValidationError('Inserisci un numero di piante maggiore di zero.');
      return;
    }

    const cropId = Date.now();
    const createdAt = new Date().toISOString();
    const normalizedPlants = parsedPlants;

    const existingCrops = getUserCropsFromStorage();
    const option = cropOptions.find((item) => item.key === selectedCropKey);

    const newCrop: UserCrop = {
      id: cropId,
      cropKey: manualMode ? `custom-${cropId}` : selectedCropKey,
      varietyKey: manualMode ? manualName.trim() || 'manual' : selectedVariety,
      plants: normalizedPlants,
      costs: [],
      harvests: [],
      name: manualMode ? manualName.trim() || 'Coltura personalizzata' : option?.config.name ?? selectedCropKey,
      spacing: manualMode ? Number(manualSpacing) || 0 : option?.config.spacing ?? 0,
      yieldMin: manualMode ? Number(manualYieldMin) || 0 : option?.config.yieldMin ?? 0,
      yieldMax: manualMode ? Number(manualYieldMax) || 0 : option?.config.yieldMax ?? 0,
      createdAt,
      pricePerKg: 2.5, // Default price
      events: []
    };

    saveUserCropsToStorage([...existingCrops, newCrop]);
    router.push('/dashboard');
  };

  const handleSelectResult = (result: SearchResult) => {
    setSelectedCropKey(result.cropKey);
    setSelectedVariety(result.variety);
    setManualMode(false);
  };

  const handleAutoComplete = () => {
    setManualSpacing('50');
    setManualYieldMin('2');
    setManualYieldMax('4');
  };

  return (
    <main className="min-h-screen bg-beige px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4 rounded-3xl border border-olive/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-olive/80">Aggiungi coltura</p>
              <h1 className="text-3xl font-semibold text-slate-900">Nuova coltura</h1>
              <p className="mt-2 text-slate-600">
                Cerca una coltura, seleziona varietà o inserisci un nuovo valore manuale.
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
            <Input
              label="Cerca coltura"
              id="crop-search"
              placeholder="Cerca coltura (es. pomodoro, zucchina...)"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="text-base"
            />

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 pb-3">
                <p className="text-sm font-semibold text-slate-800">Risultati</p>
                {!manualMode && (
                  <button
                    type="button"
                    onClick={() => setManualMode(true)}
                    className="rounded-full border border-olive/20 bg-olive/10 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/20"
                  >
                    Inserisci manualmente
                  </button>
                )}
              </div>
              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {filteredResults.map((result) => {
                  const isActive = activeSelection === `${result.cropKey}-${result.variety}` && !manualMode;
                  return (
                    <button
                      key={`${result.cropKey}-${result.variety}`}
                      type="button"
                      onClick={() => handleSelectResult(result)}
                      className={`w-full rounded-3xl border px-4 py-4 text-left transition ${
                        isActive
                          ? 'border-olive bg-olive/10 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-olive/50 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-900">{result.cropName}</p>
                      <p className="mt-1 text-sm text-slate-600">{result.variety}</p>
                    </button>
                  );
                })}

                {showNoResults && (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-4 text-center">
                    <p className="text-sm font-medium text-slate-900">Coltura non trovata</p>
                    <p className="mt-2 text-sm text-slate-600">Puoi inserire una nuova coltura manualmente.</p>
                    <div className="mt-4">
                      <Button type="button" onClick={() => setManualMode(true)} className="w-full">
                        + Inserisci manualmente
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!manualMode && (
              <div className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Selezione attiva</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  {cropOptions.find((option) => option.key === selectedCropKey)?.config.name} → {selectedVariety}
                </p>
              </div>
            )}

            {manualMode && (
              <div className="space-y-4 rounded-3xl border border-olive/15 bg-olive/10 p-4">
                <p className="text-sm uppercase tracking-[0.3em] text-olive-700">Modalità manuale</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Nome coltura"
                    type="text"
                    value={manualName}
                    onChange={(event) => setManualName(event.target.value)}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Suggerimenti AI</p>
                    <Button type="button" onClick={handleAutoComplete} className="w-full">
                      Auto-complete with AI
                    </Button>
                  </div>
                </div>

                {(manualSpacing || manualYieldMin || manualYieldMax) && (
                  <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Suggested values</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Spaziatura suggerita (cm)"
                        type="number"
                        min="0"
                        step="1"
                        value={manualSpacing}
                        onChange={(event) => setManualSpacing(event.target.value)}
                      />
                      <Input
                        label="Resa minima (kg)"
                        type="number"
                        min="0"
                        step="0.1"
                        value={manualYieldMin}
                        onChange={(event) => setManualYieldMin(event.target.value)}
                      />
                      <Input
                        label="Resa massima (kg)"
                        type="number"
                        min="0"
                        step="0.1"
                        value={manualYieldMax}
                        onChange={(event) => setManualYieldMax(event.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <Input
              label="Numero piante"
              type="number"
              min="0"
              value={plants}
              onChange={(event) => {
                setPlants(event.target.value);
                setValidationError('');
              }}
              className="text-base"
            />

            {validationError && (
              <p className="text-sm text-red-700">{validationError}</p>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="w-full px-6 py-4 text-base sm:w-auto">
                Salva coltura
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
