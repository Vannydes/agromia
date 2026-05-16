'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUserCrops, type Crop } from '@/lib/cropService';
import { useAuth } from '@/lib/auth-context';

export default function MyCropsPage() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'custom' | 'standard'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const loadCrops = async () => {
      setLoading(true);
      setError(null);

      try {
        const cropsResult = await getUserCrops();
        setCrops(cropsResult);
      } catch (err) {
        console.error('[MyCrops] Error loading crops:', err);
        setError(err instanceof Error ? err.message : 'Impossibile caricare le colture.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadCrops();
    }
  }, [user]);

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'custom' && crop.custom_crop_id) ||
        (filterType === 'standard' && !crop.custom_crop_id);

      return matchesSearch && matchesFilter;
    });
  }, [crops, searchTerm, filterType]);

  return (
    <div className="space-y-10 px-4 py-10 sm:px-6 lg:px-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-olive/80 font-semibold">Le mie colture</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">Gestisci e monitora tutte le colture del tuo orto</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Una pagina dedicata per cercare, filtrare e rivedere tutte le colture registrate in modo ordinato e professionale.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/dashboard" variant="outline" className="px-6 py-3 text-base">
              Torna alla dashboard
            </Button>
            <Button href="/add-crop" className="px-6 py-3 text-base">
              Aggiungi coltura
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-4 sm:grid-cols-2 sm:items-center">
            <Input
              label="Cerca colture"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nome coltura..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'custom', 'standard'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  filterType === type
                    ? 'bg-olive text-white'
                    : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {type === 'all' ? 'Tutte' : type === 'custom' ? 'Personalizzate' : 'Standard'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500 shadow-sm">
              Caricamento delle colture...
            </div>
          ) : error ? (
            <div className="col-span-full rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-700 shadow-sm">
              {error}
            </div>
          ) : filteredCrops.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center text-slate-600 shadow-sm">
              Nessuna coltura corrisponde ai criteri di ricerca.
            </div>
          ) : (
            filteredCrops.map((crop) => (
              <div key={crop.id} className="group rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-olive/20 hover:bg-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Coltura</p>
                    <h2 className="mt-3 text-xl font-semibold text-slate-900">{crop.name}</h2>
                  </div>
                  {crop.custom_crop_id ? (
                    <span className="inline-flex items-center rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-olive">
                      Personalizzata
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Piante</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{crop.plants}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Registrata</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">{new Date(crop.created_at).toLocaleDateString('it-IT')}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-slate-500">ID: {crop.id.slice(0, 8)}</div>
                  <Link href={`/dashboard/crops/${crop.id}`} className="rounded-full border border-olive/20 bg-olive/10 px-4 py-2 text-sm font-semibold text-olive transition hover:bg-olive/20">
                    Dettagli coltura
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
