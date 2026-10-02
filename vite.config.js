import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  test: {
    include: ['tests/**/*.test.js'],
  },
})
