/**
 * Cliente do juiz de código — fala com /api/judge (middleware local do Vite),
 * que por sua vez chama o gateway de IA (Pherseus, modelos Anthropic).
 *
 * A chave fica NO SERVIDOR (.env). O navegador nunca a vê.
 *
 * IMPORTANTE: o julgamento é feito por IA — o modelo analisa e rastreia o
 * código do aluno contra cada critério. Ele não compila de verdade; por isso
 * os critérios pedem saída EXATA e o prompt exige rigor de texto e sintaxe.
 */

/** Estado da configuração é perguntado ao servidor, nunca inferido no cliente. */
export async function checkJudgeStatus() {
  try {
    const response = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: true }),
    })
    const data = await response.json()
    return { configured: data.status !== 'unconfigured', message: data.message }
  } catch {
    return { configured: false, message: 'Servidor de desenvolvimento indisponível.' }
  }
}

/**
 * Executa o julgamento do código contra os critérios da missão.
 *
 * @returns {Promise<{
 *   status: 'unconfigured' | 'ok' | 'error',
 *   passed: boolean,
 *   results: Array<{ id, label, passed, reason, expected? }>,
 *   summary?: string,
 *   message?: string
 * }>}
 */
export async function runMission({ code, mission }) {
  try {
    const response = await fetch('/api/judge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mission }),
    })

    const data = await response.json().catch(() => null)
    if (!data) {
      return {
        status: 'error',
        passed: false,
        results: [],
        message: 'Resposta inválida do servidor de julgamento.',
      }
    }
    return data
  } catch (error) {
    return {
      status: 'error',
      passed: false,
      results: [],
      message: `Não foi possível contactar o juiz local: ${error.message}`,
    }
  }
}
