import { Lock, CheckCircle2 } from 'lucide-react'

import Card from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import Icon from '../components/ui/Icon.jsx'

import { ACHIEVEMENTS } from '../data/achievements.js'
import { useGameStore } from '../store/gameStore.js'

/** Conquistas — medalhas desbloqueadas conforme o desempenho. */
export default function Achievements() {
  const unlocked = useGameStore((s) => s.unlockedAchievements)

  return (
    <div className="anim-rise space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Conquistas</h1>
        <p className="text-sm text-muted mt-1">
          {unlocked.length} de {ACHIEVEMENTS.length} desbloqueadas · cada uma
          concede XP e moedas.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.includes(achievement.id)

          return (
            <Card
              key={achievement.id}
              className={isUnlocked ? 'border-brand/40' : 'opacity-75'}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                    isUnlocked
                      ? 'bg-brand/15 text-brand-bright'
                      : 'bg-surface-3 text-faint'
                  }`}
                >
                  {isUnlocked ? (
                    <Icon name={achievement.icon} size={20} />
                  ) : (
                    <Lock size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[15px]">{achievement.title}</h3>
                    {isUnlocked && <CheckCircle2 size={14} className="text-brand" />}
                  </div>
                  <p className="text-[13px] text-muted mt-0.5">
                    {achievement.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-1.5">
                    <Badge tone={isUnlocked ? 'brand' : 'muted'}>
                      +{achievement.xpReward} XP
                    </Badge>
                    <Badge tone="amber">+{achievement.coinsReward} moedas</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
