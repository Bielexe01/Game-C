import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { PHASES } from '../data/phases.js'
import { MISSIONS, getMissionsByPhase, getMissionById } from '../data/missions.js'
import { ACHIEVEMENTS } from '../data/achievements.js'

/* ------------------------------------------------------------------ */
/* Curva de níveis                                                      */
/* ------------------------------------------------------------------ */
export const XP_PER_LEVEL = 200

const LEVEL_TITLES = [
  'Recruta',
  'Aprendiz',
  'Explorador',
  'Programador',
  'Desenvolvedor',
  'Hacker',
  'Mestre C',
]

export function computeLevel(xp) {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpIntoLevel = xp % XP_PER_LEVEL
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
  return {
    level,
    title,
    xpIntoLevel,
    xpForNext: XP_PER_LEVEL,
    percent: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
  }
}

/* ------------------------------------------------------------------ */
/* Store do jogo (Zustand + persistência em localStorage)               */
/* ------------------------------------------------------------------ */
const todayISO = () => new Date().toISOString().slice(0, 10)

const yesterdayISO = () => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 0,
      missions: {}, // { [missionId]: { status, attempts, hintsUsed, passed } }
      unlockedAchievements: [],
      streak: { days: 0, lastDate: null },

      /** Registra uma tentativa de execução (acerto ou erro). */
      recordAttempt(missionId, passed) {
        const current = get().missions[missionId] ?? {
          status: 'em-andamento',
          attempts: 0,
          hintsUsed: 0,
          passed: false,
        }
        const next = {
          ...current,
          attempts: current.attempts + 1,
          passed: current.passed || passed,
        }
        set((state) => ({
          missions: { ...state.missions, [missionId]: next },
        }))
        return next
      },

      /** Conclui a missão: concede XP/moedas uma única vez e atualiza a sequência. */
      completeMission(missionId) {
        const mission = getMissionById(missionId)
        if (!mission) return
        const current = get().missions[missionId]
        if (current?.status === 'concluida') return

        const streak = advanceStreak(get().streak)

        set((state) => ({
          xp: state.xp + mission.xp,
          coins: state.coins + mission.coins,
          streak,
          missions: {
            ...state.missions,
            [missionId]: {
              status: 'concluida',
              attempts: (current?.attempts ?? 0) + 1,
              hintsUsed: current?.hintsUsed ?? 0,
              passed: true,
            },
          },
        }))
        get().evaluateAchievements()
      },

      /** Usa uma dica da missão (custa uma pequena parte de XP). */
      useHint(missionId) {
        const current = get().missions[missionId] ?? {
          status: 'em-andamento',
          attempts: 0,
          hintsUsed: 0,
          passed: false,
        }
        set((state) => ({
          xp: Math.max(0, state.xp - 5),
          missions: {
            ...state.missions,
            [missionId]: { ...current, hintsUsed: current.hintsUsed + 1 },
          },
        }))
      },

      /** Avalia e desbloqueia as conquistas cujo predicado passou a valer. */
      evaluateAchievements() {
        const state = get()
        const stats = buildStats(state)
        const newlyUnlocked = ACHIEVEMENTS.filter(
          (a) => !state.unlockedAchievements.includes(a.id) && a.check(stats),
        )
        if (newlyUnlocked.length === 0) return

        set((s) => ({
          xp: s.xp + newlyUnlocked.reduce((t, a) => t + a.xpReward, 0),
          coins: s.coins + newlyUnlocked.reduce((t, a) => t + a.coinsReward, 0),
          unlockedAchievements: [
            ...s.unlockedAchievements,
            ...newlyUnlocked.map((a) => a.id),
          ],
        }))
      },

      /** Zera todo o progresso (usado na página de perfil). */
      resetAll() {
        set({
          xp: 0,
          coins: 0,
          missions: {},
          unlockedAchievements: [],
          streak: { days: 0, lastDate: null },
        })
      },
    }),
    {
      name: 'c-adventure-progress', // chave no localStorage
      version: 1,
    },
  ),
)

function advanceStreak(streak) {
  const today = todayISO()
  if (streak.lastDate === today) return streak
  if (streak.lastDate === yesterdayISO()) {
    return { days: streak.days + 1, lastDate: today }
  }
  return { days: 1, lastDate: today }
}

/* ------------------------------------------------------------------ */
/* Derivadores (seletores puros — a UI nunca lê o estado "cru")         */
/* ------------------------------------------------------------------ */

export function buildStats(state) {
  const entries = Object.values(state.missions)
  const completed = entries.filter((m) => m.status === 'concluida')
  const phaseCompleted = {}
  for (const phase of PHASES) {
    phaseCompleted[phase.id] = getMissionsByPhase(phase.id).filter(
      (m) => state.missions[m.id]?.status === 'concluida',
    ).length
  }
  return {
    completedCount: completed.length,
    totalMissions: MISSIONS.length,
    totalAttempts: entries.reduce((t, m) => t + (m.attempts ?? 0), 0),
    bossCompleted: MISSIONS.filter(
      (m) => m.boss && state.missions[m.id]?.status === 'concluida',
    ).length,
    cleanCompletions: completed.filter((m) => (m.hintsUsed ?? 0) === 0).length,
    phaseCompleted,
    level: computeLevel(state.xp).level,
  }
}

export function getPhaseProgress(state, phaseId) {
  const missions = getMissionsByPhase(phaseId)
  const done = missions.filter(
    (m) => state.missions[m.id]?.status === 'concluida',
  ).length
  return {
    done,
    total: missions.length,
    percent: missions.length ? Math.round((done / missions.length) * 100) : 0,
  }
}

/** Fase desbloqueada: a 1ª é sempre livre; as demais dependem da anterior. */
export function isPhaseUnlocked(state, phase) {
  if (phase.order === 1) return true
  if (phase.status === 'em-breve') return false
  const previous = PHASES.find((p) => p.order === phase.order - 1)
  if (!previous) return false
  return getPhaseProgress(state, previous.id).done >= phase.missionsToUnlock
}

export function isMissionUnlocked(state, mission) {
  const phase = PHASES.find((p) => p.id === mission.phaseId)
  if (!phase || !isPhaseUnlocked(state, phase)) return false
  if (mission.order === 1) return true
  const previous = getMissionsByPhase(mission.phaseId).find(
    (m) => m.order === mission.order - 1,
  )
  return previous ? state.missions[previous.id]?.status === 'concluida' : true
}

/** Próxima missão recomendada (usada pelo botão "Continuar aprendendo"). */
export function getNextMission(state) {
  const ordered = [...MISSIONS].sort((a, b) => {
    const pa = PHASES.find((p) => p.id === a.phaseId)?.order ?? 0
    const pb = PHASES.find((p) => p.id === b.phaseId)?.order ?? 0
    return pa === pb ? a.order - b.order : pa - pb
  })
  return (
    ordered.find(
      (m) =>
        state.missions[m.id]?.status !== 'concluida' && isMissionUnlocked(state, m),
    ) ??
    ordered.find((m) => state.missions[m.id]?.status !== 'concluida') ??
    null
  )
}
