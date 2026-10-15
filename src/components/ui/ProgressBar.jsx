/**
 * ProgressBar — barra de progresso com cor configurável.
 * Animação suave de largura ao montar/atualizar.
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'var(--color-brand)',
  className = '',
  showLabel = false,
}) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-[11px] text-muted mb-1">
          <span>{value}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
