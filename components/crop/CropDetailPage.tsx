'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatKg, formatCurrency, formatDate } from '@/lib/formatting';
import { getCurrentWeather, type Weather } from '@/lib/weather';
import { generateCropAgronomicTasks, type AgronomicTask } from '@/lib/agronomic-engine';
import { useAuth } from '@/lib/auth-context';
import {
  addCost,
  addHarvest,
  addActivity,
  getCostsByCrop,
  getHarvestsByCrop,
  getActivitiesByCrop,
  getCropById,
  deleteCrop,
  type Crop,
  type Cost,
  type Harvest,
  type Activity,
} from '@/lib/cropDataService';
import { crops } from '@/lib/crops';

type TimelineEvent = {
  type: Activity['activity_type'] | 'raccolta';
  note: string;
  date: string;
  id?: string;
};

type CropDetail = Crop & {
  spacing: number;
  yieldMin: number;
  yieldMax: number;
  pricePerKg: number;
};

function getCropConfigByName(name: string) {
  return Object.values(crops).find((config) => config.name === name);
}

function createCropDetail(crop: Crop): CropDetail {
  const config = getCropConfigByName(crop.name);
  const custom = crop.custom_crops;

  return {
    ...crop,
    spacing: custom?.spacing_cm ?? config?.spacing ?? 50,
    yieldMin: custom ? Number(custom.min_yield) : config?.yieldMin ?? 3,
    yieldMax: custom ? Number(custom.max_yield) : config?.yieldMax ?? 6,
    pricePerKg: 2.5,
  };
}

export default function CropPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params.id;
  const cropIdFromParams = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? '';

  const [crop, setCrop] = useState<CropDetail | null>(null);
  const [costs, setCosts] = useState<Cost[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  const [kgValue, setKgValue] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [costNote, setCostNote] = useState('');
  const [error, setError] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [eventType, setEventType] = useState<Activity['activity_type']>('trapianto');
  const [activityDate, setActivityDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [relatedDataError, setRelatedDataError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadCrop = async () => {
      if (authLoading) return;
      if (!user || !cropIdFromParams) {
        setCrop(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setFetchError(null);

      try {
        const data = await getCropById(cropIdFromParams);

        if (!data) {
          setCrop(null);
          setCosts([]);
          setHarvests([]);
          setActivities([]);
          setFetchError('Coltura non trovata');
          return;
        }

        const detail = createCropDetail(data);
        setCrop(detail);
        setPricePerKg(detail.pricePerKg.toString());
        setFetchError(null);
        setRelatedDataError(null);

        const results = await Promise.allSettled([
          getCostsByCrop(cropIdFromParams),
          getHarvestsByCrop(cropIdFromParams),
          getActivitiesByCrop(cropIdFromParams),
        ]);

        const [costsResult, harvestsResult, activitiesResult] = results;

        setCosts(costsResult.status === 'fulfilled' ? costsResult.value : []);
        setHarvests(harvestsResult.status === 'fulfilled' ? harvestsResult.value : []);
        setActivities(activitiesResult.status === 'fulfilled' ? activitiesResult.value : []);

        if (costsResult.status === 'rejected' || harvestsResult.status === 'rejected' || activitiesResult.status === 'rejected') {
          console.error('[Crop] Related data load failed:', {
            costs: costsResult,
            harvests: harvestsResult,
            activities: activitiesResult,
          });
          setRelatedDataError('Alcuni dati della coltura non sono disponibili al momento. Riprova più tardi.');
        }
      } catch (err) {
        console.error('[Crop] Error loading crop:', err);
        if (err instanceof Error && err.message.includes('No rows found')) {
          setCrop(null);
          setCosts([]);
          setHarvests([]);
          setActivities([]);
          setFetchError('Coltura non trovata');
        } else {
          setCrop(null);
          setCosts([]);
          setHarvests([]);
          setActivities([]);
          setFetchError(err instanceof Error ? err.message : 'Errore durante il caricamento della coltura');
        }
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
      setWeatherLoading(false);
      return;
    }


    const loadWeather = async () => {
      try {
        const weatherData = await getCurrentWeather();
        if (!weatherData) {
          setWeather(null);
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
      harvests.reduce((sum, harvest) => sum + harvest.quantity_kg, 0),
    [harvests]
  );

  const totalCosts = useMemo(
    () =>
      costs.reduce((sum, cost) => sum + cost.amount, 0),
    [costs]
  );

  const estimatedMin = crop ? crop.plants * crop.yieldMin : 0;
  const estimatedMax = crop ? crop.plants * crop.yieldMax : 0;

  const revenue = useMemo(() => Number(totalKg) * Number(crop?.pricePerKg ?? 2.5), [totalKg, crop]);
  const profit = useMemo(() => Number(revenue) - Number(totalCosts), [revenue, totalCosts]);

  const tasks = useMemo(() => {
    if (!crop || !weather) return [];
    return generateCropAgronomicTasks(crop, weather);
  }, [crop, weather]);

  const borderClasses: Record<AgronomicTask['color'], string> = {
    red: 'border-red-200 bg-red-50',
    orange: 'border-orange-200 bg-orange-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    blue: 'border-sky-200 bg-sky-50',
    green: 'border-emerald-200 bg-emerald-50',
  };

  const allEvents = useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add activities from database
    activities.forEach((activity) => {
      events.push({
        type: activity.activity_type,
        note: activity.notes || activity.activity_type,
        date: activity.activity_date,
        id: activity.id,
      });
    });

    // Add harvests as events
    harvests.forEach((harvest) => {
      events.push({
        type: 'raccolta',
        note: `Raccolti ${harvest.quantity_kg.toFixed(1)} kg`,
        date: harvest.created_at,
        id: harvest.id,
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, harvests]);

  const handleAddHarvest = async (event: React.FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);

    try {
      const date = new Date().toISOString().slice(0, 10);
      await addHarvest(crop.id, kg, `Raccolti ${kg.toFixed(1)} kg`);
      const updatedHarvests = await getHarvestsByCrop(crop.id);
      setHarvests(updatedHarvests);
      
      setKgValue('');
    } catch (err) {
      console.error('[Crop] Error adding harvest:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio del raccolto');
    } finally {
      setIsSubmitting(false);
    }
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

  const handleAddEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!crop) {
      return;
    }

    if (!activityDate.trim()) {
      setError('Seleziona una data per l\'attività.');
      return;
    }

    setIsSubmitting(true);

    try {
      const date = new Date(activityDate).toISOString().slice(0, 10);
      await addActivity(crop.id, eventType, date, `Attività: ${eventType}`);
      const updatedActivities = await getActivitiesByCrop(crop.id);
      setActivities(updatedActivities);
      
      setActivityDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      console.error('[Crop] Error adding activity:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio dell\'attività');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCost = async (event: React.FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);

    try {
      await addCost(crop.id, costNote.trim(), amount);
      const updatedCosts = await getCostsByCrop(crop.id);
      setCosts(updatedCosts);
      
      setCostAmount('');
      setCostNote('');
    } catch (err) {
      console.error('[Crop] Error adding cost:', err);
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio del costo');
    } finally {
      setIsSubmitting(false);
    }
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

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Piante */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Piante</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">{crop.plants}</p>
            <p className="mt-2 text-sm text-slate-600">piante nel tuo orto</p>
          </div>

          {/* Spaziatura */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Spaziatura</p>
            <p className="mt-4 text-4xl font-bold text-slate-900">{crop.spacing}</p>
            <p className="mt-2 text-sm text-slate-600">centimetri tra le piante</p>
          </div>

          {/* Data trapianto */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Data trapianto</p>
            <p className="mt-4 text-xl font-bold text-slate-900">{formatDate(crop.transplant_date)}</p>
            <p className="mt-2 text-sm text-slate-600">inizio della coltivazione</p>
          </div>

          {/* Produzione stimata */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Stimato</p>
            <p className="mt-4 text-3xl font-bold text-slate-900">{formatKg(estimatedMin)} - {formatKg(estimatedMax)}</p>
            <p className="mt-2 text-sm text-slate-600">produzione attesa</p>
          </div>

          {/* Produzione reale */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Raccolto reale</p>
            <p className="mt-4 text-3xl font-bold text-emerald-600">{formatKg(Number(totalKg))}</p>
            <p className="mt-2 text-sm text-slate-600">prodotto raccolto</p>
          </div>

          {/* Ricavi */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Ricavi</p>
            <p className="mt-4 text-3xl font-bold text-slate-900">{formatCurrency(revenue)}</p>
            <p className="mt-2 text-sm text-slate-600">valore di vendita</p>
          </div>

          {/* Profitto - evidenziato */}
          <div className="md:col-span-2 lg:col-span-1 rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 shadow-md hover:shadow-lg transition">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Profitto netto</p>
            <p className={`mt-4 text-4xl font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(profit)}
            </p>
            <p className="mt-2 text-sm text-emerald-700 font-medium">
              {profit >= 0 ? '✓ Raccolto redditizio' : '⚠ Perdita registrata'}
            </p>
          </div>
        </section>

        <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
          <h2 className="text-xl font-semibold text-slate-900">Attività consigliate</h2>

          <div className="mt-6 space-y-6">
            {relatedDataError ? (
              <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                {relatedDataError}
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-olive/5 p-5 transition hover:bg-olive/8">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-medium">Temperatura</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{weather ? `${weather.temp}°C` : '—'}</p>
              </div>
              <div className="rounded-2xl bg-olive/5 p-5 transition hover:bg-olive/8">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-medium">Umidità</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{weather ? `${weather.humidity}%` : '—'}</p>
              </div>
              <div className="rounded-2xl bg-olive/5 p-5 transition hover:bg-olive/8">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-medium">Vento</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{weather ? `${weather.wind} km/h` : '—'}</p>
              </div>
            </div>

            {weatherLoading && !weather && tasks.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                ⏳ Caricamento delle attività consigliate...
              </div>
            ) : tasks.length > 0 ? (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className={`rounded-3xl border-2 p-6 shadow-md transition hover:shadow-lg ${borderClasses[task.color]}`}>
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div className="text-4xl shrink-0 leading-none">{task.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg leading-tight text-slate-900">{task.title}</p>
                        <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-700">{task.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-card bg-card p-5 text-sm text-muted">
                Oggi l’orto non richiede interventi urgenti. Ottimo lavoro 🌱
              </div>
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
                  disabled={isSubmitting}
                />
                <Button type="submit" className="h-fit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvataggio...' : 'Aggiungi raccolto'}
                </Button>
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
                  disabled={isSubmitting}
                />
                <Input
                  label="Importo (€)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={costAmount}
                  onChange={(event) => setCostAmount(event.target.value)}
                  disabled={isSubmitting}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvataggio...' : 'Aggiungi costo'}
                  </Button>
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
                {harvests.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-card bg-surface p-4 text-sm text-muted">
                    Non hai ancora raccolto nulla? Quando raccogli i primi frutti, registrali qui.
                  </div>
                ) : (
                  harvests.map((harvest) => (
                    <div key={harvest.id} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 transition hover:bg-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{harvest.created_at}</span>
                        <span className="font-semibold text-green-600">{formatKg(harvest.quantity_kg)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Costi</h3>
              <div className="mt-6 space-y-3">
                {costs.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-card bg-surface p-4 text-sm text-muted">
                    Nessun costo registrato. Semi, concimi e materiali appariranno qui.
                  </div>
                ) : (
                  costs.map((cost) => (
                    <div key={cost.id} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 transition hover:bg-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{cost.title}</span>
                        <span className="font-semibold text-red-600">{formatCurrency(cost.amount)}</span>
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
                    onChange={(event) => setEventType(event.target.value as Activity['activity_type'])}
                    disabled={isSubmitting}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20 disabled:opacity-50"
                  >
                    <option value="trapianto">Trapianto</option>
                    <option value="semina">Semina</option>
                    <option value="concimazione">Concimazione</option>
                    <option value="irrigazione">Irrigazione</option>
                    <option value="raccolta">Raccolta</option>
                  </select>
                </label>
                <label className="block space-y-2 text-sm font-medium text-slate-700">
                  Data attività
                  <input
                    type="date"
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20 disabled:opacity-50"
                  />
                </label>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvataggio...' : 'Aggiungi attività'}
                  </Button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg">
              <h3 className="text-xl font-semibold text-slate-900">Timeline</h3>
              <div className="mt-6 space-y-3">
                {allEvents.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-card bg-surface p-4 text-sm text-muted">
                    La tua timeline è vuota. Ogni attività dell’orto verrà salvata qui.
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
