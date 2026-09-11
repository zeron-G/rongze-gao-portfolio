import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const rootDir = dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  plugins: [react()],
  // Custom domain builds stay at '/'; Pages uses its configured base path.
  base: process.env.SITE_BASE || '/',
  build: { rollupOptions: { input: {
    main: resolve(rootDir, 'index.html'),
    game: resolve(rootDir, 'game.html'),
    resume: resolve(rootDir, 'resume.html'),
  } } },
})
