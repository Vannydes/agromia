"use client";

import { getPriorityCrop } from '@/lib/getPriorityCrop';

type Props = {
  moon: {
    isGrowing: boolean;
    label: string;
  };
  crops: any[];
};

export default function MoonBanner({ moon, crops }: Props) {
  const crop = getPriorityCrop(crops);

  let message = '';

  const moonLabel = moon.isGrowing ? 'Luna crescente' : 'Luna calante';
  const positiveHint = moon.isGrowing ? '✔ Trapianti consigliati' : '✔ Radici, Manutenzione';
  const warningText = crop
    ? `⚠️ Evita trapianti ${crop.name.toLowerCase()} oggi`
    : moon.isGrowing
      ? '⚠️ Buon momento per trapianti'
      : '⚠️ Meglio evitare trapianti oggi';

  return (
    <div className="w-full rounded-lg bg-green-50 border border-green-200 py-2 px-4 text-sm text-slate-700 flex items-center gap-2">
      <span>🌙</span>
      <span className="font-medium">{moonLabel}</span>
      <span className="text-gray-600">• {positiveHint}</span>
      <span className="text-amber-600">• {warningText}</span>
    </div>
  );
}
