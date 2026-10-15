import { CheckCircle2, XCircle, Info, TriangleAlert, Award, ArrowRight } from 'lucide-react'

import Button from '../ui/Button.jsx'

/**
 * ResultPanel — resultado educativo da execução.
 * Estados possíveis:
 *  · idle        ainda não executou
 *  · unconfigured execução real indisponível (Judge0 não configurado)
 *  · running     enviando ao juiz
 *  · passed      todos os critérios ok → mostra explicação e recompensas
 *  · failed      algum critério falhou → mostra o teste que falhou
 *  · error       falha de comunicação com o juiz
 */
export default function ResultPanel({
  state, // { kind, results, message, explanation, summary, model, mission }
  elapsed = 0,
  onNext,
  hasNext = false,
}) {
  if (!state || state.kind === 'idle') return null

  const shell = 'anim-pop rounded-2xl border p-4'

  if (state.kind === 'running') {
    return (
      <div className={`${shell} border-line bg-surface`}>
        <p className="flex items-center gap-2 text-sm text-muted">
          <TriangleAlert size={16} className="animate-pulse text-amber" />
          A IA está analisando seu código contra os critérios...
          <span className="tabular-nums text-faint">{elapsed}s</span>
        </p>
        <p className="mt-2 text-[12px] text-faint">
          O modelo rastreia o programa linha a linha antes de responder — normal
          levar de 15 a 40 segundos.
        </p>
      </div>
    )
  }

  if (state.kind === 'unconfigured') {
    return (
      <div className={`${shell} border-info/30 bg-info/8`}>
        <div className="flex items-start gap-3">
          <Info size={18} className="text-info shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-info mb-1">Execução não configurada</p>
            <p className="text-text/80">{state.message}</p>
            <code className="mt-2 block rounded-md bg-void border border-line-soft px-2 py-1.5 font-mono text-[11px] text-muted">
              cp .env.example .env # e preencha GATEWAY_KEY com sua chave
            </code>
          </div>
        </div>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className={`${shell} border-danger/40 bg-danger/8`}>
        <div className="flex items-start gap-3">
          <XCircle size={18} className="text-danger shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-danger mb-1">Erro na execução</p>
            <p className="text-text/80">{state.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (state.kind === 'failed') {
    const failed = state.results.filter((r) => !r.passed)
    return (
      <div className={`${shell} border-danger/40 bg-danger/8`}>
        <div className="flex items-start gap-3 mb-3">
          <XCircle size={18} className="text-danger shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-danger">Ainda não — {failed.length} teste(s) falharam</p>
            <p className="text-[13px] text-text/75">
              Leia o teste que falhou, ajuste um detalhe por vez e execute de novo.
              Erros são parte do aprendizado.
            </p>
          </div>
        </div>
        <ul className="space-y-2">
          {failed.map((r) => (
            <li key={r.id} className="rounded-xl border border-danger/25 bg-void/60 p-3">
              <p className="text-[13px] font-medium text-text">{r.label}</p>
              {r.reason && (
                <p className="mt-1.5 text-[13px] text-danger/90">{r.reason}</p>
              )}
              {r.expected && (
                <code className="mt-2 block rounded-md bg-void border border-line-soft px-2 py-1 font-mono text-[11px] text-muted overflow-x-auto">
                  saída esperada: {JSON.stringify(r.expected)}
                </code>
              )}
              {r.compileOutput && (
                <pre className="mt-2 overflow-x-auto font-mono text-[11px] text-danger/90 whitespace-pre-wrap">
                  {r.compileOutput}
                </pre>
              )}
            </li>
          ))}
        </ul>

        {state.summary && (
          <div className="mt-3 rounded-xl border border-line bg-void/60 p-3.5">
            <p className="text-[11px] uppercase tracking-wider text-faint mb-1">
              Comentário do professor IA
              {state.model && <span className="normal-case"> · {state.model}</span>}
            </p>
            <p className="text-[13px] text-text/85 leading-relaxed">{state.summary}</p>
          </div>
        )}
      </div>
    )
  }

  // passed
  return (
    <div className={`${shell} border-brand/40 bg-brand/8`}>
      <div className="flex items-start gap-3 mb-3">
        <CheckCircle2 size={20} className="text-brand shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-brand-bright flex items-center gap-2">
            Missão concluída!
            {state.mission?.boss && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber/20 border border-amber/40 px-2 py-0.5 text-[11px] text-amber">
                <Award size={11} /> CHEFÃO
              </span>
            )}
          </p>
          <p className="text-[13px] text-text/80">
            +{state.mission?.xp} XP · +{state.mission?.coins} moedas
            {state.model && (
              <span className="text-faint"> · julgado por {state.model}</span>
            )}
          </p>
        </div>
      </div>

      {state.summary && (
        <div className="rounded-xl border border-line bg-void/60 p-3.5 mb-2">
          <p className="text-[11px] uppercase tracking-wider text-faint mb-1">
            Comentário do professor IA
          </p>
          <p className="text-[13px] text-text/85 leading-relaxed">{state.summary}</p>
        </div>
      )}

      {state.explanation && (
        <div className="rounded-xl border border-line bg-void/60 p-3.5">
          <p className="text-[11px] uppercase tracking-wider text-faint mb-1">
            Por que funcionou
          </p>
          <p className="text-[13px] text-text/85 leading-relaxed">{state.explanation}</p>
        </div>
      )}

      {hasNext && (
        <Button className="mt-3" onClick={onNext}>
          Próxima missão <ArrowRight size={15} />
        </Button>
      )}
    </div>
  )
}
