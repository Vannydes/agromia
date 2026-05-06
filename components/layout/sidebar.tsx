import Link from 'next/link';

const sections = [
  { href: '/dashboard', label: 'Dashboard' },
];

export function Sidebar() {
  return (
    <aside className="border-r border-olive/10 bg-olive p-6 text-white">
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-beige">Agromia</p>
          <p className="mt-3 text-2xl font-semibold">Il tuo spazio verde</p>
        </div>
        <nav className="space-y-2">
          {sections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-3xl px-4 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
