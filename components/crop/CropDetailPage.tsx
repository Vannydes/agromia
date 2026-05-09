'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatKg, formatCurrency } from '@/lib/formatting';
import { getCurrentWeather, type Weather } from '@/lib/weather';
import { getAdvice } from '@/lib/advice';
import { getSmartSuggestions } from '@/lib/rulesEngine';
import { useAuth } from '@/lib/auth-context';
import { getCropById, deleteCrop } from '@/lib/cropService';
import { crops } from '@/lib/crops';
import type { CropEvent } from '@/lib/userCrops';
import type { Crop } from '@/lib/cropService';

type CropDetail = Crop & {
  spacing: number;
  yieldMin: number;
  yieldMax: number;
  pricePerKg: number;
  costs: Array<{ note: string; amount: number }>;
  harvests: Array<{ date: string; kg: number }>;
  events: CropEvent[];
};

function getCropConfigByName(name: string) {
  return Object.values(crops).find((config) => config.name === name);
}

function createCropDetail(crop: Crop): CropDetail {
  const config = getCropConfigByName(crop.name);

  return {
    ...crop,
    spacing: config?.spacing ?? 50,
    yieldMin: config?.yieldMin ?? 3,
    yieldMax: config?.yieldMax ?? 6,
    pricePerKg: 2.5,
    costs: [],
    harvests: [],
    events: [],
  };
}

export default function CropPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.id;
  const cropIdFromParams = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? '';

  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [kgValue, setKgValue] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [costNote, setCostNote] = useState('');
  const [error, setError] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [eventType, setEventType] = useState<CropEvent['type']>('trapianto');
  const [activityDate, setActivityDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadCrop = async () => {
      console.log('Crop page params.id', cropIdFromParams);
      if (authLoading) return;
      if (!user || !cropIdFromParams) {
        console.log('Crop page missing user or id', { user: !!user, cropIdFromParams });
        setCrop(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setFetchError(null);

      try {
        const data = await getCropById(cropIdFromParams);
        console.log('Fetched crop', data);

        if (!data) {
          setCrop(null);
          setFetchError('Coltura non trovata');
          return;
        }

        const detail = createCropDetail(data);
        setCrop(detail);
        setPricePerKg(detail.pricePerKg.toString());
      } catch (err) {
        setCrop(null);
        setFetchError(err instanceof Error ? err.message : 'Errore durante il caricamento della coltura');
      } finally {
        setLoading(false);
      }
    };

    loadCrop();
  }, [authLoading, user, cropIdFromParams]);

  useEffect(() => {
    if (crop) {
      setPricePerKg((crop.pricePerKg ?? 2.5).toString());
    }
  }, [crop]);

  // Load weather data
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      console.log('Weather: Skipping server-side weather load in crop page');
      setWeatherLoading(false);
      return;
    }

    console.log('Weather: Loading weather data for crop page');

    const loadWeather = async () => {
      try {
        const weatherData = await getCurrentWeather();
        if (weatherData) {
          console.log('Weather: Crop page weather loaded successfully');
        } else {
          console.log('Weather: Crop page weather data not available');
        }
        setWeather(weatherData);
      } catch (error) {
        console.error('Weather: Error loading weather in crop page:', error);
        // Weather will remain null, component will handle gracefully
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeather();
  }, []);

  const totalKg = useMemo(
    () =>
      crop?.harvests.reduce(
        (sum, item) => sum + (typeof (item as any).kg === 'number' ? (item as any).kg : 0),
        0
      ) ?? 0,
    [crop]
  );

  const totalCosts = useMemo(
    () =>
      crop?.costs.reduce(
        (sum, item) => sum + (typeof (item as any).amount === 'number' ? (item as any).amount : 0),
        0
      ) ?? 0,
    [crop]
  );

  const estimatedMin = crop ? crop.plants * crop.yieldMin : 0;
  const estimatedMax = crop ? crop.plants * crop.yieldMax : 0;

  const revenue = useMemo(() => Number(totalKg) * Number(crop?.pricePerKg ?? 2.5), [totalKg, crop]);
  const profit = useMemo(() => Number(revenue) - Number(totalCosts), [revenue, totalCosts]);

  const allEvents = useMemo(() => {
    if (!crop) return [];

    const events: Array<CropEvent & { id?: string }> = [...(crop.events || [])];

    // Add harvests as events
    crop.harvests.forEach((harvest, index) => {
      const kg = (harvest as any).kg ?? 0;
      events.push({
        type: 'raccolta',
        note: `Raccolti ${kg.toFixed(1)} kg`,
        date: (harvest as any).date ?? new Date().toISOString().slice(0, 10),
        id: `harvest-${index}`
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [crop]);

  const suggestions = useMemo(() => {
    if (!crop) return [];
    return getSmartSuggestions(crop.name, crop.events || []);
  }, [crop]);

  const handleAddHarvest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!crop) {
      return;
    }

    const kg = Number(kgValue);
    if (Number.isNaN(kg) || kg <= 0) {
      setError('Inserisci un valore kg valido.');
      return;
    }

    const harvestEvent: CropEvent = {
      type: 'raccolta',
      note: `Raccolti ${kg.toFixed(1)} kg`,
      date: new Date().toISOString().slice(0, 10),
    };

    const updatedCrop: CropDetail = {
      ...crop,
      harvests: [...crop.harvests, { date: new Date().toISOString().slice(0, 10), kg }],
      events: [...crop.events, harvestEvent],
    };

    setCrop(updatedCrop);
    setKgValue('');
  };

  const handleUpdatePrice = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!crop) {
      return;
    }

    const price = Number(pricePerKg);
    if (Number.isNaN(price) || price < 0) {
      setError('Inserisci un prezzo valido.');
      return;
    }

    const updatedCrop: CropDetail = {
      ...crop,
      pricePerKg: price,
    };

    setCrop(updatedCrop);
  };

  const handleAddEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!crop) {
      return;
    }

    if (!activityDate.trim()) {
      setError('Seleziona una data per l\'attività.');
      return;
    }

    const newEvent: CropEvent = {
      type: eventType,
      date: new Date(activityDate).toISOString().slice(0, 10),
    };

    const updatedCrop: CropDetail = {
      ...crop,
      events: [...crop.events, newEvent],
    };

    setCrop(updatedCrop);
    setActivityDate(new Date().toISOString().split('T')[0]);
  };

  const handleAddCost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!crop) {
      return;
    }

    const amount = Number(costAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      setError('Inserisci un importo valido.');
      return;
    }

    if (!costNote.trim()) {
      setError('Inserisci una nota per il costo.');
      return;
    }

    const updatedCrop: CropDetail = {
      ...crop,
      costs: [...crop.costs, { note: costNote.trim(), amount }],
    };

    setCrop(updatedCrop);
    setCostAmount('');
    setCostNote('');
  };

  const handleDeleteCrop = async () => {
    const confirmed = window.confirm('Sei sicuro di voler eliminare questa coltura?');

    if (!confirmed || !crop) {
      return;
    }

    await deleteCrop(crop.id);
    router.push('/dashboard');
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-beige px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Caricamento coltura...</h1>
          <p className="mt-3 text-slate-600">Attendi mentre carichiamo i dettagli della tua coltura.</p>
        </div>
      </main>
    );
  }

  if (!crop) {
    return (
      <main className="min-h-screen bg-beige px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-red-700">Coltura non trovata</h1>
          <p className="mt-3 text-slate-600">{fetchError ?? 'Controlla l\'ID della coltura o torna alla dashboard.'}</p>
          <div className="mt-6">
            <Button href="/dashboard">← Torna alla dashboard</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-beige px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/dashboard" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100">
              ← Torna alla dashboard
            </Link>
            <h1 className="mt-6 text-4xl font-semibold text-slate-900">{crop.name}</h1>
            <p className="mt-2 text-slate-600">Dettagli coltura salvata nel tuo orto.</p>
          </div>
          <button
            onClick={handleDeleteCrop}
            className="h-fit rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100"
          >
            Elimina coltura
          </button>
        </div>

        <section className="grid gap-6 lg:grid-cols-6">
          <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Piante</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{crop.plants}</p>
          </div>
          <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Spaziatura</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{crop.spacing} cm</p>
          </div>
          <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Stimato</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatKg(estimatedMin)} - {formatKg(estimatedMax)}</p>
          </div>
          <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Reale</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{formatKg(Number(totalKg))}</p>
          </div>
          <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Ricavi</p>
            <p className="mt-4 text-3xl font-semibold text-green-600">{formatCurrency(revenue)}</p>
          </div>
          <div className="rounded-3xl border-2 border-green-300 bg-green-50 p-8 shadow-md transition hover:shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-green-700 font-medium">Profitto</p>
            <p className={`mt-4 text-4xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(profit)}</p>
          </div>
        </section>

        {(() => {
          if (weatherLoading || !weather) {
            return (
              <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
                <h2 className="text-xl font-semibold text-slate-900">Consiglio di oggi</h2>
                <div className="mt-6 flex items-center justify-center py-8">
                  <div className="text-center">
                    <span className="text-2xl">⏳</span>
                    <p className="mt-2 text-sm text-slate-600">Caricamento dati meteo...</p>
                  </div>
                </div>
              </div>
            );
          }

          const advice = getAdvice(crop, weather);
          return (
            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">Consiglio di oggi</h2>
              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-olive/5 p-5 transition hover:bg-olive/8">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-medium">Temperatura</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{weather.temp}°C</p>
                  </div>
                  <div className="rounded-2xl bg-olive/5 p-5 transition hover:bg-olive/8">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-medium">Umidità</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{weather.humidity}%</p>
                  </div>
                  <div className="rounded-2xl bg-olive/5 p-5 transition hover:bg-olive/8">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-medium">Vento</p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{weather.wind} km/h</p>
                  </div>
                </div>
                <div className="rounded-2xl border-l-4 border-olive bg-olive/5 p-5">
                  <p className="text-sm text-slate-700">{advice}</p>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900">Cosa fare oggi</h2>
          <div className="mt-6 space-y-4">
            {suggestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                Nessuna attività urgente oggi
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div key={index} className="rounded-2xl border-l-4 border-green-500 bg-green-50 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-800">{suggestion.message}</p>
                  <p className="mt-2 text-xs text-slate-600">Giorno {suggestion.days} dall&apos;evento</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">Prezzo di vendita</h2>
              <form onSubmit={handleUpdatePrice} className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
                <Input
                  label="Prezzo al kg (€)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={pricePerKg}
                  onChange={(event) => setPricePerKg(event.target.value)}
                  placeholder={crop.pricePerKg.toString()}
                />
                <Button type="submit" className="h-fit">Aggiorna</Button>
              </form>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">Aggiungi raccolto</h2>
              <form onSubmit={handleAddHarvest} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
                <Input
                  label="kg raccolti"
                  type="number"
                  step="0.1"
                  min="0"
                  value={kgValue}
                  onChange={(event) => setKgValue(event.target.value)}
                />
                <Button type="submit" className="h-fit">Aggiungi raccolto</Button>
              </form>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">Aggiungi costo</h2>
              <form onSubmit={handleAddCost} className="mt-6 grid gap-4">
                <Input
                  label="Nota costo"
                  type="text"
                  value={costNote}
                  onChange={(event) => setCostNote(event.target.value)}
                />
                <Input
                  label="Importo (€)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={costAmount}
                  onChange={(event) => setCostAmount(event.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit">Aggiungi costo</Button>
                </div>
              </form>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Produzione</h3>
              <p className="mt-3 text-slate-600">Reale vs stimata basata sulle piante salvate.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-green-200 bg-green-50 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-green-700 font-medium">Reale</p>
                  <p className="mt-3 text-2xl font-bold text-green-600">{Number(totalKg).toFixed(1)} kg</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-600 font-medium">Stimata</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{estimatedMin.toFixed(1)} - {estimatedMax.toFixed(1)} kg</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Storico raccolti</h3>
              <div className="mt-6 space-y-3">
                {crop.harvests.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    Nessun raccolto registrato.
                  </div>
                ) : (
                  crop.harvests.map((harvest, index) => (
                    <div key={`${(harvest as any).date}-${index}`} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 transition hover:bg-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{(harvest as any).date}</span>
                        <span className="font-semibold text-green-600">{formatKg((harvest as any).kg ?? 0)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Costi</h3>
              <div className="mt-6 space-y-3">
                {crop.costs.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    Nessun costo registrato.
                  </div>
                ) : (
                  crop.costs.map((cost, index) => (
                    <div key={`${(cost as any).note}-${index}`} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 transition hover:bg-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{(cost as any).note}</span>
                        <span className="font-semibold text-red-600">{formatCurrency((cost as any).amount ?? 0)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h2 className="text-xl font-semibold text-slate-900">Aggiungi attività</h2>
              <form onSubmit={handleAddEvent} className="mt-6 grid gap-4">
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  Tipo attività
                  <select
                    value={eventType}
                    onChange={(event) => setEventType(event.target.value as CropEvent['type'])}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
                  >
                    <option value="trapianto">Trapianto</option>
                    <option value="concimazione">Concimazione</option>
                    <option value="trattamento">Trattamento</option>
                    <option value="raccolta">Raccolta</option>
                  </select>
                </label>
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  Data attività
                  <input
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
                  />
                </label>
                <div className="flex justify-end">
                  <Button type="submit">Aggiungi attività</Button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Timeline</h3>
              <div className="mt-6 space-y-3">
                {allEvents.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                    Nessuna attività registrata.
                  </div>
                ) : (
                  allEvents.map((event, index) => (
                    <div key={`${event.date}-${index}`} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-olive"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-900 capitalize">{event.type}</span>
                          <span className="text-xs text-slate-500">{event.date}</span>
                        </div>
                        <p className="text-sm text-slate-700">{event.note}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
