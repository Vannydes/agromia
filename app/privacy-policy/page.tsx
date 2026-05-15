import { BackButton } from '@/components/BackButton';

export const metadata = {
  title: 'Agromia | Informativa Privacy',
  description:
    'Scopri come Agromia raccoglie, utilizza e protegge i tuoi dati. Informazioni su account, analytics, cookie e Supabase.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-beige px-4 py-8 text-primary">
      <div className="mx-auto w-full max-w-5xl">
        <BackButton />

        <div className="rounded-[32px] border border-border-color bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Informativa privacy</p>
            <h1 className="text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Protezione dei tuoi dati con Agromia
            </h1>
            <p className="text-base leading-8 text-muted sm:text-lg">
              Su Agromia trattiamo i dati con cura e trasparenza. Questa pagina spiega quali informazioni raccogliamo,
              come le utilizziamo e come garantiamo la sicurezza del tuo account, delle analisi e dei cookie.
            </p>
          </div>

          <section className="mt-10 space-y-8">
            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Dati raccolti</h2>
              <p className="text-base leading-7 text-muted">
                Agromia raccoglie informazioni essenziali per offrirti un’esperienza personalizzata. Questo include:
              </p>
              <ul className="list-disc space-y-2 pl-5 text-muted">
                <li>Dati anagrafici inseriti durante la registrazione;</li>
                <li>informazioni sul tuo orto e sulle colture;</li>
                <li>preferenze dell’utente e impostazioni del profilo;</li>
                <li>dati tecnici di navigazione e utilizzo del sito.</li>
              </ul>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Autenticazione account</h2>
              <p className="text-base leading-7 text-muted">
                La creazione dell’account richiede un indirizzo email valido e una password. Utilizziamo questi dati
                esclusivamente per la gestione dell’accesso e per proteggere il tuo profilo.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Utilizzo analytics</h2>
              <p className="text-base leading-7 text-muted">
                Monitoriamo l’uso della piattaforma per migliorare le funzionalità e l’esperienza. I dati sono raccolti
                in forma anonima e aggregata quando possibile.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Cookie tecnici</h2>
              <p className="text-base leading-7 text-muted">
                Utilizziamo cookie tecnici necessari per il funzionamento del sito, il mantenimento della sessione e il
                salvataggio delle preferenze. Questi cookie non tracciano attività esterne al dominio Agromia.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Google Analytics</h2>
              <p className="text-base leading-7 text-muted">
                Agromia può usare Google Analytics per analizzare il traffico e migliorare i contenuti. I dati sono
                trattati secondo le politiche di Google e non vengono condivisi con terze parti per scopi commerciali.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Microsoft Clarity</h2>
              <p className="text-base leading-7 text-muted">
                Microsoft Clarity aiuta a ottimizzare l’interfaccia utente e a comprendere i comportamenti degli utenti.
                Vengono raccolti dati anonimi per analisi quali click, scroll e interazioni con la piattaforma.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Dati salvati su Supabase</h2>
              <p className="text-base leading-7 text-muted">
                I dati del tuo account e le informazioni delle colture sono archiviati in Supabase. Supabase fornisce
                infrastruttura sicura e crittografia per mantenere le informazioni protette.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-border-color bg-surface p-6">
              <h2 className="text-2xl font-semibold text-primary">Contatti</h2>
              <p className="text-base leading-7 text-muted">
                Per domande sulla privacy, scrivi a <strong>privacy@agromia.app</strong> o contatta il supporto tramite
                il form del sito. Rispettiamo le richieste relative ai tuoi dati personali e forniamo assistenza rapida.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
