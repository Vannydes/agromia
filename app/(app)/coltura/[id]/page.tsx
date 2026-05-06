import { Card } from '@/components/ui/card';

export default function ColturaPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-olive">{params.id.replace('-', ' ')}</h1>
        <p className="text-slate-600">Panoramica delle attività, costi e produzione.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Attività" description="Lista attività vuota" className="bg-white" />
        <Card title="Costi" description="Lista costi vuota" className="bg-white" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Produzione" description="Placeholder produzione" className="bg-beige" />
        <Card title="Risultato" description="Placeholder risultato" className="bg-beige" />
      </div>
    </div>
  );
}
