import { Link, useNavigate } from 'react-router-dom'
import { Zap, Target, Flame, Trophy, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react'

import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import Icon from '../components/ui/Icon.jsx'

import { PHASES, getPhaseById } from '../data/phases.js'
import {
  buildStats,
  computeLevel,
  getNextMission,
  getPhaseProgress,
  isMissionUnlocked,
  useGameStore,
} from '../store/gameStore.js'

/** Dashboard — nível, XP, progresso do curso, sequência e "continuar". */
export default function Dashboard() {
  const state = useGameStore()
  const navigate = useNavigate()

  const { level, title, percent, xpIntoLevel, xpForNext } = computeLevel(state.xp)
  const stats = buildStats(state)
  const nextMission = getNextMission(state)

  const coursePercent = stats.totalMissions
    ? Math.round((stats.completedCount / stats.totalMissions) * 100)
    : 0

  const currentPhase = nextMission ? getPhaseById(nextMission.phaseId) : PHASES[0]

  return (
    <div className="anim-rise space-y-6">
      {/* Cabeçalho + CTA principal */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-brand mb-1">
            Bem-vindo de volta
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">
            Nível {level} · {title}
          </h1>
          <p className="text-sm text-muted mt-1 max-w-xl">
            Continue a trilha de Programação Estruturada em C — do primeiro{' '}
            <code className="text-brand-bright">if</code> até matrizes e vetores
            paralelos.
          </p>
        </div>

        {nextMission && (
          <Button size="lg" onClick={() => navigate(`/missao/${nextMission.id}`)}>
            <Zap size={18} />
            Continuar aprendendo
          </Button>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Zap} label="XP total" value={state.xp} hint={`${xpIntoLevel}/${xpForNext} para o próximo nível`} />
        <StatCard icon={Target} label="Missões concluídas" value={`${stats.completedCount}/${stats.totalMissions}`} accent="var(--color-info)" />
        <StatCard icon={Flame} label="Sequência de estudos" value={`${state.streak.days} dia(s)`} accent="var(--color-amber)" />
        <StatCard icon={Trophy} label="Conquistas" value={state.unlockedAchievements.length} accent="var(--color-amber)" />
      </div>

      {/* Progresso do curso + missão atual */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen size={16} className="text-brand" /> Progresso do curso
            </h3>
            <span className="text-sm text-muted tabular-nums">{coursePercent}%</span>
          </div>
          <ProgressBar value={stats.completedCount} max={stats.totalMissions} />

          <div className="mt-5 space-y-3">
            {PHASES.map((phase) => {
              const progress = getPhaseProgress(state, phase.id)
              return (
                <div key={phase.id}>
                  <div className="flex items-center justify-between text-[13px] mb-1">
                    <span className="flex items-center gap-2 text-text/90">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: phase.color }}
                      />
                      {phase.order}. {phase.title}
                      {phase.status === 'em-breve' && (
                        <span className="text-[11px] text-faint">· em breve</span>
                      )}
                    </span>
                    <span className="text-faint tabular-nums">
                      {progress.done}/{progress.total}
                    </span>
                  </div>
                  <ProgressBar
                    value={progress.done}
                    max={Math.max(progress.total, 1)}
                    color={phase.color}
                  />
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="lg:col-span-2 flex flex-col">
          <h3 className="font-semibold mb-3">Próximo objetivo</h3>

          {nextMission ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={currentPhase.icon} size={15} style={{ color: currentPhase.color }} />
                <span className="text-xs text-muted">{currentPhase.title}</span>
                {nextMission.boss && (
                  <span className="text-[11px] rounded-full border border-amber/40 bg-amber/15 px-2 py-0.5 text-amber">
                    CHEFÃO
                  </span>
                )}
              </div>

              <p className="font-semibold text-text">{nextMission.title}</p>
              <p className="text-[13px] text-muted mt-1 flex-1">
                {nextMission.objective}
              </p>

              <div className="flex items-center gap-2 mt-3 mb-4 text-[12px] text-faint">
                <Zap size={12} className="text-brand" /> +{nextMission.xp} XP
                <span>·</span>
                +{nextMission.coins} moedas
              </div>

              <Button
                onClick={() => navigate(`/missao/${nextMission.id}`)}
                disabled={!isMissionUnlocked(state, nextMission)}
                className="w-full"
              >
                Ir para a missão <ArrowRight size={15} />
              </Button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-6">
              <CheckCircle2 size={34} className="text-brand" />
              <p className="text-sm text-muted">
                Todas as missões cadastradas foram concluídas. Novas fases entram
                em breve.
              </p>
              <Button variant="secondary" onClick={() => navigate('/conquistas')}>
                Ver conquistas
              </Button>
            </div>
          )}

          <Link
            to="/mapa"
            className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-brand-bright transition-colors"
          >
            Abrir mapa de fases <ArrowRight size={13} />
          </Link>
        </Card>
      </div>
    </div>
  )
}
