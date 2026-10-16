import { useEffect, useState } from 'react'
import {
  ListOrdered,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  TriangleAlert,
} from 'lucide-react'

import Button from '../ui/Button.jsx'
import { generateGuide } from '../../services/guideService.js'
import { GUIDE_XP_COST, useGameStore } from '../../store/gameStore.js'

/**
 * StepByStep — roteiro passo a passo gerado por IA.
 *
 * O roteiro é revelado um passo por vez (o aluno conduz o ritmo) e fica
 * salvo no estado do jogo: reler não gasta nova consulta. "Gerar novamente"
 * faz uma nova chamada à IA e cobra de novo.
 */
export default function StepByStep({ mission, code }) {
  const guide = useGameStore((s) => s.guides[mission.id])
  const useGuide = useGameStore((s) => s.useGuide)
  const replaceGuide = useGameStore((s) => s.replaceGuide)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [visible, setVisible] = useState(1)
  const [copied, setCopied] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  // Recomeça a revelação ao trocar de missão
  useEffect(() => {
    setVisible(1)
    setCopied(null)
  }, [mission.id])

  // Cronômetro enquanto a IA escreve o roteiro
  useEffect(() => {
    if (!loading) return
    setElapsed(0)
    const started = Date.now()
    const timer = setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 500)
    return () => clearInterval(timer)
  }, [loading])

  async function handleGenerate(isRegenerate) {
    setLoading(true)
    setError(null)

    const result = await generateGuide({ code, mission })
    setLoading(false)

    if (result.status !== 'ok') {
      setError(result.message ?? 'Não foi possível gerar o passo a passo.')
      return
    }

    const guideData = {
      steps: result.steps,
      encouraging: result.encouraging ?? '',
      model: result.model ?? '',
    }

    if (isRegenerate) replaceGuide(mission.id, guideData)
    else useGuide(mission.id, guideData)

    setVisible(1)
  }

  async function copySnippet(text, index) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(index)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      /* clipboard indisponível — silencioso */
    }
  }

  const totalSteps = guide?.steps?.length ?? 0
  const revealed = guide?.steps?.slice(0, visible) ?? []
  const allRevealed = visible >= totalSteps

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <ListOrdered size={16} className="text-info" />
          <h4 className="text-sm font-semibold">Passo a passo</h4>
        </div>
        <span className="text-[11px] text-faint">
          −{GUIDE_XP_COST} XP · 1 consulta por missão
        </span>
      </div>

      {!guide && !loading && (
        <>
          <p className="text-[13px] text-muted mb-3">
            Travou? A IA monta um roteiro numerado para resolver esta missão —
            um passo de cada vez, sem entregar o programa pronto.
          </p>
          <Button variant="secondary" size="sm" onClick={() => handleGenerate(false)}>
            <Sparkles size={13} /> Gerar passo a passo
          </Button>
        </>
      )}

      {loading && (
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <TriangleAlert size={15} className="animate-pulse text-amber" />
          Escrevendo o roteiro...
          <span className="tabular-nums text-faint">{elapsed}s</span>
        </p>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-danger/40 bg-danger/8 p-3">
          <p className="text-[13px] text-danger">{error}</p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => handleGenerate(false)}
          >
            Tentar de novo
          </Button>
        </div>
      )}

      {guide && (
        <>
          <div className="space-y-2.5">
            {revealed.map((step) => (
              <div
                key={step.index}
                className="anim-rise rounded-xl border border-line-soft bg-void/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-info/15 text-info text-[11px] font-bold">
                    {step.index}
                  </span>
                  <p className="text-[13px] font-semibold">{step.title}</p>
                </div>

                <p className="mt-1.5 text-[13px] leading-relaxed text-text/85">
                  {step.detail}
                </p>

                {step.code && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-line-soft bg-void">
                    <pre className="overflow-x-auto px-3 py-2 font-mono text-[12px] leading-5 text-brand-bright/90 whitespace-pre">
                      {step.code}
                    </pre>
                    <button
                      onClick={() => copySnippet(step.code, step.index)}
                      className="flex w-full items-center justify-center gap-1.5 border-t border-line-soft py-1.5 text-[11px] text-muted hover:text-brand-bright"
                    >
                      {copied === step.index ? (
                        <>
                          <Check size={11} /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy size={11} /> Copiar trecho
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!allRevealed && (
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => setVisible((v) => Math.min(v + 1, totalSteps))}
            >
              Próximo passo <ChevronRight size={13} />
              <span className="text-faint ml-1">
                {visible}/{totalSteps}
              </span>
            </Button>
          )}

          {allRevealed && (
            <div className="mt-3">
              {guide.encouraging && (
                <p className="rounded-xl border border-info/25 bg-info/8 px-3 py-2.5 text-[13px] text-text/85">
                  {guide.encouraging}
                </p>
              )}
              <button
                onClick={() => handleGenerate(true)}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-muted hover:text-brand-bright"
              >
                <RotateCcw size={12} /> Gerar novamente (nova consulta · −
                {GUIDE_XP_COST} XP)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
