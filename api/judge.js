/**
 * Serverless Function da Vercel — rota POST /api/judge em produção.
 *
 * Sem ela, a Vercel serve apenas os arquivos estáticos do build e o
 * /api/judge não existe (é o que gerava "Resposta inválida do servidor").
 *
 * Configure no painel da Vercel (Settings → Environment Variables):
 *   GATEWAY_URL   ex.: https://api.pherseus.dev
 *   GATEWAY_KEY   sua chave
 *   GATEWAY_MODEL ex.: sonnet-5  (recomendado na Vercel: mais rápido
 *                                 e cabe no tempo máximo da função)
 *
 * O .env local NÃO vai para a Vercel.
 */

import { judgeRequest } from '../server/judge.js'

// Tempo máximo da função (plano Hobby da Vercel: até 60s).
export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Use POST.' })
    return
  }

  // Em produção o Vercel já parseia o JSON em req.body
  const payload = req.body ?? {}

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'vercel'

  const result = await judgeRequest({
    code: payload.code,
    mission: payload.mission,
    env: process.env,
    ip,
  })

  // 'unconfigured' volta como 200 para o cliente exibir a mensagem de ajuda
  res.status(result.status === 'error' ? 502 : 200).json(result)
}
