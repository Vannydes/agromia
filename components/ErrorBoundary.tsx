'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Agromia Error]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-beige px-4 py-10 text-primary">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-border-color bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">Ops, qualcosa è andato storto</h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              L’app ha rilevato un errore. Prova a ricaricare la pagina o torna alla home.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.location.reload();
                  }
                }}
                className="inline-flex items-center justify-center rounded-full border border-border-color bg-olive/10 px-5 py-3 text-sm font-semibold text-olive transition hover:bg-olive/20"
              >
                Ricarica pagina
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-border-color bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-surface"
              >
                Vai alla home
              </a>
            </div>
            {this.state.error ? (
              <pre className="mt-6 overflow-x-auto rounded-3xl bg-slate-100 p-4 text-sm text-slate-700">
                {this.state.error.message}
              </pre>
            ) : null}
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
