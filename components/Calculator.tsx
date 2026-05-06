'use client';

import { useMemo, useState } from 'react';
import { crops, cropKeys } from '@/lib/crops';
import { formatKg } from '@/lib/formatting';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Calculator() {
  const [area, setArea] = useState('10');
  const [selectedCrop, setSelectedCrop] = useState(cropKeys[0]);

  const crop = crops[selectedCrop];
  const areaValue = Number(area);
  const plants = useMemo(() => {
    if (Number.isNaN(areaValue) || areaValue <= 0) {
      return 0;
    }

    const spacingM = crop.spacing / 100;
    return Math.max(0, Math.floor(areaValue / (spacingM * spacingM)));
  }, [areaValue, crop.spacing]);

  const productionMin = useMemo(() => plants * crop.yieldMin, [plants, crop.yieldMin]);
  const productionMax = useMemo(() => plants * crop.yieldMax, [plants, crop.yieldMax]);

  return (
    <section className="rounded-[2rem] border border-olive/15 bg-white p-8 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Calcolatore orto</h2>
        <p className="mt-2 text-sm text-slate-600">
          Inserisci i metri quadri e scegli una coltura per vedere la resa stimata in tempo reale.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Metri quadri"
          type="number"
          min="0"
          step="0.1"
          value={area}
          onChange={(event) => setArea(event.target.value)}
        />

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Coltura
          <select
            value={selectedCrop}
            onChange={(event) => setSelectedCrop(event.target.value as typeof selectedCrop)}
            className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
          >
            {cropKeys.map((key) => (
              <option key={key} value={key}>
                {crops[key].name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Piante</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{plants}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Produzione minima</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{formatKg(productionMin)}</p>
        </div>
        <div className="rounded-[1.75rem] bg-slate-50 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Produzione massima</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{formatKg(productionMax)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        Produzione stimata basata su {plants} piante e resa media per coltura.
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/dashboard">Vai alla dashboard</Button>
      </div>
    </section>
  );
}
