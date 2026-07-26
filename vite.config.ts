import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React — must be in its own chunk, loaded first
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react'
          }
          // Three.js core — large, loaded lazily via React.lazy
          if (id.includes('node_modules/three/')) {
            return 'vendor-three'
          }
          // React Three Fiber + Drei + postprocessing — lazy with the cube
          if (
            id.includes('node_modules/@react-three/') ||
            id.includes('node_modules/postprocessing/') ||
            id.includes('node_modules/maath/')
          ) {
            return 'vendor-r3f'
          }
          // XY Flow (ReactFlow) — lazy, only needed for tech-stack section
          if (id.includes('node_modules/@xyflow/')) {
            return 'vendor-xyflow'
          }
          // Framer Motion
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-framer'
          }
        },
      },
    },
  },

  server: {
    port: 3000,
  },
})
