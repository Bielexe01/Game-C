/**
 * Rotas /api/judge e /api/guide no SERVIDOR DE DESENVOLVIMENTO (Vite).
 *
 * Em produção (Vercel) as mesmas lógicas vivem em api/judge.js e api/guide.js —
 * todos importam os núcleos compartilhados de server/judge.js e server/guide.js.
 */

import { judgeRequest } from './judge.js'
import { guideRequest } from './guide.js'

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
      if (raw.length > 512 * 1024) reject(new Error('Código muito grande.'))
    })
    req.on('end', () => resolve(raw))
    req.on('error', reject)
  })
}

function clientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'local'
  )
}

export function createJudgeHandler(env) {
  return async function judgeHandler(req, res) {
    const send = (status, payload) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(payload))
    }

    if (req.method !== 'POST') {
      return send(405, { status: 'error', message: 'Use POST.' })
    }

    let payload
    try {
      payload = JSON.parse(await readBody(req))
    } catch {
      return send(400, { status: 'error', message: 'Corpo da requisição inválido.' })
    }

    const result = await judgeRequest({
      code: payload?.code,
      mission: payload?.mission,
      env,
      ip: clientIp(req),
    })

    // 'unconfigured' volta como 200 para o cliente exibir a mensagem de ajuda
    return send(result.status === 'error' ? 502 : 200, result)
  }
}

/** Handler da rota /api/guide (passo a passo com IA). */
export function createGuideHandler(env) {
  return async function guideHandler(req, res) {
    const send = (status, payload) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify(payload))
    }

    if (req.method !== 'POST') {
      return send(405, { status: 'error', message: 'Use POST.' })
    }

    let payload
    try {
      payload = JSON.parse(await readBody(req))
    } catch {
      return send(400, { status: 'error', message: 'Corpo da requisição inválido.' })
    }

    const result = await guideRequest({
      code: payload?.code,
      mission: payload?.mission,
      env,
      ip: clientIp(req),
    })

    return send(result.status === 'error' ? 502 : 200, result)
  }
}

/** Plugin Vite: monta /api/judge e /api/guide no servidor de desenvolvimento. */
export function judgePlugin(env) {
  return {
    name: 'c-adventure-judge',
    configureServer(server) {
      const mount = (path, handler) => {
        server.middlewares.use(path, (req, res) => {
          handler(req, res).catch((error) => {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ status: 'error', message: error.message }))
          })
        })
      }

      mount('/api/judge', createJudgeHandler(env))
      mount('/api/guide', createGuideHandler(env))
    },
  }
}
