import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Target,
  ListChecks,
  Sparkles,
  BookOpen,
  Swords,
  FileText,
  ExternalLink,
} from 'lucide-react'

import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import CodeEditor from '../components/mission/CodeEditor.jsx'
import HintsPanel from '../components/mission/HintsPanel.jsx'
import CriteriaList from '../components/mission/CriteriaList.jsx'
import ResultPanel from '../components/mission/ResultPanel.jsx'
import StepByStep from '../components/mission/StepByStep.jsx'

import { getMissionById, getMissionsByPhase } from '../data/missions.js'
import { getPhaseById } from '../data/phases.js'
import { isMissionUnlocked, useGameStore } from '../store/gameStore.js'
import { runMission } from '../services/codeExecution.js'

/**
 * Tela de missão — enunciado, conceitos, editor de C, execução real
 * (Judge0) e feedback educativo.
 */
export default function Mission() {
  const { missionId } = useParams()
  const navigate = useNavigate()

  const mission = getMissionById(missionId)
  const phase = mission ? getPhaseById(mission.phaseId) : null

  const state = useGameStore()
  const recordAttempt = useGameStore((s) => s.recordAttempt)
  const completeMission = useGameStore((s) => s.completeMission)
  const useHint = useGameStore((s) => s.useHint)

  const missionState = mission ? state.missions[mission.id] : null
  const hintsUsed = missionState?.hintsUsed ?? 0

  const draftKey = mission ? `c-adventure-draft-${mission.id}` : null
  const [code, setCode] = useState(mission?.starterCode ?? '')
  const [result, setResult] = useState(null) // { kind, results, message }
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // Cronômetro visível enquanto a IA analisa (a espera parece menor quando é explícita)
  useEffect(() => {
    if (!running) return
    setElapsed(0)
    const started = Date.now()
    const timer = setInterval(() => {
      setElapsed(Math.round((Date.now() - started) / 1000))
    }, 500)
    return () => clearInterval(timer)
  }, [running])

  // Restaura rascunho salvo e descarta rascunho de outra missão
  useEffect(() => {
    if (!draftKey) return
    const saved = localStorage.getItem(draftKey)
    setCode(saved ?? mission.starterCode)
    setResult(null)
  }, [draftKey, mission])

  // Persiste o rascunho enquanto o aluno digita
  useEffect(() => {
    if (!draftKey || !code) return
    localStorage.setItem(draftKey, code)
  }, [draftKey, code])

  const nextMission = useMemo(() => {
    if (!mission) return null
    const siblings = getMissionsByPhase(mission.phaseId)
    return siblings.find((m) => m.order === mission.order + 1) ?? null
  }, [mission])

  if (!mission || !phase) return <Navigate to="/mapa" replace />
  if (!isMissionUnlocked(state, mission)) return <Navigate to="/mapa" replace />

  const alreadyCompleted = missionState?.status === 'concluida'

  async function handleRun() {
    setRunning(true)
    setResult({ kind: 'running' })

    const outcome = await runMission({ code, mission })

    setRunning(false)

    if (outcome.status === 'unconfigured') {
      setResult({ kind: 'unconfigured', message: outcome.message })
      return
    }
    if (outcome.status === 'error') {
      setResult({ kind: 'error', message: outcome.message })
      return
    }

    recordAttempt(mission.id, outcome.passed)

    if (outcome.passed) {
      completeMission(mission.id)
      setResult({
        kind: 'passed',
        results: outcome.results,
        summary: outcome.summary,
        model: outcome.model,
        explanation: mission.explanation,
        mission,
      })
    } else {
      setResult({
        kind: 'failed',
        results: outcome.results,
        summary: outcome.summary,
        model: outcome.model,
      })
    }
  }

  function handleResetCode() {
    localStorage.removeItem(draftKey)
    setCode(mission.starterCode)
    setResult(null)
  }

  return (
    <div className="anim-rise space-y-5">
      {/* Cabeçalho da missão */}
      <div>
        <Link
          to="/mapa"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-brand-bright transition-colors mb-3"
        >
          <ArrowLeft size={14} /> Voltar ao mapa
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{phase.title}</Badge>
          <Badge>{mission.difficulty}</Badge>
          {mission.boss && (
            <Badge tone="amber" icon={Swords}>
              CHEFÃO DE FASE
            </Badge>
          )}
          {alreadyCompleted && <Badge tone="info">Concluída</Badge>}
        </div>

        <h1 className="mt-2 text-2xl font-bold flex items-center gap-2">
          {mission.title}
          <span className="text-sm font-normal text-faint">
            · +{mission.xp} XP · +{mission.coins} moedas
          </span>
        </h1>

        {phase.pdf && (
          <a
            href={phase.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-brand-bright hover:underline"
          >
            <FileText size={14} />
            Material de apoio: PDF da aula · {phase.title}
            <ExternalLink size={11} className="text-faint" />
          </a>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Coluna esquerda: enunciado, conceitos, critérios e dicas */}
        <div className="space-y-4">
          <Card>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
              <Target size={15} className="text-brand" /> Objetivo
            </h4>
            <p className="text-[13px] text-text/85">{mission.objective}</p>

            <h4 className="text-sm font-semibold flex items-center gap-2 mt-4 mb-2">
              <ListChecks size={15} className="text-brand" /> Instruções
            </h4>
            <ol className="space-y-1.5 text-[13px] text-text/80 list-decimal list-inside">
              {mission.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </Card>

          <Card>
            <h4 className="text-sm font-semibold flex items-center gap-2 mb-2.5">
              <BookOpen size={15} className="text-brand" /> Conceitos estudados
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {mission.concepts.map((concept) => (
                <Badge key={concept} tone="muted">
                  {concept}
                </Badge>
              ))}
            </div>
          </Card>

          <CriteriaList
            criteria={mission.criteria}
            results={result?.results ?? null}
            running={running}
          />

          <HintsPanel
            hints={mission.hints}
            usedCount={hintsUsed}
            onUseHint={() => useHint(mission.id)}
          />

          <StepByStep mission={mission} code={code} />
        </div>

        {/* Coluna direita: editor, botões e resultado */}
        <div className="space-y-4">
          <CodeEditor value={code} onChange={setCode} />

          <div className="flex flex-wrap items-center gap-2">
            <Button size="lg" onClick={handleRun} loading={running} disabled={running}>
              <Play size={16} /> Executar código
            </Button>
            <Button variant="ghost" onClick={handleResetCode} disabled={running}>
              <RotateCcw size={15} /> Código inicial
            </Button>

            {nextMission && result?.kind === 'passed' && (
              <Button
                variant="secondary"
                className="ml-auto"
                onClick={() => navigate(`/missao/${nextMission.id}`)}
              >
                Próxima missão
              </Button>
            )}
          </div>

          <ResultPanel
            state={result}
            elapsed={elapsed}
            hasNext={Boolean(nextMission)}
            onNext={() => navigate(`/missao/${nextMission.id}`)}
          />

          {!mission.criteria?.some((c) => c.expected) && (
            <p className="text-[12px] text-faint flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber" />
              Missão sem testes de saída: a validação será feita por critérios de
              código na próxima etapa.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
