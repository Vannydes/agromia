import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'default' | 'outline';
  className?: string;
}

const baseStyles =
  'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition disabled:opacity-60';

const variants = {
  default: 'bg-olive text-white hover:bg-emerald-700',
  outline: 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100'
};

export function Button({ href, variant = 'default', className = '', children, type = 'button', ...props }: ButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
