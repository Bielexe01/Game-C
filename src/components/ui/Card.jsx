/**
 * Card — superfície padrão do jogo.
 * `interactive` adiciona hover/raising para cartões clicáveis.
 */
export default function Card({
  as: Tag = 'div',
  interactive = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface p-5 ${
        interactive
          ? 'transition-all duration-200 hover:border-brand/40 hover:bg-surface-2 hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, subtitle, right = null }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div>
        <h3 className="font-semibold text-text">{title}</h3>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
