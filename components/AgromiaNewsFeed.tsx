'use client';

import { Button } from '@/components/ui/button';
import { getNewsFeedItems, type NewsFeedItem } from '@/lib/newsFeed';

type AgromiaNewsFeedProps = {
  limit?: number;
  title?: string;
  subtitle?: string;
};

export function AgromiaNewsFeed({
  limit,
  title = 'News agricole',
  subtitle = 'Ultimi consigli, aggiornamenti e spunti per il tuo orto.',
}: AgromiaNewsFeedProps) {
  const news = getNewsFeedItems();
  const visibleNews = limit ? news.slice(0, limit) : news;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 shadow-xl">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-olive/80 font-semibold">News</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{title}</h2>
          <p className="mt-3 max-w-2xl text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
        {visibleNews.map((item) => (
          <article key={item.id} className="group w-full min-w-0 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 min-h-[260px] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-olive/20 hover:bg-white hover:shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-3xl bg-olive/10 text-2xl">
                {item.icon}
              </div>
              <div>
                <p className="break-words text-base md:text-lg font-semibold text-slate-900">{item.title}</p>
                <span className="mt-1 inline-block rounded-full bg-olive/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-olive">
                  {item.category}
                </span>
              </div>
            </div>

            <p className="mt-5 break-words text-base leading-7 text-slate-600">{item.description}</p>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                {item.highlight}
              </span>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em]"
              >
                Approfondisci
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
