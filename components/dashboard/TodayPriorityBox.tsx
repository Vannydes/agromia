'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCurrentWeather, type Weather } from '@/lib/weather';
import type { Crop } from '@/lib/cropService';
import { generateAgronomicTasks, type AgronomicTask } from '@/lib/agronomic-engine';

type Props = {
  moonLabel: string;
  isGrowingMoon: boolean;
  crops: Crop[];
};

/**
 * Displays today's priority information with real weather data
 * - Current date and day of week
 * - Moon phase
 * - Real-time weather (temperature, humidity, conditions)
 * - Agricultural advice based on weather and moon phase
 */
export default function TodayPriorityBox({ moonLabel, isGrowingMoon, crops }: Props) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const loadWeather = async () => {
      try {
        const weatherData = await getCurrentWeather();

        if (weatherData) {
          setWeather(weatherData);
        } else {
          setError('Meteo non disponibile');
        }
      } catch {
        setError('Impossibile leggere il meteo in questo momento.');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  const today = new Date();
  const dateFormatted = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today);

  const formattedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  const tasks = useMemo(() => generateAgronomicTasks(crops, weather), [crops, weather]);

  const borderClasses: Record<AgronomicTask['color'], string> = {
    red: 'border-red-200 bg-red-50',
    orange: 'border-orange-200 bg-orange-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    blue: 'border-sky-200 bg-sky-50',
    green: 'border-emerald-200 bg-emerald-50',
  };

  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_25px_70px_rgba(20,80,40,0.1)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_85px_rgba(20,80,40,0.15)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-emerald-700">Priorità Oggi</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Il tuo assistente agricolo</h3>
        </div>
        <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-800 shadow-sm">
          {formattedDate}
        </span>
      </div>

      {!loading && weather && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[1.75rem] bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-emerald-700">Meteo</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">{weather.temp}°C</p>
            <p className="mt-1 text-sm text-slate-600">{weather.description}</p>
          </div>
          <div className="rounded-[1.75rem] bg-amber-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-olive-700">Umidità</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">{weather.humidity}%</p>
            <p className="mt-1 text-sm text-slate-600">Vento {weather.wind} km/h</p>
          </div>
          <div className="rounded-[1.75rem] bg-slate-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Luna</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">{moonLabel}</p>
            <p className="mt-1 text-sm text-slate-600">
              {isGrowingMoon ? 'Crescita e trapianto consigliati' : 'Ottimo per radici e cura del terreno'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Cosa fare oggi</p>
        {loading ? (
          <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
            ⏳ Caricamento delle attività...
          </div>
        ) : tasks.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {tasks.map((task) => (
              <div key={task.id} className={`rounded-[1.75rem] border border-white/70 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl ${borderClasses[task.color]}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-3xl">{task.icon}</div>
                  <div>
                    <p className="font-semibold text-slate-950">{task.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{task.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
            Oggi l’orto non richiede interventi urgenti. Ottimo lavoro 🌱
          </div>
        )}
      </div>

      {error && !weather && (
        <p className="mt-4 text-xs text-slate-500 italic">
          💡 Abilita la geolocalizzazione del browser per ottenere meteo reale e attività più precise.
        </p>
      )}
    </div>
  );
}