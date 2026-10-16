/**
 * Cliente do passo a passo — fala com /api/guide
 * (middleware local no dev, Serverless Function na Vercel).
 *
 * A chave do gateway fica no servidor; o navegador só envia
 * a missão e o código atual do aluno.
 */

/**
 * @returns {Promise<{
 *   status: 'unconfigured' | 'ok' | 'error',
 *   steps?: Array<{ index, title, detail, code }>,
 *   encouraging?: string,
 *   model?: string,
 *   message?: string
 * }>}
 */
export async function generateGuide({ code, mission }) {
  try {
    const response = await fetch('/api/guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mission }),
    })

    const data = await response.json().catch(() => null)
    if (!data) {
      return {
        status: 'error',
        message: 'Resposta inválida do servidor de passo a passo.',
      }
    }
    return data
  } catch (error) {
    return {
      status: 'error',
      message: `Não foi possível gerar o passo a passo: ${error.message}`,
    }
  }
}
