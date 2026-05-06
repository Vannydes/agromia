import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-beige text-slate-900">
      <Navbar />
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="border-l border-olive/10 bg-white/80 p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
