/**
 * Serverless Function da Vercel — rota POST /api/guide (passo a passo).
 *
 * Configure no painel da Vercel (Settings → Environment Variables):
 *   GATEWAY_URL, GATEWAY_KEY, GATEWAY_MODEL (as mesmas do juiz).
 */

import { guideRequest } from '../server/guide.js'

// Tempo máximo da função (plano Hobby da Vercel: até 60s).
export const config = { maxDuration: 60 }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', message: 'Use POST.' })
    return
  }

  const payload = req.body ?? {}

  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'vercel'

  const result = await guideRequest({
    code: payload.code,
    mission: payload.mission,
    env: process.env,
    ip,
  })

  res.status(result.status === 'error' ? 502 : 200).json(result)
}
