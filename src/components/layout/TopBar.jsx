import { Flame, Coins, Zap } from 'lucide-react'

import { computeLevel, useGameStore } from '../../store/gameStore.js'
import ProgressBar from '../ui/ProgressBar.jsx'

/** Barra superior: nível, XP, moedas e sequência de estudos. */
export default function TopBar() {
  const xp = useGameStore((s) => s.xp)
  const coins = useGameStore((s) => s.coins)
  const streak = useGameStore((s) => s.streak)
  const { level, title, xpIntoLevel, xpForNext, percent } = computeLevel(xp)

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-ink/85 backdrop-blur px-4 md:px-6 h-16">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-bright">
          <Zap size={16} />
        </div>
        <div className="hidden sm:block leading-tight min-w-0">
          <p className="text-sm font-semibold truncate">
            Nível {level} · {title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <ProgressBar
              value={xpIntoLevel}
              max={xpForNext}
              className="w-28"
            />
            <span className="text-[11px] text-faint tabular-nums">
              {xpIntoLevel}/{xpForNext} XP
            </span>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Chip icon={Flame} value={streak.days} label="dias seguidos" accent="var(--color-amber)" />
        <Chip icon={Coins} value={coins} label="moedas" accent="var(--color-amber)" />
        <Chip icon={Zap} value={xp} label="XP total" accent="var(--color-brand)" />
      </div>
    </header>
  )
}

function Chip({ icon: ChipIcon, value, label, accent }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5">
      <ChipIcon size={14} style={{ color: accent }} />
      <span className="text-sm font-semibold tabular-nums">{value}</span>
      <span className="hidden lg:inline text-[11px] text-faint">{label}</span>
    </div>
  )
}
