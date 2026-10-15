import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-brand text-void font-semibold hover:bg-brand-bright active:scale-[0.98] shadow-[0_6px_20px_-8px_rgba(34,197,94,0.6)]',
  secondary:
    'bg-surface-3 text-text border border-line hover:border-brand/50 hover:text-brand-bright',
  ghost: 'text-muted hover:text-text hover:bg-surface-2',
  danger: 'bg-danger/15 text-danger border border-danger/40 hover:bg-danger/25',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-150
        disabled:opacity-45 disabled:pointer-events-none cursor-pointer
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}
