import type { Activity } from '@/lib/cropDataService';

const activityStyles: Record<Activity['activity_type'], string> = {
  semina: 'bg-emerald-100 text-emerald-800',
  trapianto: 'bg-sky-100 text-sky-800',
  concimazione: 'bg-orange-100 text-orange-800',
  irrigazione: 'bg-blue-100 text-blue-800',
  raccolta: 'bg-green-100 text-green-800',
};

export function ActivityList({ activities }: { activities: Activity[] }) {
  const ordered = [...activities].sort((a, b) => new Date(a.activity_date).getTime() - new Date(b.activity_date).getTime());

  if (ordered.length === 0) {
    return <p className="rounded-[1.75rem] border border-card bg-card p-6 text-sm text-muted">Nessuna attività salvata. Aggiungi irrigazioni, trattamenti o manutenzioni.</p>;
  }

  return (
    <div className="space-y-4">
      {ordered.map((activity) => (
        <div key={`${activity.activity_date}-${activity.activity_type}-${activity.notes}`} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${activityStyles[activity.activity_type]}`}>
                {activity.activity_type}
              </span>
            </div>
            <div className="text-sm text-slate-500">{new Date(activity.activity_date).toLocaleDateString('it-IT')}</div>
          </div>
          <p className="mt-3 text-sm text-slate-700">{activity.notes || activity.activity_type}</p>
        </div>
      ))}
    </div>
  );
}
