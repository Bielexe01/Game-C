import { Circle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

/**
 * CriteriaList — critérios de aprovação da missão.
 * Antes da execução: apenas enunciados. Depois: estado real de cada teste.
 */
export default function CriteriaList({ criteria = [], results = null, running = false }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <h4 className="text-sm font-semibold mb-3">Critérios de aprovação</h4>
      <ul className="space-y-2">
        {criteria.map((criterion) => {
          const result = results?.find((r) => r.id === criterion.id)
          const Icon = running
            ? Loader2
            : result
              ? result.passed
                ? CheckCircle2
                : XCircle
              : Circle

          return (
            <li
              key={criterion.id}
              className="flex items-start gap-2.5 text-[13px] text-text/90"
            >
              <Icon
                size={15}
                className={`mt-0.5 shrink-0 ${
                  running
                    ? 'animate-spin text-muted'
                    : result
                      ? result.passed
                        ? 'text-brand'
                        : 'text-danger'
                      : 'text-faint'
                }`}
              />
              <div className="min-w-0">
                <p>{criterion.label}</p>
                {criterion.expected && (
                  <code className="mt-1 block rounded-md bg-void border border-line-soft px-2 py-1 font-mono text-[11px] text-muted overflow-x-auto">
                    entrada: {criterion.stdin ? JSON.stringify(criterion.stdin) : '(vazia)'} ·
                    saída esperada: {JSON.stringify(criterion.expected)}
                  </code>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
