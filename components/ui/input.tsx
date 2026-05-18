interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        className={`w-full rounded-[1.75rem] border border-slate-200 bg-white/95 px-4 py-3 text-sm text-slate-900 outline-none shadow-sm transition duration-300 focus:border-olive focus:ring-2 focus:ring-emerald-100 disabled:opacity-50 ${className}`}
        {...props}
      />
    </label>
  );
}
