/**
 * Conquistas — desbloqueadas automaticamente conforme o progresso.
 * `check(stats)` recebe um snapshot derivado do estado do jogo
 * (ver derivadores em store/gameStore.js) e retorna true/false.
 */
export const ACHIEVEMENTS = [
  {
    id: 'primeiro-passo',
    title: 'Primeiro Passo',
    description: 'Conclua sua primeira missão.',
    icon: 'footprints',
    xpReward: 20,
    coinsReward: 5,
    check: (s) => s.completedCount >= 1,
  },
  {
    id: 'condicionais-domesticados',
    title: 'Condicionais Domesticadas',
    description: 'Conclua todas as missões da fase de Condicionais.',
    icon: 'git-branch',
    xpReward: 50,
    coinsReward: 20,
    check: (s) => s.phaseCompleted['aula-2'] >= 3,
  },
  {
    id: 'primeiro-chefao',
    title: 'Derrubei o Chefão',
    description: 'Conclua um chefão de fase.',
    icon: 'swords',
    xpReward: 80,
    coinsReward: 30,
    check: (s) => s.bossCompleted >= 1,
  },
  {
    id: 'sem-dica',
    title: 'Mente Brilhante',
    description: 'Conclua uma missão sem usar nenhuma dica.',
    icon: 'lightbulb-off',
    xpReward: 40,
    coinsReward: 15,
    check: (s) => s.cleanCompletions >= 1,
  },
  {
    id: 'perseverante',
    title: 'Perseverante',
    description: 'Acumule 10 tentativas registradas (erros contam como prática).',
    icon: 'flame',
    xpReward: 30,
    coinsReward: 10,
    check: (s) => s.totalAttempts >= 10,
  },
  {
    id: 'nivel-3',
    title: 'Programador em Ascensão',
    description: 'Alcance o nível 3.',
    icon: 'trending-up',
    xpReward: 60,
    coinsReward: 25,
    check: (s) => s.level >= 3,
  },
]

export const getAchievementById = (id) => ACHIEVEMENTS.find((a) => a.id === id)
