import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OrtoPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-olive">{params.id.replace('-', ' ')}</h1>
          <p className="text-slate-600">Dettagli e colture per l orto selezionato.</p>
        </div>
        <Button href="/app/coltura/coltura-1">+ Aggiungi coltura</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {['Pomodori', 'Insalata', 'Zucchine'].map((crop) => (
          <Card key={crop} title={crop} description="Coltura attiva" className="bg-white" />
        ))}
      </div>
    </div>
  );
}
