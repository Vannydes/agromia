import { Card } from '@/components/ui/card';
import { GoToDashboardButton } from '@/components/GoToDashboardButton';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 py-10">
      <section className="rounded-3xl border border-olive/20 bg-white/90 p-8 shadow-sm sm:p-12">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-olive">Agromia</p>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Gestisci il tuo orto senza stress
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-700">
              Una base SaaS semplice per monitorare orti, colture e KPI. Design fresco, mobile-first e pronto per crescere.
            </p>
            <GoToDashboardButton />
          </div>
          <div className="rounded-3xl border border-olive/20 bg-beige p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-olive">Calcolatore orto</h2>
            <div className="space-y-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-600">Dimensione prevista</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">12 m²</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-600">Colture ideali</p>
                <p className="mt-2 text-lg font-medium text-olive">Pomodori, insalate, basilico</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {['Organizza', 'Analizza', 'Cresci'].map((item) => (
          <Card key={item} title={item} className="bg-white/90" description="Placeholder semplice per funzionalità future." />
        ))}
      </section>
    </div>
  );
}
