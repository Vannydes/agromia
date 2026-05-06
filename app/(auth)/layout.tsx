export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-beige px-4 py-10 text-slate-900 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-olive/15 bg-white/95 p-8 shadow-lg">
        {children}
      </div>
    </main>
  );
}
