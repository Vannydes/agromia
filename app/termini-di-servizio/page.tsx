import { BackButton } from '@/components/BackButton';

export const metadata = {
  title: 'Agromia | Termini di Servizio',
  description:
    'Termini di servizio di Agromia: uso della piattaforma, responsabilità utente, limitazioni, contenuti e aggiornamenti.',
};

export default function TerminiDiServizioPage() {
  return (
    <main className="min-h-screen bg-beige px-4 py-8 text-primary">
      <div className="mx-auto w-full max-w-5xl">
        <BackButton />

        <div className="rounded-[32px] border border-border-color bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Termini di servizio</p>
            <h1 className="text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Regole e responsabilità per l’uso di Agromia
            </h1>
            <p className="text-base leading-8 text-muted sm:text-lg">
              Questa pagina descrive il corretto utilizzo della piattaforma, le responsabilità dell’utente e le condizioni
              legali che regolano il servizio di Agromia.
            </p>
          </div>

          <section className="mt-10 space-y-8">
            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Utilizzo della piattaforma</h2>
              <p className="text-base leading-7 text-muted">
                Agromia è pensata per la gestione dell’orto e delle colture. Utilizza il servizio in modo responsabile e
                rispetta le linee guida presenti sul sito. L’accesso è riservato a utenti registrati e autorizzati.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Responsabilità utente</h2>
              <p className="text-base leading-7 text-muted">
                L’utente è responsabile dei dati inseriti e della veridicità delle informazioni fornite. Agromia non è
                responsabile per errori derivanti da dati non corretti o da un uso improprio della piattaforma.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Utilizzo beta</h2>
              <p className="text-base leading-7 text-muted">
                Alcune funzionalità possono essere in fase beta. Questo significa che potrebbero subire cambiamenti e che
                Agromia può aggiornare il servizio per migliorare l’esperienza senza preavviso esteso.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Limitazioni</h2>
              <p className="text-base leading-7 text-muted">
                Agromia fornisce strumenti utili, ma non garantisce risultati agricoli. Le previsioni e i consigli non
                sostituiscono il giudizio personale. Non è consentito l’uso del servizio per scopi illeciti.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Contenuti e dati</h2>
              <p className="text-base leading-7 text-muted">
                Tutti i contenuti generati dall’utente restano di sua proprietà, mentre Agromia conserva e gestisce i
                dati necessari per fornire il servizio. È vietata la pubblicazione di contenuti offensivi o illegali.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Modifiche future</h2>
              <p className="text-base leading-7 text-muted">
                Agromia può aggiornare questi termini in qualsiasi momento. Le modifiche saranno pubblicate sulla
                piattaforma e si applicheranno dal momento della pubblicazione.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Contatti</h2>
              <p className="text-base leading-7 text-muted">
                Per questioni legali o richieste sui termini di servizio, contatta <strong>supporto@agromia.app</strong>
                oppure visita la sezione assistenza del sito.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
