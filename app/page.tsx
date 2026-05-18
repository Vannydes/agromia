"use client";

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getCropConfig } from '@/lib/crops';
import { formatCurrency, formatKg } from '@/lib/formatting';

const regionOptions = [
  { value: 'lombardia', label: 'Lombardia' },
  { value: 'piemonte', label: 'Piemonte' },
  { value: 'toscana', label: 'Toscana' },
  { value: 'veneto', label: 'Veneto' }
];

const regionTipMap: Record<string, string> = {
  lombardia: 'Clima continentale, ideale per pomodori e insalate con irrigazione regolare.',
  piemonte: 'Estati calde e umide, ottimo per basilico e verdure da raccolto frequente.',
  toscana: 'Estate soleggiata e terreni fertili, perfetto per ortaggi saporiti.',
  veneto: 'Primavere miti e buone piogge, ideale per una crescita stabile.'
};

const cropPriceMap: Record<string, number> = {
  pomodoro: 3.5,
  basilico: 4.0,
  insalata: 2.0,
  zucchina: 2.8,
  lattuga: 2.2
};

const cropLabelMap: Record<string, string> = {
  pomodoro: 'Pomodoro',
  basilico: 'Basilico',
  insalata: 'Insalata'
};

export default function HomePage() {
  const [crop, setCrop] = useState('pomodoro');
  const [plants, setPlants] = useState(8);
  const [region, setRegion] = useState('lombardia');
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [result, setResult] = useState<{
    minKg: number;
    maxKg: number;
    minValue: number;
    maxValue: number;
    tip: string;
    note: string;
  } | null>(null);

  const cropConfig = getCropConfig(crop);
  const pricePerKg = cropPriceMap[crop] ?? 2.5;

  const hintText = useMemo(() => {
    if (!hasCalculated) {
      return 'Compila il simulatore per vedere il potenziale del tuo orto.';
    }
    return `${cropLabelMap[crop] ?? 'Coltura'} • ${plants} piante • ${regionOptions.find((item) => item.value === region)?.label}`;
  }, [hasCalculated, crop, plants, region]);

  const handleCalculate = () => {
    if (!cropConfig || plants <= 0) {
      return;
    }

    setIsCalculating(true);
    setHasCalculated(false);

    window.setTimeout(() => {
      const minKg = plants * cropConfig.yieldMin;
      const maxKg = plants * cropConfig.yieldMax;
      const averageKg = (minKg + maxKg) / 2;
      const minValue = averageKg * pricePerKg * 0.85;
      const maxValue = averageKg * pricePerKg * 1.15;

      setResult({
        minKg,
        maxKg,
        minValue,
        maxValue,
        tip: regionTipMap[region] ?? 'Regione selezionata, ora guarda il valore reale del tuo raccolto.',
        note: `In ${regionOptions.find((item) => item.value === region)?.label}, ${cropLabelMap[crop]} cresce bene con un’attenzione regolare all’irrigazione.`
      });
      setHasCalculated(true);
      setIsCalculating(false);
    }, 450);
  };

  return (
    <main className="landing-page-root min-h-screen relative overflow-hidden px-4 py-10 sm:px-6 lg:px-10 text-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-52 w-52 rounded-full bg-amber-100/45 blur-3xl" />
        <div className="absolute left-0 bottom-10 h-56 w-56 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10">
        <section className="rounded-[2.5rem] border border-white/70 bg-white/80 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/70 overflow-hidden">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700 font-semibold">Agromia</p>
              <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Il tuo orto, sotto controllo.
                  <br />
                  Semplice, digitale, gratuito.
                </h1>
                <p className="text-lg leading-8 text-slate-700 sm:text-xl">
                  Pianifica le semine, calcola i ricavi e tieni traccia dei tuoi successi.
                  <br className="hidden sm:block" />
                  Senza fogli di carta, tutto a portata di smartphone.
                </p>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                  <Button
                    href="/register"
                    className="w-full rounded-full bg-emerald-950 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800"
                  >
                    Inizia gratis
                  </Button>
                  <Button
                    href="/demo"
                    className="w-full rounded-full border border-[#B68652] bg-[#C29563] px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-[#B68652]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#A97B50] hover:text-white"
                  >
                    Esplora la Demo Live →
                  </Button>
                </div>
              </div>
            </div>

            <div className="group relative mx-auto w-full max-w-[32rem]">
              <div className="absolute left-0 top-0 z-10 rounded-full bg-emerald-100/85 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-lg shadow-emerald-900/15 backdrop-blur-sm ring-1 ring-white/70">
                🌱 Demo Live
              </div>
              <a
                href="/demo"
                className="block cursor-pointer overflow-hidden rounded-[2rem] border border-white/60 bg-white/60 shadow-[0_30px_80px_rgba(22,70,45,0.12)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_40px_110px_rgba(39,146,80,0.22)]"
              >
                <div className="relative overflow-hidden rounded-[2rem]">
                  <Image
                    src="/imgwat.png"
                    alt="Anteprima demo Agromia"
                    width={780}
                    height={560}
                    className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(72,187,120,0.16),transparent_45%)] opacity-100 transition duration-500 group-hover:opacity-90" />
                </div>
              </a>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/70">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700 font-semibold">DEMO ORTO</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">🌱 Simula il tuo orto in 30 secondi</h2>
            <p className="mt-4 max-w-xl text-slate-600">Scopri produzione stimata, raccolti e consigli agricoli prima ancora di registrarti.</p>

            <div className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">Coltura</label>
              <select
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="pomodoro">Pomodoro</option>
                <option value="basilico">Basilico</option>
                <option value="insalata">Insalata</option>
              </select>

              <label className="block text-sm font-semibold text-slate-700">Numero piante</label>
              <input
                type="number"
                min={1}
                value={plants}
                onChange={(event) => setPlants(Math.max(1, Number(event.target.value)))}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />

              <label className="block text-sm font-semibold text-slate-700">Regione</label>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                {regionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Button
                type="button"
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full rounded-full bg-emerald-950 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-900/20 transition duration-300 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCalculating ? 'Analisi in corso…' : 'Calcola il bilancio'}
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/70">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-700 font-semibold">Un primo assaggio</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Il valore del tuo orto</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">Stima</span>
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-slate-700 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{hintText}</p>
              <p className="mt-3 text-base leading-7 text-slate-600">{hasCalculated ? 'I numeri si basano sui rendimenti reali della coltura e sul clima della regione scelta.' : 'Compila il simulatore per vedere il potenziale del tuo orto in modo semplice e concreto.'}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-500 ${hasCalculated ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Produzione stimata</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">
                  {hasCalculated ? `${formatKg(result?.minKg ?? 0)} — ${formatKg(result?.maxKg ?? 0)}` : '—'}
                </p>
                <p className="mt-2 text-sm text-slate-600">Quanta materia prima puoi raccogliere dalla tua scelta.</p>
              </div>
              <div className={`rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-500 ${hasCalculated ? 'opacity-100 translate-y-0' : 'opacity-80'}`}>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Valore stimato</p>
                <p className="mt-4 text-3xl font-semibold text-emerald-900">
                  {hasCalculated ? `${formatCurrency(result?.minValue ?? 0)} — ${formatCurrency(result?.maxValue ?? 0)}` : '—'}
                </p>
                <p className="mt-2 text-sm text-slate-600">Una stima elegante del potenziale economico del tuo orto.</p>
              </div>
            </div>

            <div className={`mt-6 rounded-[1.75rem] border ${hasCalculated ? 'border-emerald-100 bg-emerald-950/95' : 'border-slate-200 bg-slate-950'} p-5 text-white shadow-xl transition duration-500 ${hasCalculated ? 'opacity-100 translate-y-0' : 'opacity-90'}`}>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Suggerimento intelligente</p>
              <p className="mt-4 text-base font-semibold">{hasCalculated ? result?.tip : 'Scegli coltura, piante e regione, poi usa il calcolo per vedere il potenziale reale.'}</p>
              {hasCalculated ? (
                <p className="mt-3 text-sm text-slate-300">{result?.note}</p>
              ) : null}
            </div>

            {hasCalculated ? (
              <div className="mt-6">
                <Button
                  href="/register"
                  className="w-full rounded-full border border-[#B68652] bg-[#C29563] px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-[#B68652]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#A97B50] hover:text-white"
                >
                  🌱 Salva questo orto gratis
                </Button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-emerald-50/60 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/70 overflow-hidden">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-emerald-700 font-semibold">Demo live</p>
              <h2 className="text-3xl font-bold text-slate-950">Esplora il tuo orto digitale</h2>
              <p className="max-w-xl text-slate-600">Entra in una demo reale e scopri come Agromia organizza raccolti, attività e consigli agricoli.</p>
            </div>
            <Button
              href="/demo"
              className="w-full max-w-xs rounded-full border border-[#B68652] bg-[#C29563] px-6 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-[#B68652]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#A97B50] hover:text-white"
            >
              Esplora la demo →
            </Button>
          </div>

          <a
            href="/demo"
            className="group mt-10 block overflow-hidden rounded-[2rem] border border-emerald-100 bg-white/90 p-6 shadow-[0_25px_70px_rgba(88,101,65,0.12)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(88,101,65,0.18)] hover:bg-emerald-50/90"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-800 shadow-sm">App viva</span>
                  <span className="rounded-full bg-[#E8D6BE] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#785A3D]">Reale senza login</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Anteprima live</p>
                  <h3 className="text-2xl font-semibold text-slate-950">Un orto digitale già in funzione</h3>
                  <p className="max-w-xl text-slate-600">Guarda attività, meteo, raccolto e consigli in una vista che sembra già il tuo giardino.</p>
                </div>
              </div>

              <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-1">
                <div className="rounded-[1.75rem] bg-emerald-950/95 p-4 text-white shadow-xl ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-0.5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">☀️ Meteo live</p>
                  <p className="mt-3 text-sm font-semibold">21°C • Soleggiato</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-950/95 p-4 text-white shadow-xl ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-0.5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">🌱 Attività consigliata</p>
                  <p className="mt-3 text-sm font-semibold">Annaffia il basilico nel tardo pomeriggio.</p>
                </div>
                <div className="rounded-[1.75rem] bg-slate-900/95 p-4 text-white shadow-xl ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-0.5">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">🍅 Raccolto registrato</p>
                  <p className="mt-3 text-sm font-semibold">2,4 kg di pomodori già pianificati.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-emerald-100 bg-[radial-gradient(circle_at_center,rgba(203,231,214,0.55),transparent_65%)] p-5 shadow-[0_18px_60px_rgba(72,130,83,0.12)] transition duration-500 sm:mt-0 sm:w-80 sm:self-center">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">🌙 Fase lunare</p>
              <div className="mt-4 flex items-center justify-between gap-4 rounded-[1.75rem] bg-white/80 p-4 shadow-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Luna crescente</p>
                  <p className="mt-1 text-sm text-slate-600">Ideale per semine e piccoli aggiustamenti.</p>
                </div>
                <span className="text-2xl">🌙</span>
              </div>
              <div className="mt-5 rounded-[1.75rem] bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">💧 Irrigazione suggerita</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">Mantieni il terreno umido ma mai bagnato.</p>
              </div>
            </div>
          </a>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/70">
            <p className="text-2xl">🌱</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-950">Produzione intelligente</h3>
            <p className="mt-3 text-slate-600">Previsioni di raccolta e calendario lunare sempre aggiornati.</p>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/70">
            <p className="text-2xl">💰</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-950">Controllo costi e ricavi</h3>
            <p className="mt-3 text-slate-600">Monitora quanto spendi e scopri quanto stai risparmiando o guadagnando.</p>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-xl ring-1 ring-white/70">
            <p className="text-2xl">⚠️</p>
            <h3 className="mt-4 text-xl font-semibold text-slate-950">Allerte meteo live</h3>
            <p className="mt-3 text-slate-600">Ricevi consigli pratici in base a vento, gelo, pioggia e condizioni reali.</p>
          </div>
        </section>
      </div>
    </main>
  );
}


