import { Navbar } from '@/components/layout/navbar';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-beige text-slate-900">
      <Navbar />
      <div className="px-4 py-8 md:px-8">{children}</div>
    </main>
  );
}
