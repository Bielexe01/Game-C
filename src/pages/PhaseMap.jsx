import { useNavigate } from 'react-router-dom'
import { Lock, CheckCircle2, Play, Swords, Circle, FileText, ExternalLink } from 'lucide-react'

import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import Icon from '../components/ui/Icon.jsx'

import { PHASES } from '../data/phases.js'
import { getMissionsByPhase } from '../data/missions.js'
import {
  getPhaseProgress,
  isMissionUnlocked,
  isPhaseUnlocked,
  useGameStore,
} from '../store/gameStore.js'

/** Mapa de fases — trilha vertical com nós desbloqueáveis. */
export default function PhaseMap() {
  const state = useGameStore()
  const navigate = useNavigate()

  return (
    <div className="anim-rise space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mapa de fases</h1>
        <p className="text-sm text-muted mt-1">
          A trilha segue a sequência das aulas. Cada fase abre ao concluir as
          missões da anterior — nada de conteúdo futuro antes da hora.
        </p>
      </div>

      <div className="relative space-y-5">
        {/* Linha da trilha (desktop) */}
        <div className="trail-line absolute left-[26px] top-4 bottom-4 w-px hidden sm:block" />

        {PHASES.map((phase) => {
          const unlocked = isPhaseUnlocked(state, phase)
          const progress = getPhaseProgress(state, phase.id)
          const missions = getMissionsByPhase(phase.id)
          const comingSoon = phase.status === 'em-breve'

          return (
            <div key={phase.id} className="relative sm:pl-16">
              {/* Nó da trilha */}
              <div className="absolute left-0 top-4 hidden sm:grid">
                <div
                  className={`grid h-[52px] w-[52px] place-items-center rounded-2xl border-2 ${
                    unlocked && !comingSoon
                      ? 'bg-surface border-transparent'
                      : 'bg-surface-2 border-line text-faint'
                  }`}
                  style={
                    unlocked && !comingSoon
                      ? { borderColor: phase.color, color: phase.color }
                      : undefined
                  }
                >
                  {comingSoon ? (
                    <Lock size={18} />
                  ) : progress.done >= progress.total && progress.total > 0 ? (
                    <CheckCircle2 size={22} />
                  ) : (
                    <Icon name={phase.icon} size={20} />
                  )}
                </div>
              </div>

              <Card
                interactive={unlocked && !comingSoon}
                onClick={
                  unlocked && !comingSoon
                    ? () => navigate(`/missao/${missions[0]?.id}`)
                    : undefined
                }
                className={unlocked && !comingSoon ? '' : 'opacity-70'}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge tone={unlocked && !comingSoon ? 'brand' : 'muted'}>
                        Fase {phase.order}
                      </Badge>
                      {comingSoon ? (
                        <Badge tone="muted">Em breve</Badge>
                      ) : !unlocked ? (
                        <Badge tone="amber" icon={Lock}>
                          Bloqueada
                        </Badge>
                      ) : (
                        <Badge tone="info">{progress.done}/{progress.total} missões</Badge>
                      )}
                    </div>

                    <h3 className="mt-2 font-semibold text-lg flex items-center gap-2">
                      {phase.title}
                    </h3>
                    <p className="text-[13px] text-muted">{phase.subtitle}</p>
                    <p className="text-[13px] text-text/70 mt-2 max-w-2xl">{phase.summary}</p>

                    {phase.pdf && (
                      <a
                        href={phase.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-[12px] text-brand-bright transition-colors hover:border-brand/50 hover:bg-brand/10"
                      >
                        <FileText size={13} />
                        Material de apoio · PDF da aula
                        <ExternalLink size={11} className="text-faint" />
                      </a>
                    )}
                  </div>

                  {!comingSoon && (
                    <div className="w-full sm:w-40 shrink-0">
                      <ProgressBar
                        value={progress.done}
                        max={Math.max(progress.total, 1)}
                        color={phase.color}
                        showLabel
                      />
                    </div>
                  )}
                </div>

                {/* Missões da fase */}
                {!comingSoon && (
                  <ul className="mt-4 space-y-2">
                    {missions.map((mission) => {
                      const done =
                        state.missions[mission.id]?.status === 'concluida'
                      const missionUnlocked = isMissionUnlocked(state, mission)

                      return (
                        <li
                          key={mission.id}
                          className={`flex items-center gap-3 rounded-xl border border-line-soft bg-void/40 px-3 py-2.5 ${
                            missionUnlocked ? '' : 'opacity-60'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 size={16} className="text-brand shrink-0" />
                          ) : mission.boss ? (
                            <Swords size={16} className="text-amber shrink-0" />
                          ) : missionUnlocked ? (
                            <Play size={16} className="text-brand shrink-0" />
                          ) : (
                            <Lock size={16} className="text-faint shrink-0" />
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium truncate">
                              {mission.title}
                            </p>
                            <p className="text-[11px] text-faint">
                              {mission.difficulty} · +{mission.xp} XP
                              {mission.boss && ' · chefão de fase'}
                            </p>
                          </div>

                          {missionUnlocked ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/missao/${mission.id}`)
                              }}
                              className="text-[12px] text-brand-bright hover:underline shrink-0"
                            >
                              {done ? 'Revisar' : 'Abrir'}
                            </button>
                          ) : (
                            <Circle size={12} className="text-faint shrink-0" />
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}

                {comingSoon && (
                  <p className="mt-4 text-[13px] text-faint">
                    Missões desta fase serão cadastradas na próxima etapa do
                    projeto.
                  </p>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
