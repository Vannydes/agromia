'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { crops } from '@/lib/crops';
import { type CropState, getAllCropStates } from '@/lib/gardenStorage';
import { getMoonPhase } from '@/lib/moon';
import TodayPriorityBox from '@/components/dashboard/TodayPriorityBox';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(value);
}

export default function DashboardPage() {
  const [states, setStates] = useState<CropState[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const moon = useMemo(() => getMoonPhase(), []);

  useEffect(() => {
    setIsMounted(true);
    setStates(getAllCropStates());
  }, []);

  const totalPlants = useMemo(
    () => states.reduce((sum, item) => sum + item.plants, 0),
    [states]
  );

  const totalEstimatedMin = useMemo(
    () => states.reduce((sum, item) => sum + item.plants * crops[item.key].yieldMin, 0),
    [states]
  );

  const totalEstimatedMax = useMemo(
    () => states.reduce((sum, item) => sum + item.plants * crops[item.key].yieldMax, 0),
    [states]
  );

  const totalRealProduction = useMemo(
    () => states.reduce((sum, item) => sum + item.harvests.reduce((sub, harvest) => sub + harvest.quantity_kg, 0), 0),
    [states]
  );

  const totalCosts = useMemo(
    () => states.reduce((sum, item) => sum + item.costs.reduce((sub, cost) => sub + cost.amount, 0), 0),
    [states]
  );

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
        <p className="rounded-3xl border border-slate-200 bg-white px-6 py-5 text-slate-700 shadow-sm">
          Caricamento della dashboard...
        </p>
      </div>
    );
  }

  // Empty state: no crops
  if (states.length === 0) {
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

        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Benvenuto in Agromia 🌱</h2>
            <p className="mt-4 text-slate-600">Inizia aggiungendo la tua prima coltura e scopri cosa fare ogni giorno nel tuo orto.</p>
            
            <Link href="/add-crop">
              <Button className="mt-6 w-full px-6 py-3 text-base">➕ Aggiungi la tua prima coltura</Button>
            </Link>
            
            <p className="mt-4 text-sm text-slate-500">Esempio: Pomodoro, Zucchine, Insalata</p>
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
      />

      <section className="rounded-3xl border border-olive/15 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Schede colture</h2>
          <p className="mt-1 text-sm text-slate-600">Vai a una scheda coltura per aggiornare piante, raccolti e costi reali.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {Object.keys(crops).map((key) => {
            const cropKey = key as keyof typeof crops;
            const config = crops[cropKey];
            const state = states.find((item) => item.key === cropKey);
            const plants = state?.plants ?? 0;
            const estimatedMin = plants * config.yieldMin;
            const estimatedMax = plants * config.yieldMax;
            const real = state?.harvests.reduce((sum, item) => sum + item.quantity_kg, 0) ?? 0;

            return (
              <div key={key} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{config.name}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{plants} piante</p>
                  </div>
                  <Link href={`/crop/${cropKey}`} className="rounded-full border border-olive/20 bg-olive/10 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/20">
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
    </div>
  );
}
