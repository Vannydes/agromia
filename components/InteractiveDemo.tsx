'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cropOptions, type CropOption } from '@/lib/crops';

const regions = [
  { value: 'lombardia', label: 'Lombardia' },
  { value: 'piemonte', label: 'Piemonte' },
  { value: 'veneto', label: 'Veneto' },
  { value: 'toscana', label: 'Toscana' },
  { value: 'lazio', label: 'Lazio' },
  { value: 'campania', label: 'Campania' },
  { value: 'sicilia', label: 'Sicilia' },
  { value: 'puglia', label: 'Puglia' },
  { value: 'emilia-romagna', label: 'Emilia-Romagna' },
  { value: 'marche', label: 'Marche' },
  { value: 'trentino-alto-adige', label: 'Trentino-Alto Adige' },
  { value: 'friuli-venezia-giulia', label: 'Friuli Venezia Giulia' },
  { value: 'liguria', label: 'Liguria' },
  { value: 'umbria', label: 'Umbria' },
  { value: 'abbuzzo', label: 'Abruzzo' },
  { value: 'molise', label: 'Molise' },
  { value: 'basilicata', label: 'Basilicata' },
  { value: 'calabria', label: 'Calabria' },
  { value: 'sardegna', label: 'Sardegna' },
];

const cropDetailMap: Record<CropOption['key'], { period: string; weather: string; tip: string; price: number }> = {
  pomodoro: {
    period: 'Luglio - Settembre',
    weather: 'Sole caldo, irrigazione regolare',
    tip: 'Sostieni i rami e annaffia la sera per frutti migliori.',
    price: 3.5,
  },
  zucchina: {
    period: 'Giugno - Agosto',
    weather: 'Caldo, terreno umido ma drenato',
    tip: 'Raccogli spesso per stimolare nuove fioriture.',
    price: 2.8,
  },
  lattuga: {
    period: 'Maggio - Giugno',
    weather: 'Fresco e umido, poco sole diretto',
    tip: 'Mantieni il terreno morbido e raccogli prima che ingiallisca.',
    price: 2.2,
  },
  basilico: {
    period: 'Giugno - Agosto',
    weather: 'Luce diretta, terreno ben drenato',
    tip: 'Potare regolarmente per ottenere foglie più dense.',
    price: 4.0,
  },
  fragola: {
    period: 'Maggio - Luglio',
    weather: 'Sole mattutino e terreno costantemente umido',
    tip: 'Rimuovi i frutti marci per stimolare nuove produzioni.',
    price: 5.0,
  },
  carota: {
    period: 'Giugno - Settembre',
    weather: 'Clima mite, terreno sciolto',
    tip: 'Mantieni il terreno ben aerato e irriga senza ristagni.',
    price: 2.4,
  },
  peperone: {
    period: 'Luglio - Settembre',
    weather: 'Caldo stabile e sole abbondante',
    tip: 'Raccogli a seconda della maturazione colore della buccia.',
    price: 3.8,
  },
  melanzana: {
    period: 'Luglio - Settembre',
    weather: 'Clima caldo e sereno',
    tip: 'Elimina foglie ingiallite per concentrare energia sui frutti.',
    price: 3.2,
  },
  patata: {
    period: 'Agosto - Ottobre',
    weather: 'Fresco e costante, terreno leggermente umido',
    tip: 'Non innaffiare troppo vicino alla raccolta per evitare marciumi.',
    price: 1.8,
  },
  peperoncino: {
    period: 'Agosto - Ottobre',
    weather: 'Clima caldo e asciutto',
    tip: 'Lascia maturare un po’ di più per un sapore più intenso.',
    price: 4.5,
  },
  insalata: {
    period: 'Aprile - Maggio',
    weather: 'Fresco e umido',
    tip: 'Raccogli rapidamente per evitare che diventi amara.',
    price: 2.0,
  },
  cavolo: {
    period: 'Settembre - Novembre',
    weather: 'Fresco e stabile',
    tip: 'Proteggi dal vento e irrigare regolarmente.',
    price: 2.6,
  },
  broccolo: {
    period: 'Giugno - Ottobre',
    weather: 'Clima fresco e umido',
    tip: 'Mantieni le piante ben distanziate per una crescita vigorosa.',
    price: 2.9,
  },
  cetriolo: {
    period: 'Giugno - Agosto',
    weather: 'Caldo e terreno costantemente umido',
    tip: 'Usa pali o grigliati per coltivarli in verticale.',
    price: 2.6,
  },
  aglio: {
    period: 'Giugno - Luglio',
    weather: 'Sole e terreno ben drenato',
    tip: 'Raccogli quando le foglie iniziano ad ingiallire.',
    price: 3.0,
  },
  prezzemolo: {
    period: 'Maggio - Settembre',
    weather: 'Luce diffusa e terreno umido',
    tip: 'Potare frequentemente per foglie fresche e rigogliose.',
    price: 3.8,
  },
  rucola: {
    period: 'Aprile - Giugno',
    weather: 'Fresco e moderatamente umido',
    tip: 'Raccogli prima che i semi inizino a svilupparsi.',
    price: 2.3,
  },
  finocchio: {
    period: 'Luglio - Ottobre',
    weather: 'Clima mite, terreno umido',
    tip: 'Assicurati un buon drenaggio per bulbi compatti.',
    price: 2.7,
  },
  pisello: {
    period: 'Maggio - Giugno',
    weather: 'Fresco e leggero vento',
    tip: 'Sostieni i tralci con tutori per migliori raccolti.',
    price: 3.1,
  },
};

const regionHintMap: Record<string, string> = {
  lombardia: 'Clima continentale a estati calde.',
  piemonte: 'Inverni freddi, estati calde e umide.',
  veneto: 'Primavere miti e estati con buone piogge.',
  toscana: 'Sole, clima mediterraneo e terreni fertili.',
  lazio: 'Estate calda e influenze costiere.',
  campania: 'Inverni miti e estati soleggiate.',
  sicilia: 'Clima caldo-subtropicale con estati lunghe.',
  puglia: 'Temperature elevate e sole abbondante.',
  'emilia-romagna': 'Primavere fresche, estati calde e ventilate.',
  marche: 'Clima temperato con ottime stagioni di crescita.',
  'trentino-alto-adige': 'Estati fresche e ad alta quota.',
  'friuli-venezia-giulia': 'Clima mite con buone piogge.',
  liguria: 'Costa mite, buone esposizioni al sole.',
  umbria: 'Clima dolce e buone escursioni termiche.',
  abruzzo: 'Clima montano con estati piacevoli.',
  molise: 'Sole e stagioni di crescita equilibrate.',
  basilicata: 'Clima mediterraneo con escursioni termiche.',
  calabria: 'Estati lunghe e soleggiate.',
  sardegna: 'Clima marittimo, tanto sole e poca umidità.',
};

function formatKg(value: number) {
  return `${value.toLocaleString('it-IT', { maximumFractionDigits: 1 })} kg`;
}

function formatEuro(value: number) {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

export function InteractiveDemo() {
  const [selectedCrop, setSelectedCrop] = useState<CropOption>(cropOptions[0]);
  const [plants, setPlants] = useState('4');
  const [region, setRegion] = useState('lombardia');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRegion = regionHintMap[region] || 'Clima italiano vario e fertile.';
  const cropDetail = useMemo(() => {
    return (
      cropDetailMap[selectedCrop.key] ?? {
        period: 'Primavera - Estate',
        weather: 'Clima mite e terreno drenato',
        tip: 'Cura il terreno e raccogli regolarmente.',
        price: 3.0,
      }
    );
  }, [selectedCrop.key]);

  const plantCount = useMemo(() => {
    const value = Number(plants);
    return Number.isInteger(value) && value > 0 ? value : 4;
  }, [plants]);

  const result = useMemo(() => {
    const minKg = selectedCrop.config.yieldMin * plantCount;
    const maxKg = selectedCrop.config.yieldMax * plantCount;
    const avgKg = (minKg + maxKg) / 2;
    const revenue = avgKg * cropDetail.price;
    return {
      minKg,
      maxKg,
      harvestPeriod: cropDetail.period,
      idealWeather: cropDetail.weather,
      tip: cropDetail.tip,
      revenue,
    };
  }, [selectedCrop, plantCount, cropDetail]);

  const handleCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!plants || Number(plants) < 1) {
      setError('Inserisci un numero valido di piante.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <section id="demo" className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-beige via-white to-beige p-8 shadow-2xl">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-olive/80 font-semibold">Demo orto</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              🌱 Simula il tuo orto in 30 secondi
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Scopri produzione stimata, raccolti e consigli agricoli prima ancora di registrarti.
              Prova una simulazione rapida con colture, regioni e previsioni di guadagno per il tuo orto.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <form onSubmit={handleCalculate} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Coltura</label>
                <select
                  value={selectedCrop.key}
                  onChange={(event) => {
                    const crop = cropOptions.find((item) => item.key === event.target.value);
                    if (crop) setSelectedCrop(crop);
                  }}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
                >
                  {cropOptions.map((crop) => (
                    <option key={crop.key} value={crop.key}> 
                      {crop.config.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Numero piante</label>
                <input
                  type="number"
                  min={1}
                  value={plants}
                  onChange={(event) => setPlants(event.target.value)}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
                  placeholder="4"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Regione</label>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-olive focus:ring-2 focus:ring-olive/20"
                >
                  {regions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Button type="submit" className="w-full py-4 text-base font-semibold">
                Calcola il tuo orto
              </Button>
            </form>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Regione selezionata:</p>
              <p>{regions.find((item) => item.value === region)?.label}, {selectedRegion}</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Produzione stimata</p>
              <h3 className="mt-4 text-3xl font-semibold text-slate-900">{formatKg(result.minKg)}</h3>
              <p className="mt-2 text-slate-600">Minimo previsto dal tuo orto</p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Produzione stimata</p>
              <h3 className="mt-4 text-3xl font-semibold text-slate-900">{formatKg(result.maxKg)}</h3>
              <p className="mt-2 text-slate-600">Massimo possibile raccolto</p>
            </div>

            <div className="rounded-[2rem] border border-olive/15 bg-olive/5 p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-olive-700">Guadagno simulato</p>
              <h3 className="mt-4 text-3xl font-semibold text-olive-900">{formatEuro(result.revenue)}</h3>
              <p className="mt-2 text-olive-700">Stima ricavo senza registrazione.</p>
            </div>
          </div>
        ) : null}

        {submitted ? (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Periodo raccolta</p>
              <h4 className="mt-4 text-xl font-semibold text-slate-900">{result.harvestPeriod}</h4>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Meteo ideale</p>
              <h4 className="mt-4 text-xl font-semibold text-slate-900">{result.idealWeather}</h4>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Suggerimento</p>
              <h4 className="mt-4 text-xl font-semibold text-slate-900">{result.tip}</h4>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-emerald-50 p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Coltura</p>
              <h4 className="mt-4 text-xl font-semibold text-slate-900">{selectedCrop.config.name}</h4>
            </div>
          </div>
        ) : null}

        {submitted ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <div className="space-y-4 text-center">
              <p className="text-sm uppercase tracking-[0.35em] text-olive/80">Prossimo passo</p>
              <h3 className="text-3xl font-bold text-slate-900">🌱 Vuoi salvare il tuo orto e monitorarlo davvero?</h3>
              <p className="mx-auto max-w-2xl text-slate-600">
                Registrati gratis e trasforma questa simulazione in una vera gestione del tuo orto con raccolti,
                consigli e calendario agricolo personalizzato.
              </p>
              <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
                <Button href="/register" className="w-full sm:w-auto py-4 text-base">Registrati gratis</Button>
                <Button href="/login" variant="outline" className="w-full sm:w-auto py-4 text-base">Accedi</Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
