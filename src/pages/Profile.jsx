import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Target, Flame, CheckCircle2, XCircle, RotateCcw, User } from 'lucide-react'

import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'

import { MISSIONS } from '../data/missions.js'
import { getPhaseById } from '../data/phases.js'
import {
  buildStats,
  computeLevel,
  getNextMission,
  useGameStore,
} from '../store/gameStore.js'

/** Perfil de aprendizagem — histórico, desempenho por missão e próximos objetivos. */
export default function Profile() {
  const state = useGameStore()
  const resetAll = useGameStore((s) => s.resetAll)
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)

  const { level, title, percent } = computeLevel(state.xp)
  const stats = buildStats(state)
  const nextMission = getNextMission(state)

  const accuracy = stats.totalAttempts
    ? Math.round((stats.completedCount / stats.totalAttempts) * 100)
    : 0

  const attempted = MISSIONS.filter((m) => state.missions[m.id])

  return (
    <div className="anim-rise space-y-6">
      {/* Cabeçalho do perfil */}
      <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand/15 text-brand-bright">
          <User size={30} />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Aluno de C</h1>
          <p className="text-sm text-muted">
            Nível {level} · {title}
          </p>
          <ProgressBar value={percent} max={100} className="mt-2 max-w-sm" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand tabular-nums">{state.xp}</p>
          <p className="text-[11px] text-faint">XP acumulado</p>
        </div>
      </Card>

      {/* Indicadores */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Target} label="Missões concluídas" value={`${stats.completedCount}/${stats.totalMissions}`} accent="var(--color-info)" />
        <StatCard icon={Zap} label="Tentativas registradas" value={stats.totalAttempts} />
        <StatCard icon={Flame} label="Sequência de estudos" value={`${state.streak.days} dia(s)`} accent="var(--color-amber)" />
        <StatCard icon={CheckCircle2} label="Aproveitamento" value={`${accuracy}%`} hint="concluídas ÷ tentativas" />
      </div>

      {/* Histórico de desempenho */}
      <Card>
        <h3 className="font-semibold mb-4">Histórico de desempenho</h3>

        {attempted.length === 0 ? (
          <p className="text-sm text-muted">
            Nenhuma missão iniciada ainda. Comece pela primeira missão do mapa.
          </p>
        ) : (
          <ul className="space-y-2">
            {attempted.map((mission) => {
              const m = state.missions[mission.id]
              const phase = getPhaseById(mission.phaseId)
              const done = m.status === 'concluida'

              return (
                <li
                  key={mission.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-line-soft bg-void/40 px-3.5 py-3"
                >
                  {done ? (
                    <CheckCircle2 size={16} className="text-brand shrink-0" />
                  ) : (
                    <XCircle size={16} className="text-amber shrink-0" />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium truncate">{mission.title}</p>
                    <p className="text-[11px] text-faint">
                      {phase?.title} · {m.attempts} tentativa(s) ·{' '}
                      {m.hintsUsed ?? 0} dica(s)
                    </p>
                  </div>

                  <Badge tone={done ? 'brand' : 'amber'}>
                    {done ? 'Concluída' : 'Em andamento'}
                  </Badge>

                  <button
                    onClick={() => navigate(`/missao/${mission.id}`)}
                    className="text-[12px] text-brand-bright hover:underline"
                  >
                    {done ? 'Revisar' : 'Continuar'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      {/* Revisão inteligente + próximos objetivos */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold mb-2">Revisão inteligente</h3>
          <p className="text-[13px] text-muted mb-3">
            Refaça missões com erros ou dicas usadas — repetir o exercício com
            dificuldade é o caminho mais rápido para fixar.
          </p>
          {(() => {
            const toReview = attempted.filter((m) => {
              const record = state.missions[m.id]
              return (
                record.passed &&
                ((record.hintsUsed ?? 0) > 0 || (record.guideUsed ?? 0) > 0)
              )
            })
            const failed = attempted.filter((m) => state.missions[m.id].attempts > 1 && !state.missions[m.id].passed)

            if (failed.length === 0 && toReview.length === 0) {
              return (
                <p className="text-[13px] text-faint">
                  Nada para revisar por enquanto — seus registros estão limpos.
                </p>
              )
            }
            return (
              <ul className="space-y-2">
                {failed.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-[13px]">
                    <span>{m.title}</span>
                    <button
                      onClick={() => navigate(`/missao/${m.id}`)}
                      className="text-brand-bright hover:underline"
                    >
                      Tentar de novo
                    </button>
                  </li>
                ))}
                {toReview.map((m) => (
                  <li key={m.id} className="flex items-center justify-between text-[13px]">
                    <span className="text-muted">
                      {m.title} (usou dicas{state.missions[m.id].guideUsed ? ' / passo a passo' : ''})
                    </span>
                    <button
                      onClick={() => navigate(`/missao/${m.id}`)}
                      className="text-brand-bright hover:underline"
                    >
                      Refazer sem dicas
                    </button>
                  </li>
                ))}
              </ul>
            )
          })()}
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Próximos objetivos</h3>
          {nextMission ? (
            <div className="space-y-3">
              <div>
                <p className="text-[15px] font-medium">{nextMission.title}</p>
                <p className="text-[13px] text-muted mt-0.5">{nextMission.objective}</p>
              </div>
              <Button onClick={() => navigate(`/missao/${nextMission.id}`)}>
                Começar missão
              </Button>
            </div>
          ) : (
            <p className="text-[13px] text-muted">
              Todas as missões cadastradas foram concluídas. As fases de Funções,
              Vetores e Matrizes entram na próxima etapa.
            </p>
          )}
        </Card>
      </div>

      {/* Zerar progresso */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold">Zerar progresso</h3>
            <p className="text-[13px] text-muted">
              Apaga XP, moedas, missões e conquistas salvos neste navegador.
            </p>
          </div>

          {confirmReset ? (
            <div className="flex items-center gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  resetAll()
                  setConfirmReset(false)
                }}
              >
                Confirmar exclusão
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={15} /> Zerar progresso
            </Button>
          )}
        </div>
      </Card>

      <p className="text-[11px] text-faint">
        Progresso salvo em localStorage ({MISSIONS.length} missões cadastradas).
      </p>
    </div>
  )
}
