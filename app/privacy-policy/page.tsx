import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Agromia',
  description: 'Informativa privacy di Agromia: dati raccolti, cookie, analytics, uso di Supabase e diritti GDPR per proteggere la tua esperienza.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-olive/80 font-semibold">Agromia</p>
            <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-slate-600 leading-7">
              Agromia raccoglie solo i dati necessari al funzionamento dell&apos;applicazione. La tua privacy è importante: non vendiamo i tuoi dati e li utilizziamo esclusivamente per offrire un servizio migliore.
            </p>
          </div>

          <div className="mt-10 space-y-8 text-slate-700">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Dati raccolti</h2>
              <p className="leading-7">
                Raccogliamo informazioni essenziali per far funzionare il servizio: dati di account, dati relativi alle colture, attività, costi e preferenze utente.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Autenticazione</h2>
              <p className="leading-7">
                L&apos;accesso a Agromia avviene tramite Supabase Auth. I dati di autenticazione sono gestiti in modo sicuro e necessari per proteggere il tuo profilo.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Utilizzo cookie</h2>
              <p className="leading-7">
                Utilizziamo cookie e tecnologie simili per mantenere la sessione attiva, migliorare l&apos;esperienza utente e ricordare le scelte di navigazione.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Analytics</h2>
              <p className="leading-7">
                Usiamo analytics in forma anonima per migliorare il servizio e capire come rendere Agromia più utile. I dati non vengono venduti a terzi.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Utilizzo Supabase</h2>
              <p className="leading-7">
                I dati dell&apos;applicazione sono archiviati su Supabase. Questo include profili utente, informazioni sulle colture, costi e raccolti, necessari per il corretto funzionamento della piattaforma.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Contatti</h2>
              <p className="leading-7">
                Per domande sulla privacy o richieste relative ai tuoi dati, contattaci direttamente attraverso i canali ufficiali di Agromia.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">Diritti utente GDPR</h2>
              <p className="leading-7">
                Hai il diritto di accedere, correggere e cancellare i tuoi dati. Puoi richiedere la portabilità dei dati e revocare il consenso ove previsto dalle normative GDPR.
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
