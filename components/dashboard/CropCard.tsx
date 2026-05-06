import Link from 'next/link';
import type { Crop } from '@/lib/mockCrops';

export function CropCard({ crop }: { crop: Crop }) {
  const minEstimated = crop.estimated_yield_min_kg ?? 0;
  const maxEstimated = crop.estimated_yield_max_kg ?? 0;
  const realProduction = crop.harvests?.reduce((sum, item) => sum + item.quantity_kg, 0) ?? 0;
  const progress = maxEstimated > 0 ? realProduction / maxEstimated : 0;
  const progressPercentage = Math.round(Math.min(progress * 100, 100));
  const progressColor = progress < 0.4 ? 'bg-red-400' : progress <= 0.7 ? 'bg-yellow-400' : 'bg-green-500';
  const progressLabel = progress < 0.4 ? 'Produzione bassa ⚠️' : progress <= 0.7 ? 'Nella media 👍' : 'Ottima resa 🚀';

  return (
    <div className="rounded-[2rem] border border-olive/15 bg-white p-8 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-olive/80">Coltura</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{crop.name}</h3>
        </div>
        <Link
          href={`/dashboard/crop/${crop.id}`}
          className="rounded-full border border-olive/20 bg-olive/10 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/20"
        >
          Apri
        </Link>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Area</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{crop.area_mq} mq</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Piante</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{crop.plants_number}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produzione stimata</p>
          <p className="mt-2 text-lg font-semibold text-emerald-700">{minEstimated.toFixed(1)} - {maxEstimated.toFixed(1)} kg</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produzione reale</p>
          <p className="mt-2 text-lg font-semibold text-emerald-700">{realProduction.toFixed(1)} kg</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ${progressColor}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-600">{progressLabel}</p>
      </div>
    </div>
  );
}
