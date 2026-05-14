import { Button } from '@/components/ui/button';
import { Calculator } from '@/components/Calculator';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10 overflow-x-hidden">
      <div className="mx-auto max-w-6xl space-y-14">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-olive/80 font-semibold">Agromia</p>
                <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
                  Gestisci il tuo orto in modo semplice e concreto
                </h1>
              </div>
              <p className="text-lg leading-8 text-slate-600">
  Agromia: l&apos;app pensata per chi ama la terra. Monitora i tuoi successi, tieni d&apos;occhio i costi e goditi ogni raccolto: tutto quello che serve al tuo orto, in pochi semplici clic.
</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/dashboard">Vai alla dashboard</Button>
                <Button href="/crop/pomodoro" className="bg-slate-900 hover:bg-slate-800">
                  Guarda una scheda
                </Button>
              </div>
            </div>
            <div className="relative rounded-[2rem] overflow-hidden max-w-md mx-auto lg:max-w-none">
              <Image
                src="/images/agromia.png"
                alt="Agromia - Gestione orto"
                width={400}
                height={400}
                className="w-full h-auto object-cover rounded-[2rem]"
                priority
              />
              <div className="absolute inset-0 bg-black/20 rounded-[2rem]"></div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Tre modi per usare Agromia</h2>
            <p className="mt-2 text-slate-600">Scopri come semplificare la gestione del tuo orto</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Use Case 1 */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition max-w-full overflow-hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-olive/10 flex-shrink-0">
                <svg className="h-6 w-6 max-h-6 max-w-6 text-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Monitora la produzione</h3>
              <p className="mt-3 text-slate-600">
                Inserisci il numero di piante e visualizza la produzione stimata. Registra i raccolti reali e confronta con le stime.
              </p>
            </div>

            {/* Use Case 2 */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition max-w-full overflow-hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-olive/10 flex-shrink-0">
                <svg className="h-6 w-6 max-h-6 max-w-6 text-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Gestisci i costi</h3>
              <p className="mt-3 text-slate-600">
                Registra ogni spesa: semi, concime, attrezzi. Visualizza il totale e analizza i costi per coltura.
              </p>
            </div>

            {/* Use Case 3 */}
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition max-w-full overflow-hidden">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-olive/10 flex-shrink-0">
                <svg className="h-6 w-6 max-h-6 max-w-6 text-olive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Calcola il profitto</h3>
              <p className="mt-3 text-slate-600">
                Registra i ricavi e visualizza il profitto netto. Confronta gli utili tra diverse colture con dati real-time.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <Calculator />

        {/* Emotional Final Section */}
        <section className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-emerald-50 to-green-50 p-10 shadow-xl max-w-full overflow-hidden">
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-slate-900">Coltiva meglio, senza complicarti la giornata</h2>
              <p className="mt-4 text-lg leading-8 text-slate-700">
                Agromia nasce per aiutarti a seguire il tuo orto in modo semplice. Meno fogli sparsi, meno calcoli a mano, più tempo per coltivare davvero.
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-emerald-100 text-emerald-700 text-xl">
                    🌱
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Tieni tutto sotto controllo</h3>
                  <p className="mt-2 text-sm text-slate-600">Tutte le tue colture, i costi e i raccolti in un unico posto.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-100 text-yellow-700 text-xl">
                    ☀️
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Segui meteo e attività</h3>
                  <p className="mt-2 text-sm text-slate-600">Scopri cosa fare ogni giorno in base al clima e allo stato delle tue piante.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-700 text-xl">
                    📈
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Monitora i risultati</h3>
                  <p className="mt-2 text-sm text-slate-600">Raccolti, costi, profitti: i dati che contano davvero per il tuo orto.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button href="/dashboard" className="px-8 py-4 text-lg font-semibold bg-emerald-600 hover:bg-emerald-700">
                Inizia il tuo orto
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
