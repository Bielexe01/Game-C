const TONES = {
  brand: 'bg-brand/12 text-brand-bright border-brand/30',
  muted: 'bg-surface-3 text-muted border-line',
  amber: 'bg-amber/12 text-amber border-amber/30',
  info: 'bg-info/12 text-info border-info/30',
  danger: 'bg-danger/12 text-danger border-danger/30',
}

/** Badge — etiquetas curtas: dificuldade, XP, conceitos, status. */
export default function Badge({ tone = 'muted', icon: Icon, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium
        ${TONES[tone]} ${className}`}
    >
      {Icon && <Icon size={11} />}
      {children}
    </span>
  )
}
