/**
 * Passo a passo com IA — núcleo compartilhado.
 *
 * Importado por:
 *   · server/judgeMiddleware.js → rota /api/guide no dev server (Vite)
 *   · api/guide.js              → Serverless Function da Vercel (produção)
 *
 * Diferente do juiz, aqui o objetivo é ENSINAR: a IA devolve um roteiro
 * numerado (plano → trecho-chave → teste) sem entregar o programa pronto.
 */

import { checkRateLimit, extractJson } from './judge.js'

const DEFAULT_MODEL = 'opus-5-5'
const REQUEST_TIMEOUT_MS = 90_000

const SYSTEM_PROMPT = `Você é um professor de Programação Estruturada em C, atencioso e didático.
Seu aluno travou em uma missão de um jogo educacional e pediu um PASSO A PASSO.

Regras importantes:
1. NÃO escreva o programa completo. O objetivo é conduzir o aluno a montar o código sozinho.
2. Gere de 5 a 7 passos, em ordem, do plano lógico até o teste.
3. Cada passo tem um título curto e uma explicação prática em pt-BR (2 a 4 frases), em linguagem simples.
4. Quando o passo precisar de um trecho-chave, inclua em "code" no máximo 4 linhas de C mostrando SÓ aquele trecho. Nunca o programa inteiro.
5. Use os conceitos pedidos na missão e cite os nomes das variáveis do enunciado.
6. Se o aluno já começou o código (informado entre as marcações), reconheça o que ele já fez e direcione o próximo passo a partir dali.
7. No último passo, lembre de testar com os casos de entrada dos critérios e de conferir os textos/formatos exigidos (maiúsculas, sem acento, quebras de linha).

Responda SOMENTE com JSON válido, sem markdown:
{
  "steps": [
    { "title": "<curto>", "detail": "<explicação em pt-BR>", "code": "<trecho opcional, máx. 4 linhas>" }
  ],
  "encouraging": "<uma frase curta de incentivo final, em pt-BR>"
}

"code" pode ser "" quando o passo for puramente conceitual. Escreva tudo em português do Brasil.`

function buildUserPrompt(mission, code) {
  const temCodigo = Boolean(code) && code !== mission.starterCode

  const formatos = mission.criteria
    .filter((c) => c.type !== 'code')
    .map((c) => `- ${c.label}: saída esperada ${JSON.stringify(c.expected)}`)
    .join('\n')

  return `# Missão: ${mission.title}
Objetivo: ${mission.objective}
Conceitos: ${mission.concepts.join(', ')}

## O que a missão pede
${mission.instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## O que o aluno deve imprimir (formatos exigidos)
${formatos}

## Código atual do aluno
\`\`\`c
${code || mission.starterCode}
\`\`\`
${temCodigo ? '' : '(o aluno ainda não alterou o código inicial)'}

Monte o passo a passo para essa missão.`
}

async function callGateway({ url, key, model, thinking, userContent }) {
  const endpoint = `${url.replace(/\/$/, '')}/v1/messages`

  const body = {
    model,
    max_tokens: 1500,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }],
  }

  if (thinking !== 'enabled') {
    body.thinking = { type: 'disabled' }
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'x-api-key': key,
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

/**
 * Gera o passo a passo. Nunca lança: sempre devolve o payload da resposta.
 *
 * @returns {Promise<{status: 'unconfigured'|'ok'|'error', steps?, encouraging?, model?, message?}>}
 */
export async function guideRequest({ code, mission, env = process.env, ip = 'local' }) {
  const url = env.GATEWAY_URL?.trim()
  const key = env.GATEWAY_KEY?.trim()
  const model = env.GATEWAY_MODEL?.trim() || DEFAULT_MODEL
  const thinking = env.GATEWAY_THINKING?.trim()

  if (!url || !key) {
    return {
      status: 'unconfigured',
      message:
        'O passo a passo por IA ainda não está configurado. Defina GATEWAY_URL e GATEWAY_KEY nas variáveis de ambiente.',
    }
  }

  if (!checkRateLimit(`guide:${ip}`, 10, 60_000)) {
    return {
      status: 'error',
      message: 'Muitos pedidos de passo a passo em sequência. Aguarde um minuto.',
    }
  }

  if (!mission?.instructions?.length) {
    return { status: 'error', message: 'Informe "mission" com instruções válidas.' }
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

    const steps = (Array.isArray(parsed.steps) ? parsed.steps : [])
      .filter((s) => s && (s.title || s.detail))
      .map((s, i) => ({
        index: i + 1,
        title: String(s.title ?? `Passo ${i + 1}`),
        detail: String(s.detail ?? ''),
        code: typeof s.code === 'string' ? s.code.trim() : '',
      }))

    if (steps.length === 0) {
      return { status: 'error', message: 'O modelo não devolveu passos válidos. Tente de novo.' }
    }

    return {
      status: 'ok',
      steps,
      encouraging: parsed.encouraging ?? '',
      model,
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Falha ao gerar o passo a passo: ${error.message}`,
    }
  }
}
