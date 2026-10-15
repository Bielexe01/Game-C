import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { judgePlugin } from './server/judgeMiddleware.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega o .env COMPLETO (inclusive chaves sem prefixo VITE_)
  // para o middleware do juiz usar no servidor.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), judgePlugin(env)],
    server: {
      port: 5173,
      open: false,
    },
  }
})
