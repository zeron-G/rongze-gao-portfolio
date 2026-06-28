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
    // Hosted at the domain root on Cloudflare Pages → base must be '/'.
    // (Was '/rongze-gao-portfolio/' for GitHub Pages' /repo/ subpath, which 404s at root.)
    base: '/',
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
