import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const rootDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const isVercel = env.VERCEL === '1' || Boolean(env.VERCEL_ENV)

  return {
    plugins: [react()],
    base: isVercel ? '/' : mode === 'production' ? '/rongze-gao-portfolio/' : '/',
    build: {
      rollupOptions: {
        input: {
          main: resolve(rootDir, 'index.html'),
          game: resolve(rootDir, 'game.html'),
        },
      },
    },
  }
})
