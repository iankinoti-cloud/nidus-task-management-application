import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],

  build: {
    // Split vendor libraries into separate cached chunks so returning users
    // don't re-download unchanged dependencies on every deploy.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/react-router')) return 'vendor-router'
          if (id.includes('node_modules/@tanstack')) return 'vendor-query'
          if (id.includes('node_modules/@supabase')) return 'vendor-supabase'
          if (id.includes('node_modules/@hello-pangea')) return 'vendor-dnd'
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
        },
      },
    },
    // Raise the chunk-size warning threshold (we split manually above)
    chunkSizeWarningLimit: 600,
    // Disable the module-preload polyfill – modern browsers support it natively,
    // and the inline polyfill script would be blocked by CSP script-src 'self'.
    modulePreload: {
      polyfill: false,
    },
    // Enable source maps for production error tracking
    sourcemap: false,
  },

  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        branches: 30,
        functions: 30,
        lines: 30,
        statements: 30,
      },
    },
  },
})
