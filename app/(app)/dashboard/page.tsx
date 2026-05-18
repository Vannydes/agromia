'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getMoonPhase } from '@/lib/moon';
import TodayPriorityBox from '@/components/dashboard/TodayPriorityBox';
import { AgromiaNewsFeed } from '@/components/AgromiaNewsFeed';
import { createFeedback } from '@/lib/feedbackService';
import { getUserCrops, getUserTotalCosts, type Crop } from '@/lib/cropService';
import { getTotalHarvestsForUser } from '@/lib/cropDataService';
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

  const loadCrops = useCallback(async () => {
    console.log('[Dashboard] 🚀 Starting crop load');
    const timeoutId = setTimeout(() => {
      console.error('[Dashboard] ⏱️ Fetch timeout - setting error state');
      setLoading(false);
      setError('Il caricamento della dashboard ha superato il tempo massimo. Riprova.');
    }, 10000); // 10 second timeout

    try {
      setLoading(true);
      setError(null);
      console.log('[Dashboard] 🔄 Calling getUserCrops, getUserTotalCosts and getTotalHarvestsForUser...');
      const [cropsResult, costsResult, harvestResult] = await Promise.all([
        getUserCrops(),
        getUserTotalCosts(),
        getTotalHarvestsForUser(),
      ]);
      console.log('[Dashboard] ✨ Successfully loaded crops:', cropsResult.length);
      setCropsData(cropsResult);
      console.log('[Dashboard] ✨ Successfully loaded total costs:', costsResult);
      setTotalCosts(costsResult);
      console.log('[Dashboard] ✨ Successfully loaded total real production:', harvestResult);
      setTotalRealProduction(harvestResult);
      
      setLoading(false);
    } catch (err) {
      console.error('[Dashboard] 💥 Error in loadCrops:', err);
      setError(
        err instanceof Error 
          ? `Errore: ${err.message}` 
          : 'Errore nel caricamento delle colture'
      );
      setLoading(false);
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    console.log('[Dashboard] 🔍 useEffect triggered - authLoading:', authLoading, 'user:', !!user);
    
    if (authLoading) {
      console.log('[Dashboard] ⏳ Auth is still loading');
      return;
    }

    if (!user) {
      console.log('[Dashboard] 🔐 No user - redirecting to login');
      router.replace('/login');
      return;
    }

    console.log('[Dashboard] 👤 User authenticated:', user.id);
    loadCrops();
  }, [authLoading, user, router, loadCrops]);

  useEffect(() => {
    if (typeof window === 'undefined' || authLoading || !user) {
      return;
    }

    const handleDataUpdated = () => {
      console.log('[Dashboard] 🔁 Data updated event received, refreshing dashboard...');
      loadCrops();
    };

    window.addEventListener('agromia:data-updated', handleDataUpdated);
    return () => {
      window.removeEventListener('agromia:data-updated', handleDataUpdated);
    };
  }, [authLoading, user, loadCrops]);

  const totalPlants = useMemo(
    () => {
      const total = cropsData.reduce((sum, crop) => sum + crop.plants, 0);
      console.log('[Dashboard] 📊 Total plants calculated:', total);
      return total;
    },
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

  const previewCrops = useMemo(() => cropsData.slice(0, 4), [cropsData]);
  const hasMoreCrops = cropsData.length > 4;

  if (authLoading || loading) {
    console.log('[Dashboard] ⏳ Still loading - authLoading:', authLoading, 'loading:', loading);
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
            <Button href="/add-crop" className="w-full sm:w-auto px-6 py-3 text-base">Aggiungi coltura</Button>
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
    <div className="w-full max-w-full overflow-x-hidden space-y-10 lg:space-y-12">
      <section className="w-full max-w-full rounded-[2rem] border border-white/70 bg-white/90 p-10 sm:p-12 shadow-[0_25px_80px_rgba(24,90,52,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-700 font-semibold">Dashboard Premium</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-950 sm:text-5xl">Il tuo orto a portata di mano</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Analisi dettagliate, consigli in tempo reale e una panoramica completa dei tuoi raccolti, dei costi e delle attività.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/add-crop" className="w-full sm:w-auto px-6 py-3 text-base">Aggiungi coltura</Button>
            <Button href="/dashboard" variant="outline" className="w-full sm:w-auto px-6 py-3 text-base">Aggiorna</Button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[1.5fr_1fr]">
          <div className="grid gap-8 md:grid-cols-2">
            <Card title="Totale piante" value={`${totalPlants}`} description="Colture attive nel tuo orto" className="bg-white min-h-[240px]" />
            <Card title="Costi totali" value={formatCurrency(totalCosts)} description="Spesa registrata finora" className="bg-white min-h-[240px]" />
            <Card title="Produzione stimata" value={`${totalEstimatedMin.toFixed(1)} - ${totalEstimatedMax.toFixed(1)} kg`} description="Intervallo previsto" className="bg-white min-h-[240px]" />
            <Card title="Produzione reale" value={`${totalRealProduction.toFixed(1)} kg`} description="Raccolti effettivi" className="bg-white min-h-[240px]" />
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-gradient-to-br from-emerald-50/80 via-white to-olive/10 p-8 shadow-[0_25px_80px_rgba(24,90,52,0.12)] backdrop-blur-xl">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-700">Progresso</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Obiettivo settimanale</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Registra almeno 2 attività e un raccolto per ottenere previsioni più accurate.
              </p>
            </div>
            <div className="mt-6 overflow-hidden rounded-full bg-slate-200 p-1.5">
              <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-emerald-600 to-olive transition-all duration-300" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-800">Stato attuale: 66% completato</p>

            <div className="mt-8 rounded-[1.75rem] border border-white/70 bg-white/90 p-8 shadow-[0_20px_50px_rgba(24,90,52,0.08)]">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Motivazione</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">Ogni dato ti rende più efficiente</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">
                Più informazioni inserisci, più Agromia ti aiuta a pianificare i lavori del tuo orto con precisione e sicurezza.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-6">
          <details open className="group rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_25px_70px_rgba(24,90,52,0.10)] backdrop-blur-xl">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-xl font-semibold text-slate-950">
              Focus Oggi
              <span className="text-sm text-slate-500 transition-transform duration-200 group-open:rotate-180">⌄</span>
            </summary>
            <div className="mt-5">
              <TodayPriorityBox
                moonLabel={moon.label}
                isGrowingMoon={moon.isGrowing}
                crops={cropsData}
              />
            </div>
          </details>

          <section className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_25px_70px_rgba(24,90,52,0.10)] backdrop-blur-xl transition-all duration-300">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500 font-semibold">Schede colture</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Panoramica rapida delle colture registrate</h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">Una visuale compatta e premium delle colture principali. Apri la pagina completa per gestire tutte le colture.</p>
              </div>
              <Button href="/my-crops" variant="outline" className="w-full sm:w-auto rounded-full px-5 py-3 text-sm font-semibold">
                Vedi tutte le colture →
              </Button>
            </div>

            <div className="mt-8 grid w-full gap-6 grid-cols-1 sm:grid-cols-2">
              {previewCrops.map((crop) => (
                <div key={crop.id} className="group w-full min-w-0 rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_15px_35px_rgba(24,90,52,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_55px_rgba(24,90,52,0.12)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Coltura</p>
                      <h3 className="mt-3 text-xl font-semibold text-slate-900">{crop.name}</h3>
                    </div>
                    {crop.custom_crop_id ? (
                      <span className="inline-flex items-center rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-olive">
                        🌱 Personalizzata
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 grid w-full gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-4 min-w-0">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Piante</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{crop.plants}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 min-w-0">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Registrata</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{new Date(crop.created_at).toLocaleDateString('it-IT')}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-slate-500 break-words">ID: {crop.id.slice(0, 8)}</span>
                    <Link href={`/dashboard/crops/${crop.id}`} className="rounded-full border border-olive/20 bg-olive/10 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/20 w-full sm:w-auto text-center">
                      Dettagli
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {hasMoreCrops ? (
              <div className="mt-8 flex justify-end">
                <Button href="/my-crops" variant="outline" className="rounded-full px-6 py-3 text-sm font-semibold">
                  Vedi tutte le colture →
                </Button>
              </div>
            ) : null}
          </section>

          <details open className="group rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_25px_70px_rgba(24,90,52,0.10)] backdrop-blur-xl">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-xl font-semibold text-slate-950">
              Suggerimenti
              <span className="text-sm text-slate-500 transition-transform duration-200 group-open:rotate-180">⌄</span>
            </summary>
            <div className="mt-5 space-y-6">
              {feedbackSuccess ? (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 shadow-sm">
                  {feedbackSuccess}
                </div>
              ) : null}

              <div className="rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">Il tuo feedback conta</p>
                <p className="mt-2 text-base text-slate-600">
                  Contribuisci a migliorare Agromia: inserisci idee o problemi per la prossima versione.
                </p>
                <Button onClick={openFeedback} className="mt-4 w-full sm:w-auto">
                  Invia suggerimento
                </Button>
              </div>
            </div>
          </details>
        </div>

        <div className="space-y-6">
          <details open className="group rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_25px_70px_rgba(24,90,52,0.10)] backdrop-blur-xl">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-xl font-semibold text-slate-950">
              News e aggiornamenti
              <span className="text-sm text-slate-500 transition-transform duration-200 group-open:rotate-180">⌄</span>
            </summary>
            <div className="mt-5">
              <AgromiaNewsFeed limit={2} />
            </div>
          </details>

          <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_25px_70px_rgba(24,90,52,0.10)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Insight</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Analisi live</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Monitora i trend del tuo orto, dai nuovi raccolti alle attività pianificate.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Colture attive</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{cropsData.length}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Attività previste</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{Math.max(1, Math.min(5, cropsData.length))}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
