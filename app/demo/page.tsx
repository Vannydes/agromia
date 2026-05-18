"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const focusItems = [
  {
    icon: '🌱',
    title: 'Irrigazione consigliata',
    description: 'Annaffia leggero il basilico appena trapiantato poco prima del tramonto.',
  },
  {
    icon: '☀️',
    title: 'Giornata ideale per trapianto',
    description: 'Sposta le giovani piantine in un angolo con luce diffusa e terreno umido.',
  },
  {
    icon: '🌙',
    title: 'Luna favorevole alle radici',
    description: 'La notte supporta lo sviluppo delle radici: programma una pausa naturale.',
  },
  {
    icon: '💧',
    title: 'Controlla umidità terreno',
    description: 'Usa il dito: se il terreno è fresco, evita l’irrigazione nelle ore calde.',
  },
  {
    icon: '🍅',
    title: 'Evita irrigazione nelle ore calde',
    description: 'Meglio annaffiare al mattino o alla sera per risparmiare acqua.',
  },
];

const crops = [
  {
    icon: '🍅',
    label: 'Pomodoro ciliegino',
    description: 'Terreno fertile, sole mattutino e tanta cura.',
  },
  {
    icon: '🌿',
    label: 'Basilico fresco',
    description: 'Foglie profumate da raccogliere ogni 5 giorni.',
  },
  {
    icon: '🥬',
    label: 'Insalata baby',
    description: 'Croccante e leggera, ideale per il tuo orto urbano.',
  },
];

export default function DemoDashboardPage() {
  const [focusOffset, setFocusOffset] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFocusOffset((prev) => (prev + 1) % focusItems.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  const rotatingFocus = useMemo(
    () => focusItems.map((_, index) => focusItems[(focusOffset + index) % focusItems.length]),
    [focusOffset]
  );

  return (
    <main className="demo-page-root min-h-screen relative overflow-hidden px-4 py-10 sm:px-6 lg:px-10 text-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-52 w-52 rounded-full bg-amber-100/45 blur-3xl" />
        <div className="absolute left-0 bottom-10 h-56 w-56 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-emerald-950/95 border border-white/15 px-5 py-5 shadow-2xl backdrop-blur-sm text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Demo gratuita</p>
              <p className="text-base font-semibold leading-6">
                👋 Stai provando Agromia gratis. Salva le tue colture creando il tuo orto digitale.
              </p>
            </div>
            <Button
              href="/register"
              className="w-full max-w-xs rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold shadow-lg shadow-emerald-900/25 transition hover:bg-emerald-600 sm:w-auto"
            >
              Crea account gratuito
            </Button>
          </div>
        </div>

        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/70">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Orto digitale vivo</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Una demo semplice, naturale e coinvolgente
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Sentiti dentro un vero orto digitale. Attività pratiche, colture vive e uno spazio calmo per immaginare il tuo raccolto.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/95 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-3xl">☀️</div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Luce</p>
              <p className="mt-3 text-slate-600">Guida le piante verso il sole con consigli semplici e naturali.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/95 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-3xl">💧</div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Acqua</p>
              <p className="mt-3 text-slate-600">Gestisci l’irrigazione con suggerimenti morbidi, senza stress.</p>
            </div>
            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50/95 p-6 shadow-sm">
              <div className="flex items-center gap-3 text-3xl">🌱</div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Crescita</p>
              <p className="mt-3 text-slate-600">Colture facili da seguire, per chi vuole un orto bello e vivo.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="mt-1 rounded-3xl bg-emerald-50 p-3 text-2xl">🌿</div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Focus oggi</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Il tuo assistente agricolo</h2>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {rotatingFocus.slice(0, 4).map((item) => (
                <div
                  key={item.title}
                  className="group rounded-[2rem] border border-slate-200/80 bg-slate-50/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center gap-3 text-2xl">{item.icon}</div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Le tue colture</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Un orto pronto da esplorare</h2>
              </div>
              <Button
                href="/add-crop"
                className="w-full max-w-xs rounded-full bg-emerald-950 px-4 py-3 text-sm font-semibold shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:w-auto"
              >
                ➕ Aggiungi una coltura
              </Button>
            </div>

            <div className="mt-8 space-y-4">
              {crops.map((crop) => (
                <button
                  key={crop.label}
                  type="button"
                  className="group w-full rounded-[2rem] border border-slate-200/80 bg-slate-50/95 p-6 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">{crop.label}</p>
                      <p className="mt-3 text-xl font-semibold text-slate-950">{crop.description}</p>
                    </div>
                    <span className="text-4xl">{crop.icon}</span>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-sm font-semibold text-emerald-700">
                    <span>Scopri di più</span>
                    <span className="rounded-full bg-emerald-100 px-3 py-2 text-lg transition group-hover:translate-x-1">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-emerald-950/10 p-8 shadow-[0_25px_80px_rgba(39,120,78,0.12)] backdrop-blur-xl ring-1 ring-white/70">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Inizia il tuo orto</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              🌱 Vuoi creare il tuo orto digitale?
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-slate-600">
              Salva colture, raccolti, costi e attività in uno spazio personale sempre accessibile.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5">
                <p className="text-base font-semibold text-slate-950">📊 Monitora produzioni e raccolti</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5">
                <p className="text-base font-semibold text-slate-950">🌦️ Ricevi consigli e allerte meteo</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5">
                <p className="text-base font-semibold text-slate-950">💰 Controlla costi e ricavi</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5">
                <p className="text-base font-semibold text-slate-950">🌱 Organizza il tuo orto facilmente</p>
              </div>
            </div>

            <Button
              href="/register"
              className="mx-auto mt-4 w-full max-w-md rounded-full bg-emerald-900 px-7 py-4 text-base font-semibold text-white shadow-[0_20px_70px_rgba(15,80,44,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              🚀 Inizia gratuitamente
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
