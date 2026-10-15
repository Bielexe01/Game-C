import { useState } from 'react'
import { Lightbulb, Sparkles } from 'lucide-react'

import Button from '../ui/Button.jsx'

/**
 * HintsPanel — sistema de dicas progressivas.
 * Cada dica revelada custa 5 XP (aplicado pelo store) e nunca entrega
 * a solução completa de uma vez: a última dica aproxima, mas não copia.
 */
export default function HintsPanel({ hints = [], usedCount = 0, onUseHint }) {
  const [openIndex, setOpenIndex] = useState(usedCount > 0 ? usedCount - 1 : -1)

  const remaining = hints.length - usedCount
  const allRevealed = remaining <= 0

  function revealNext() {
    onUseHint?.()
    setOpenIndex(usedCount)
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-amber" />
          <h4 className="text-sm font-semibold">Precisa de ajuda?</h4>
        </div>
        <span className="text-[11px] text-faint">
          {usedCount}/{hints.length} usadas · −5 XP por dica
        </span>
      </div>

      <div className="space-y-2">
        {hints.slice(0, usedCount).map((hint, i) => (
          <div
            key={i}
            className="anim-rise rounded-xl border border-amber/25 bg-amber/8 px-3.5 py-2.5 text-[13px] text-text/90"
          >
            <span className="text-amber font-medium">Dica {i + 1}: </span>
            {hint}
          </div>
        ))}
      </div>

      {!allRevealed && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-3"
          onClick={revealNext}
        >
          <Sparkles size={13} />
          Revelar dica {usedCount + 1}
        </Button>
      )}

      {allRevealed && hints.length > 0 && (
        <p className="mt-3 text-[12px] text-faint">
          Todas as dicas foram reveladas. Tente ajustar um detalhe por vez — o
          erro aqui é informação.
        </p>
      )}

      {hints.length === 0 && (
        <p className="text-[12px] text-faint">Esta missão não tem dicas.</p>
      )}
    </div>
  )
}
