interface CardProps {
  title: string;
  description?: string;
  value?: string;
  className?: string;
}

export function Card({ title, description, value, className = '' }: CardProps) {
  return (
    <div className={`rounded-3xl border border-olive/10 bg-white p-8 shadow-md transition hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
        </div>
        {value ? <span className="rounded-full bg-olive px-3 py-1 text-sm font-semibold text-white">{value}</span> : null}
      </div>
    </div>
  );
}
