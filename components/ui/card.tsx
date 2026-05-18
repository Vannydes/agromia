interface CardProps {
  title: string;
  description?: string;
  value?: string;
  className?: string;
}

export function Card({ title, description, value, className = '' }: CardProps) {
  return (
    <div className={`rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-[0_25px_70px_rgba(20,80,40,0.1)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_85px_rgba(20,80,40,0.15)] ${className}`}>
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
