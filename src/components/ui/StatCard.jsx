import Card from './Card.jsx'

/** StatCard — KPI do dashboard (XP, moedas, missões, sequência...). */
export default function StatCard({ icon: Icon, label, value, hint, accent = 'var(--color-brand)' }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ backgroundColor: `color-mix(in oklab, ${accent} 16%, transparent)`, color: accent }}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="text-xl font-bold text-text tabular-nums leading-tight">{value}</p>
          {hint && <p className="text-[11px] text-faint">{hint}</p>}
        </div>
      </div>
    </Card>
  )
}
