import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base:
    process.env.VERCEL === '1' || process.env.VERCEL_ENV
      ? '/'
      : mode === 'production'
        ? '/rongze-gao-portfolio/'
        : '/',
}))
