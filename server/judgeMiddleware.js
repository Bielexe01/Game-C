/**
 * Rota /api/judge no SERVIDOR DE DESENVOLVIMENTO (Vite).
 *
 * Em produção (Vercel) a mesma lógica vive em api/judge.js — os dois
 * importam o núcleo compartilhado de server/judge.js.
 */

import { judgeRequest } from './judge.js'

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

/** Plugin Vite: monta /api/judge no servidor de desenvolvimento. */
export function judgePlugin(env) {
  return {
    name: 'c-adventure-judge',
    configureServer(server) {
      const handler = createJudgeHandler(env)
      server.middlewares.use('/api/judge', (req, res) => {
        handler(req, res).catch((error) => {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ status: 'error', message: error.message }))
        })
      })
    },
  }
}
