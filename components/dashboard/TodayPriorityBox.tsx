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
      console.log('Weather: Skipping server-side execution');
      return;
    }

    console.log('Weather: Starting weather data load on dashboard');

    const loadWeather = async () => {
      try {
        const weatherData = await getCurrentWeather();

        if (weatherData) {
          console.log('Weather: Successfully loaded weather data');
          setWeather(weatherData);
        } else {
          console.warn('Weather: No weather data available');
          setError('Meteo non disponibile');
        }
      } catch (err) {
        console.error('Weather: Error loading weather:', err);
        setError('Errore caricamento meteo');
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
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Priorità Oggi
        </h3>
      </div>

      {/* Main content - grid layout */}
      <div className="space-y-4">
        {/* Date */}
        <div className="flex items-start gap-3 pb-3 border-b border-emerald-100">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-sm text-slate-600">Data</p>
            <p className="text-lg font-semibold text-slate-900">{formattedDate}</p>
          </div>
        </div>

        {/* Moon phase */}
        <div className="flex items-start gap-3 pb-3 border-b border-emerald-100">
          <span className="text-2xl">{isGrowingMoon ? '🌙' : '🌘'}</span>
          <div>
            <p className="text-sm text-slate-600">Fase lunare</p>
            <p className="text-lg font-semibold text-slate-900">{moonLabel}</p>
            <p className="text-xs text-emerald-700 mt-1">
              {isGrowingMoon
                ? '✅ Ideale: Trapianti, colture da frutto'
                : '✅ Ideale: Radici, manutenzione terreno'}
            </p>
          </div>
        </div>

        {/* Weather - only show if loaded */}
        {!loading && weather && (
          <div className="flex items-start gap-3 pb-3 border-b border-emerald-100">
            <span className="text-2xl">🌡️</span>
            <div className="flex-1">
              <p className="text-sm text-slate-600">Condizioni meteo</p>
              <div className="flex flex-col gap-1 mt-1 sm:flex-row sm:items-center">
                <p className="text-lg font-semibold text-slate-900">{weather.temp}°C</p>
                <p className="text-sm text-slate-600">Umidità {weather.humidity}%</p>
                <p className="text-sm text-slate-600">Vento {weather.wind} km/h</p>
              </div>
              <p className="text-sm text-slate-700 mt-1">{weather.description}</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Cosa fare oggi</p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              ⏳ Caricamento delle attività...
            </div>
          ) : tasks.length > 0 ? (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <div key={task.id} className={`rounded-3xl border p-4 shadow-sm ${borderClasses[task.color]}`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0">{task.icon}</div>
                    <div>
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Nessuna attività urgente oggi.
            </div>
          )}
        </div>

        {error && !weather && (
          <p className="text-xs text-slate-500 italic">
            💡 Abilita la geolocalizzazione del browser per ottenere meteo reale e attività più precise.
          </p>
        )}
      </div>
    </div>
  );
}