import Link from 'next/link';import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termini di Servizio | Agromia',
  description: 'Termini di servizio di Agromia: responsabilità d&apos;uso, disponibilità del servizio, limitazioni e gestione dei contenuti.',
};

export default function TerminiDiServizioPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-olive/80 font-semibold">Agromia</p>
            <h1 className="text-4xl font-bold text-slate-900">Termini di Servizio</h1>
            <p className="text-slate-600 leading-7">
              Benvenuto su Agromia. Leggi attentamente i termini di utilizzo della piattaforma per comprendere le tue responsabilità e le condizioni di servizio.
            </p>
          </div>

          <div className="mt-10 space-y-8 text-slate-700">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Utilizzo della piattaforma</h2>
              <p className="leading-7">
                Agromia è pensata per la gestione di orti e colture. L&apos;utilizzo della piattaforma è consentito solo per scopi personali e agricoli legittimi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Responsabilità utente</h2>
              <p className="leading-7">
                Sei responsabile dei dati inseriti nel tuo account. Controlla che le informazioni siano accurate e usa la piattaforma in modo responsabile.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Disponibilità del servizio</h2>
              <p className="leading-7">
                Agromia cerca di mantenere il servizio disponibile in modo continuativo, ma potrebbero verificarsi interruzioni dovute a manutenzione, aggiornamenti o problemi tecnici.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Limitazione responsabilità</h2>
              <p className="leading-7">
                Agromia non è responsabile per danni diretti o indiretti derivanti dall&apos;uso della piattaforma. Le informazioni fornite sono a scopo informativo e non sostituiscono consulenze professionali.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Contenuti e dati</h2>
              <p className="leading-7">
                I contenuti e i dati inseriti dagli utenti rimangono sotto la responsabilità degli utenti stessi. Agromia si riserva il diritto di rimuovere contenuti non conformi ai termini.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Modifiche future</h2>
              <p className="leading-7">
                Questi termini possono essere aggiornati. Le modifiche saranno comunicate all&apos;interno dell&apos;app e, se necessario, via email agli utenti registrati.
              </p>
            </section>
          </div>
        </section>
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 text-center text-slate-700 shadow-sm">
          <p>Vuoi tornare alla pagina principale?</p>
          <Link href="/" className="mt-3 inline-flex rounded-full bg-olive px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
            Torna a Agromia
          </Link>
        </div>
      </div>
    </main>
  );
}
