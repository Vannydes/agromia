import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'default' | 'outline';
  className?: string;
}

const baseStyles =
  'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed';

const variants = {
  default: 'bg-olive text-white shadow-[0_18px_45px_rgba(20,80,40,0.18)] hover:bg-emerald-700',
  outline: 'border border-olive/20 bg-white text-slate-900 shadow-sm hover:bg-olive-50'
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
