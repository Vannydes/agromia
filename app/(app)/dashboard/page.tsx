'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { crops } from '@/lib/crops';
import { getMoonPhase } from '@/lib/moon';
import TodayPriorityBox from '@/components/dashboard/TodayPriorityBox';
import { getUserCrops, type Crop } from '@/lib/cropService';
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
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const moon = useMemo(() => getMoonPhase(), []);
  const { user } = useAuth();

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError(null);
      const crops = await getUserCrops();
      setCropsData(crops);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel caricamento delle colture');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCrops();
    } else {
      setLoading(false);
      setIsMounted(true);
    }
  }, [user]);

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

  // For now, real production is 0 since we don't have harvest data in DB yet
  const totalRealProduction = 0;

  // For now, costs are 0 since we don't have cost data in DB yet
  const totalCosts = 0;

  if (!isMounted) {
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
                    <p className="mt-2 text-lg font-semibold text-slate-900">{crop.plants} piante</p>
                  </div>
                  <Link href={`/crop/${crop.id}`} className="rounded-full border border-olive/20 bg-olive/10 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/20">
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
