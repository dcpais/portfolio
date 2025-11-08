import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  server: {
    open: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})

