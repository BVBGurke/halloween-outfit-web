import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['jannistower.tailfcf2d7.ts.net', 'jannistower'],
    proxy: {
      '/api': 'http://localhost:5176',
    },
  },
})
