/**
 * Núcleo do juiz de código por IA — módulo COMPARTILHADO.
 *
 * É importado por:
 *   · server/judgeMiddleware.js → rota /api/judge no dev server (Vite)
 *   · api/judge.js              → Serverless Function da Vercel (produção)
 *
 * Fonte das variáveis de ambiente:
 *   GATEWAY_URL   ex.: https://api.pherseus.dev
 *   GATEWAY_KEY   sua chave (Bearer)
 *   GATEWAY_MODEL ex.: opus-5-5   (padrão)
 *   GATEWAY_THINKING  "enabled" para religar o thinking do modelo
 */

const DEFAULT_MODEL = 'opus-5-5'
const REQUEST_TIMEOUT_MS = 90_000

const SYSTEM_PROMPT = `Você é um professor de Programação Estruturada em C avaliando missões de um jogo educacional.
Sua tarefa: julgar o CÓDIGO DO ALUNO contra cada critério da missão.

Como julgar (seja rigoroso, mas justo):
1. Primeiro verifique se o código compila (sintaxe C, #include, main, ponto e vírgula, parênteses e chaves balanceados). Se NÃO compilar, todos os critérios reprovam e o "reason" do primeiro critério deve apontar o erro de compilação.
2. Para cada critério, faça um rastreamento mental do programa COM A "entrada" (stdin) daquele critério, seguindo a execução passo a passo, e compare a saída produzida com a saída esperada.
3. Compare a saída de forma EXATA: texto (sem acento se o esperado não tem), maiúsculas/minúsculas, espaços e quebras de linha. Se o esperado é "Recuperacao", imprimir "Recuperação" ou "Recuperacao\\n extra" REPROVA.
4. IMPORTANTE — prompts de solicitação NÃO contam como resposta: textos impressos apenas para pedir dados ao usuário (ex.: printf("Nota: "); antes de um scanf, printf("Opcao: "); etc.) devem ser IGNORADOS na comparação. Compare somente a(s) linha(s) com o resultado que a missão pediu. Se, além do prompt, o programa imprimir exatamente o esperado, o critério APROVA.
5. Considere entradas inválidas de sintaxe apenas como erro de compilação.
6. Você NÃO executa o código: você o analisa. Seja cuidadoso com laços, condições e ordem das instruções.

Responda SOMENTE com JSON válido, sem markdown, sem comentários fora do JSON:
{
  "results": [
    { "id": "<id do critério>", "passed": true, "reason": "" },
    { "id": "<id do critério>", "passed": false, "reason": "<em pt-BR, no máximo 2 frases: por que reprovou e o que corrigir>" }
  ],
  "summary": "<feedback educativo em pt-BR, no máximo 3 frases: o que o aluno entendeu bem e o que revisar>"
}

Regras do JSON:
- "results" deve ter EXATAMENTE um item para cada critério informado, com o mesmo "id".
- Critérios marcados como "exigência estrutural" não têm entrada nem saída: avalie apenas se o código atende ao que está descrito e responda true/false no "passed".
- Para critérios aprovados, "reason" deve ser "".
- Escreva todo o conteúdo em português do Brasil.`

function buildUserPrompt(mission, code) {
  const criteria = mission.criteria
    .map((c) => {
      // Critério de ESTRUTURA: não tem saída esperada, só uma exigência
      // sobre o código (ex.: "existe uma função dobro chamada no main").
      if (c.type === 'code') {
        return `- id: ${c.id}\n  exigência estrutural (verifique no código): ${c.label}`
      }
      return `- id: ${c.id}\n  o que deve acontecer: ${c.label}\n  entrada (stdin): ${
        c.stdin ? JSON.stringify(c.stdin) : '(vazia)'
      }\n  saída esperada (exata): ${JSON.stringify(c.expected)}${
        c.trimEnd ? ' (espaços finais de cada linha são ignorados)' : ''
      }`
    })
    .join('\n\n')

  return `# Missão: ${mission.title}
Objetivo: ${mission.objective}
Conceitos: ${mission.concepts.join(', ')}

## Instruções dadas ao aluno
${mission.instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Critérios de aprovação
${criteria}

## Código do aluno
\`\`\`c
${code}
\`\`\`

Julge o código contra CADA critério acima e responda apenas com o JSON.`
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('A resposta do modelo não continha JSON.')
  }
  return JSON.parse(cleaned.slice(start, end + 1))
}

async function callGateway({ url, key, model, thinking, userContent }) {
  const endpoint = `${url.replace(/\/$/, '')}/v1/messages`

  const body = {
    model,
    // Menos tokens de resposta = julgamento mais rápido.
    max_tokens: 1000,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }],
  }

  // Desativar o "thinking" do modelo corta bastante a latência
  // (medido: 13s → 8s). Use GATEWAY_THINKING=enabled para reativar.
  if (thinking !== 'enabled') {
    body.thinking = { type: 'disabled' }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'x-api-key': key, // gateways no formato Anthropic também aceitam este cabeçalho
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Gateway respondeu ${response.status}. ${detail.slice(0, 300)}`)
  }

  const data = await response.json()
  const text = Array.isArray(data.content)
    ? data.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')
    : (data.choices?.[0]?.message?.content ?? '')

  if (!text) throw new Error('Resposta vazia do gateway.')
  return text
}

/* Rate limit best-effort (o ambiente serverless é efêmero, mas reduz abuso). */
const hits = new Map()
export function checkRateLimit(ip, limit = 12, windowMs = 60_000) {
  const now = Date.now()
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs)
  list.push(now)
  hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return list.length <= limit
}

/**
 * Executa o julgamento. Nunca lança: sempre devolve o payload da resposta.
 *
 * @returns {Promise<{status: 'unconfigured'|'ok'|'error', ...}>}
 */
export async function judgeRequest({ code, mission, env = process.env, ip = 'local' }) {
  const url = env.GATEWAY_URL?.trim()
  const key = env.GATEWAY_KEY?.trim()
  const model = env.GATEWAY_MODEL?.trim() || DEFAULT_MODEL
  const thinking = env.GATEWAY_THINKING?.trim()

  if (!url || !key) {
    return {
      status: 'unconfigured',
      passed: false,
      results: [],
      message:
        'A execução por IA ainda não está configurada. Defina GATEWAY_URL e GATEWAY_KEY nas variáveis de ambiente.',
    }
  }

  if (!checkRateLimit(ip)) {
    return {
      status: 'error',
      passed: false,
      results: [],
      message: 'Muitas execuções em sequência. Aguarde um minuto e tente de novo.',
    }
  }

  if (!code?.trim() || !mission?.criteria?.length) {
    return {
      status: 'error',
      passed: false,
      results: [],
      message: 'Informe "code" e "mission" com ao menos um critério.',
    }
  }

  try {
    const rawText = await callGateway({
      url,
      key,
      model,
      thinking,
      userContent: buildUserPrompt(mission, code),
    })

    const parsed = extractJson(rawText)

    // Garante um resultado por critério, na ordem do modelo de missão
    const results = mission.criteria.map((criterion) => {
      const judged = (parsed.results ?? []).find((r) => r.id === criterion.id)
      return {
        id: criterion.id,
        label: criterion.label,
        expected: criterion.expected,
        passed: Boolean(judged?.passed),
        reason: judged?.reason ?? '',
      }
    })

    return {
      status: 'ok',
      passed: results.every((r) => r.passed),
      results,
      summary: parsed.summary ?? '',
      model,
    }
  } catch (error) {
    return {
      status: 'error',
      passed: false,
      results: [],
      message: `Falha ao julgar com a IA: ${error.message}`,
    }
  }
}
