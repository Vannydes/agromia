'use client';

import { ReactNode, useState } from 'react';

type CollapsibleSectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function CollapsibleSection({
  title,
  subtitle,
  children,
  defaultOpen = true,
  className = '',
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-6 shadow-xl ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 text-left transition duration-300 hover:opacity-90"
        aria-expanded={isOpen}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-olive/80 font-semibold truncate">{title}</p>
          {subtitle && <p className="mt-1 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">{subtitle}</p>}
        </div>
        <span className="rounded-full border border-olive/30 bg-olive/10 px-3 py-2 text-sm font-semibold text-olive transition duration-300 hover:bg-olive/15">
          {isOpen ? 'Chiudi sezione' : 'Apri sezione'}
        </span>
      </button>

      <div className={`mt-4 sm:mt-6 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {isOpen ? <div className="animate-in fade-in duration-300">{children}</div> : null}
      </div>
    </div>
  );
}
