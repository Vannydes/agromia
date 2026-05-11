'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getMoonPhase } from '@/lib/moon';
import TodayPriorityBox from '@/components/dashboard/TodayPriorityBox';
import { createFeedback } from '@/lib/feedbackService';
import { getDashboardStats, getUserCrops, type Crop } from '@/lib/cropDataService';
import { useAuth } from '@/lib/auth-context';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value);
}

export default function DashboardPage() {
  const [cropsData, setCropsData] = useState<Crop[]>([]);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalRealProduction, setTotalRealProduction] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const moon = useMemo(() => getMoonPhase(), []);
  const { user, loading: authLoading } = useAuth();

  const router = useRouter();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const openFeedback = () => {
    setFeedbackError(null);
    setFeedbackMessage('');
    setIsFeedbackOpen(true);
  };

  const closeFeedback = () => {
    setFeedbackError(null);
    setIsFeedbackOpen(false);
  };

  const handleSubmitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = feedbackMessage.trim();

    if (!trimmedMessage) {
      setFeedbackError('Inserisci il tuo suggerimento prima di inviare.');
      return;
    }

    try {
      setFeedbackLoading(true);
      setFeedbackError(null);
      await createFeedback(trimmedMessage);
      setFeedbackSuccess('Grazie! Il tuo suggerimento è stato inviato.');
      setFeedbackMessage('');
      closeFeedback();
      window.setTimeout(() => setFeedbackSuccess(null), 7000);
    } catch (err) {
      console.error('[Dashboard] Feedback submit error:', err);
      setFeedbackError('Impossibile inviare il suggerimento. Riprova più tardi.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const loadCrops = async () => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('Il caricamento della dashboard ha superato il tempo massimo. Riprova.');
    }, 10000);

    try {
      setLoading(true);
      setError(null);

      const cropsResult = await getUserCrops();
      setCropsData(cropsResult);

      const stats = await getDashboardStats();
      setTotalCosts(stats.totalCosts);
      setTotalRealProduction(stats.totalRealProduction);

      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? 'Errore nel caricamento della dashboard. Riprova più tardi.'
          : 'Errore nel caricamento della dashboard'
      );
      setLoading(false);
    } finally {
      clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    loadCrops();
  }, [authLoading, user, router]);

  const totalPlants = useMemo(
    () => cropsData.reduce((sum, crop) => sum + crop.plants, 0),
    [cropsData]
  );

  // For now, we'll use estimated values based on crop type
  // In a real app, you'd store the crop type in the database
  const totalEstimatedMin = useMemo(
    () => cropsData.reduce((sum, crop) => {
      // This is a simplified calculation - you'd need to store crop type in DB
      const estimatedYield = 3; // Average yield for calculation
      return sum + crop.plants * estimatedYield;
    }, 0),
    [cropsData]
  );

  const totalEstimatedMax = useMemo(
    () => cropsData.reduce((sum, crop) => {
      const estimatedYield = 6; // Average yield for calculation
      return sum + crop.plants * estimatedYield;
    }, 0),
    [cropsData]
  );

  // Use actual harvest totals from Supabase
  // totalRealProduction is loaded from the database

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
        <p className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-slate-700 shadow-sm">
          Caricamento della dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-red-900">Errore</h2>
          <p className="mt-2 text-red-700">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  // Empty state: no crops
  if (cropsData.length === 0 && !loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-olive">Dashboard</h1>
            <p className="text-slate-600">Panoramica semplice della produzione, dei raccolti e dei costi.</p>
          </div>
          <div className="flex items-center">
            <Button href="/add-crop" className="px-6 py-3 text-base">Aggiungi coltura</Button>
          </div>
        </div>

        <div className="flex min-h-[400px] flex-col gap-4 items-center justify-center md:flex-row">
          <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Benvenuto in Agromia 🌱</h2>
            <p className="mt-4 text-slate-600">Inizia aggiungendo la tua prima coltura e scopri cosa fare ogni giorno nel tuo orto.</p>

            <Link href="/add-crop">
              <Button className="mt-6 w-full px-6 py-3 text-base">➕ Aggiungi la tua prima coltura</Button>
            </Link>

            <p className="mt-4 text-sm text-slate-500">Esempio: Pomodoro, Zucchine, Insalata</p>
          </div>

          <div className="w-full rounded-3xl border border-olive/15 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  💡 Aiutaci a migliorare Agromia
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Agromia è in beta.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  I tuoi suggerimenti ci aiutano a costruire uno strumento realmente utile per chi coltiva.
                </p>
              </div>

              <div className="flex items-center sm:justify-end">
                <Button onClick={openFeedback} className="w-full max-w-xs">Invia suggerimento</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-olive">Dashboard</h1>
          <p className="text-slate-600">Panoramica semplice della produzione, dei raccolti e dei costi.</p>
        </div>
        <div className="flex items-center">
          <Button href="/add-crop" className="px-6 py-3 text-base">Aggiungi coltura</Button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-4">
        <Card title="Totale piante" value={`${totalPlants}`} className="bg-white" />
        <Card title="Produzione stimata" value={`${totalEstimatedMin.toFixed(1)} - ${totalEstimatedMax.toFixed(1)} kg`} className="bg-white" />
        <Card title="Produzione reale" value={`${totalRealProduction.toFixed(1)} kg`} className="bg-white" />
        <Card title="Costi totali" value={formatCurrency(totalCosts)} className="bg-white" />
      </section>

      {/* Today's priority with real weather and moon phase */}
      <TodayPriorityBox 
        moonLabel={moon.label}
        isGrowingMoon={moon.isGrowing}
        crops={cropsData}
      />

      {feedbackSuccess ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-sm">
          {feedbackSuccess}
        </div>
      ) : null}

      <section className="rounded-3xl border border-olive/15 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              💡 Aiutaci a migliorare Agromia
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Agromia è in beta.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              I tuoi suggerimenti ci aiutano a costruire uno strumento realmente utile per chi coltiva.
            </p>
          </div>

          <div className="flex items-center sm:justify-end">
            <Button onClick={openFeedback} className="w-full max-w-xs">Invia suggerimento</Button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-olive/15 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Schede colture</h2>
          <p className="mt-1 text-sm text-slate-600">Vai a una scheda coltura per aggiornare piante, raccolti e costi reali.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {cropsData.map((crop) => {
            // For now, we'll use a simplified calculation
            // In a real app, you'd store the crop type in the database
            const estimatedMin = crop.plants * 3; // Simplified calculation
            const estimatedMax = crop.plants * 6; // Simplified calculation
            const real = 0; // No harvest data in DB yet

            return (
              <div key={crop.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{crop.name}</p>
                    {crop.custom_crop_id && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-olive/10 text-olive rounded-full">
                        🌱 Personalizzata
                      </span>
                    )}
                    <p className="mt-2 text-lg font-semibold text-slate-900">{crop.plants} piante</p>
                  </div>
                  <Link href={`/dashboard/crops/${crop.id}`} className="rounded-full border border-olive/20 bg-olive/10 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/20">
                    Apri
                  </Link>
                </div>
                <div className="mt-5 space-y-3">
                  <div className="rounded-3xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produzione stimata</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{estimatedMin.toFixed(1)} - {estimatedMax.toFixed(1)} kg</p>
                  </div>
                  <div className="rounded-3xl bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produzione reale</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{real.toFixed(1)} kg</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {isFeedbackOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-6 sm:px-6">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Invia un suggerimento</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Hai idee, problemi o funzioni che vorresti vedere in Agromia?
                </p>
              </div>
              <button
                type="button"
                onClick={closeFeedback}
                className="rounded-full bg-slate-100 px-3 py-2 text-slate-600 transition hover:bg-slate-200"
                aria-label="Chiudi"
              >
                ✕
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmitFeedback}>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Descrizione</span>
                <textarea
                  value={feedbackMessage}
                  onChange={(event) => setFeedbackMessage(event.target.value)}
                  placeholder="Hai idee, problemi o funzioni che vorresti vedere in Agromia?"
                  className="mt-2 min-h-[160px] w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
                />
              </label>

              {feedbackError ? (
                <p className="text-sm text-rose-700">{feedbackError}</p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">I tuoi feedback rendono Agromia più utile per tutti.</p>
                <Button type="submit" disabled={feedbackLoading} className="w-full sm:w-auto">
                  {feedbackLoading ? 'Invio in corso…' : 'Invia suggerimento'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
