'use client';

import { useEffect, useState } from 'react';
import { getWeatherFromGeolocation, getAgriculturalAdvice, type WeatherData } from '@/lib/weather-api';

type Props = {
  moonLabel: string;
  isGrowingMoon: boolean;
};

/**
 * Displays today's priority information with real weather data
 * - Current date and day of week
 * - Moon phase
 * - Real-time weather (temperature, humidity, conditions)
 * - Agricultural advice based on weather and moon phase
 */
export default function TodayPriorityBox({ moonLabel, isGrowingMoon }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch weather data on component mount
    const loadWeather = async () => {
      try {
        const weatherData = await getWeatherFromGeolocation();
        if (weatherData) {
          setWeather(weatherData);
        } else {
          setError('Meteo non disponibile');
        }
      } catch (err) {
        console.error('Error loading weather:', err);
        setError('Errore caricamento meteo');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, []);

  // Format today's date
  const today = new Date();
  const dayOfWeek = new Intl.DateTimeFormat('it-IT', { weekday: 'long' }).format(today);
  const dateFormatted = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today);

  // Capitalize first letter of day
  const formattedDate = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  // Get agricultural advice
  const advice = weather
    ? getAgriculturalAdvice(weather, moonLabel)
    : '⏳ Caricamento consiglio agricolo...';

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
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-lg font-semibold text-slate-900">{weather.temperature}°C</p>
                <p className="text-sm text-slate-600">Umidità {weather.humidity}%</p>
              </div>
              <p className="text-sm text-slate-700 mt-1">{weather.weatherDescription}</p>
            </div>
          </div>
        )}

        {/* Agricultural advice */}
        <div className="rounded-lg bg-emerald-100/50 border border-emerald-200 p-3">
          <p className="text-sm font-medium text-slate-900">{advice}</p>
        </div>

        {/* Optional: Weather loading state */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="animate-spin">⏳</span>
            Caricamento dati meteo in tempo reale...
          </div>
        )}

        {error && !weather && (
          <p className="text-xs text-slate-500 italic">
            💡 Consiglio: Abilita la geolocalizzazione nel browser per accedere ai dati meteo reali.
          </p>
        )}
      </div>
    </div>
  );
}