import type { CostItem } from '@/lib/mockCrops';

export function CostList({ costs }: { costs: CostItem[] }) {
  if (costs.length === 0) {
    return <p className="rounded-[1.75rem] border border-card bg-card p-6 text-sm text-muted">Nessun costo registrato. Semi, concimi e materiali appariranno qui.</p>;
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="divide-y divide-slate-200">
        {costs.map((cost) => (
          <div key={cost.name + cost.amount} className="flex items-center justify-between gap-4 px-6 py-5 text-sm">
            <span className="text-slate-700">{cost.name}</span>
            <span className="font-semibold text-slate-900">€ {cost.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
