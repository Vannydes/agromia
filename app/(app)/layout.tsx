import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(199,222,198,0.36),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(213,186,147,0.22),_transparent_25%),#f7f3eb] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-200/25 blur-3xl" />
        <div className="absolute right-0 top-1/4 h-52 w-52 rounded-full bg-amber-100/30 blur-3xl" />
        <div className="absolute left-0 bottom-10 h-56 w-56 rounded-full bg-emerald-100/35 blur-3xl" />
      </div>
      <Navbar />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar />
        <div className="border-l border-olive/10 bg-white/85 p-6 sm:p-8 backdrop-blur-xl">{children}</div>
      </div>
    </div>
  );
}
