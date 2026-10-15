# C Adventure · Mini game educacional de C

Jogo de progressão por fases para aprender **Programação Estruturada em C**
(Aulas 2 a 7) resolvendo missões práticas com execução real de código.

> **Etapa atual:** estrutura inicial validável — navegação, dashboard, mapa de
> fases, tela de missão demonstrativa, componentes reutilizáveis e progresso
> básico. As missões cadastradas são **demonstrativas** (fases 1 a 3); as fases
> 4 a 6 já aparecem no mapa como “em breve”.

---

## 1. Como rodar

```bash
npm install
npm run dev        # http://localhost:5173
```

### Execução de código (juiz por IA · gateway Pherseus)

O projeto **não simula** o resultado: o código do aluno é enviado ao seu
gateway de IA (`https://api.pherseus.dev`, endpoint `/v1/messages` no padrão
Anthropic, modelo `opus-5-5`), que rastreia o programa contra cada critério e
devolve aprovação/reprovação com feedback educativo.

A chave fica **só no servidor**: o `.env` é lido por
`server/judgeMiddleware.js` (middleware do Vite em `/api/judge`). O navegador
nunca recebe a chave.

```bash
cp .env.example .env   # preencha GATEWAY_KEY com sua chave do gateway
npm run dev            # reinicie para o .env ser recarregado
```

---

## 2. Arquitetura de componentes

```
Páginas (rotas)                    Componentes de domínio
┌──────────────────┐               ┌──────────────────────────────┐
│ Dashboard        │               │ mission/CodeEditor.jsx       │
│ PhaseMap         │◄──────────────│ mission/HintsPanel.jsx       │
│ Mission          │               │ mission/CriteriaList.jsx     │
│ Achievements     │               │ mission/ResultPanel.jsx      │
│ Profile          │               └──────────────────────────────┘
│ NotFound         │
└────────┬─────────┘               UI genérica (reutilizável)
         │                         ┌──────────────────────────────┐
         │                         │ ui/Button · Card · Badge     │
         │                         │ ui/ProgressBar · StatCard    │
         │                         │ ui/Icon (mapa string → Lucide)│
         │                         └──────────────────────────────┘
         │
┌────────┴─────────┐               Casca / navegação
│ store/gameStore  │◄──────────────│ layout/AppLayout.jsx         │
│ (Zustand+persist)│               │ layout/Sidebar · TopBar      │
└────────┬─────────┘               │ layout/BottomNav (mobile)    │
         │                         └──────────────────────────────┘
┌────────┴─────────────────────┐
│ data/  phases · missions     │  ← conteúdo do curso (JSON-like)
│        achievements          │     separado 100% da UI
│ services/codeExecution.js    │  ← adaptador Judge0
└──────────────────────────────┘
```

**Regra central:** `data/` não importa nada de `components/`; a UI nunca
hardcoda conteúdo de curso. Trocar missões = editar só `data/missions.js`.

---

## 3. Organização das pastas

```
src/
├── main.jsx                    # bootstrap + BrowserRouter
├── App.jsx                     # mapa de rotas
├── index.css                   # tema escuro + verde (Tailwind v4 @theme)
├── data/
│   ├── phases.js               # 6 fases = Aulas 2..7, ordem e desbloqueio
│   ├── missions.js             # modelo completo de missão + missões demo
│   └── achievements.js         # conquistas com predicados check(stats)
├── store/
│   └── gameStore.js            # XP, níveis, moedas, sequência, missões
│                               # + derivadores puros (progresso, desbloqueio)
├── services/
│   └── codeExecution.js        # cliente do juiz (/api/judge)
├── server/
│   └── judgeMiddleware.js      # middleware Vite: chama o gateway de IA
├── components/
│   ├── layout/                 # AppLayout, Sidebar, TopBar, BottomNav
│   ├── ui/                     # Button, Card, Badge, ProgressBar,
│   │                           # StatCard, Icon
│   └── mission/                # CodeEditor, HintsPanel, CriteriaList,
│                               # ResultPanel
└── pages/                      # Dashboard, PhaseMap, Mission,
                                # Achievements, Profile, NotFound
```

---

## 4. Fluxo de navegação

```
        ┌──────────────┐
   ┌───►│  / Dashboard │  nível, XP, progresso, sequência,
   │    │  (index)     │  botão "Continuar aprendendo"
   │    └──────┬───────┘
   │           │ /mapa                    /conquistas
   │    ┌──────▼───────┐   ┌───────────────────────┐
   │    │  /mapa       │──►│  /conquistas          │
   │    │  trilha de   │   │  medalhas desbloqueadas│
   │    │  6 fases     │   └───────────────────────┘
   │    └──────┬───────┘            ▲
   │           │ clique na missão    │
   │    ┌──────▼───────────┐        │
   │    │  /missao/:id     │────────┘
   │    │  enunciado,      │
   │    │  editor C,       │   /perfil
   │    │  executar,       │──────────────┐
   │    │  dicas, resultado│              │
   │    └──────┬───────────┘   histórico, │
   │           │ "Próxima missão"         │ revisão, zerar
   └───────────┘                     ┌────▼──────┐
        missão desbloqueada          │  /perfil  │
                                     └───────────┘
```

**Guardas de progressão**

| Regra | Onde |
| --- | --- |
| Fase 1 sempre livre; fase N exige `missionsToUnlock` missões da fase N−1 | `isPhaseUnlocked()` |
| Missão 1 da fase livre; as demais exigem a anterior concluída | `isMissionUnlocked()` |
| Missão bloqueada → redireciona para `/mapa` | `Mission.jsx` |
| Missões “em-breve” não abrem | `isPhaseUnlocked()` |

---

## 5. Progressão (estado)

- **Zustand + `persist`** (localStorage, chave `c-adventure-progress`).
- **XP**: missão concluída concede `mission.xp`; dica usada custa 5 XP;
  conquistas dão bônus.
- **Nível**: a cada 200 XP (`computeLevel`), com títulos (Recruta → Mestre C).
- **Moedas**: `mission.coins` + bônus de conquistas.
- **Sequência de estudos**: dias consecutivos com ao menos uma conclusão.
- **Derivadores puros** em `gameStore.js`: `buildStats`, `getPhaseProgress`,
  `isPhaseUnlocked`, `isMissionUnlocked`, `getNextMission`.

---

## 6. Modelo de missão (contrato de dados)

```js
{
  id, phaseId, order, title,
  difficulty: 'iniciante' | 'intermediario' | 'desafio',
  boss: false,            // chefão de fase combina conceitos
  isDemo: true,           // demonstrativa (validação de estrutura)
  xp: 40, coins: 10,
  objective, instructions[], concepts[],
  starterCode,
  criteria: [             // aprovados por execução REAL (Judge0)
    { id, type: 'output', label, stdin, expected, trimEnd }
  ],
  hints: [ /* 3 níveis, progressivos */ ],
  explanation              // feedback educativo ao concluir
}
```

---

## 7. Próximas etapas (ainda não implementadas)

1. Cadastrar o curso completo (~60 missões) das Aulas 2 a 7 neste mesmo modelo.
2. Fases 4 a 6 (Funções, Vetores & Strings, Matrizes & Arranjos) — já
   estruturadas em `phases.js`, com status `em-breve`.
3. Editor profissional (CodeMirror/Monaco) trocando só `CodeEditor.jsx`.
4. Critérios do tipo “código contém X” (análise estática) além dos testes de saída.
5. Revisão espaçada automática (fila de revisão por dificuldade).
6. Telas de celebração de chefão e trilha de conquistas animada.
7. (Opcional) julgamento exato de saída com Judge0 gratuito somado ao
   feedback da IA — hoje o juiz é 100 % IA (Pherseus).
