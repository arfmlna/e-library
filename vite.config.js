import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { createRequire } from 'node:module'
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import basicSsl from '@vitejs/plugin-basic-ssl'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url)
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'))
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'))
const workerPath = normalizePath(path.join(pdfjsDistPath, 'legacy', 'build', 'pdf.worker.min.mjs'))

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  plugins: [
    react(),
    basicSsl(),
    viteStaticCopy({
      targets: [
        { src: cMapsDir, dest: '' },
        { src: workerPath, dest: '', rename: 'pdf.worker.min.mjs' }
      ]
    }),
    nodePolyfills({
      include: ['stream', 'zlib']
    }),
    tailwindcss(), 
    VitePWA({
      strategies: 'generateSW',
      srcDir: 'src',
      filename: 'sw.js',
      
      registerType: 'prompt',
      workbox: {
        clientsClaim: false,
        skipWaiting: false,
        navigateFallbackDenylist: [/^\/__vite_ping/, /^\/@vite\/client/, /^\/node_modules/],
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json,woff2}'],
        disableDevLogs: true, 
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3000000,
      },
      
      injectRegister: 'auto',

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        id: '/',
        name: 'Perpustakaan',
        short_name: 'Perpustakaan',
        description: 'applikasi perpustakaan digital',
        theme_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        scope: '/',
        background_color: '#ffffff',
        icons: [
          { src: '/sketch192.png', sizes: '192x192', type: 'image/png' },
          { src: '/sketch512.png', sizes: '512x512', type: 'image/png' }
        ],
        screenshots: [
          { src: '/sketchMobile.png', sizes: '540x720', type: 'image/png', form_factor: 'narrow' },
          { src: '/sketchDesktop.png', sizes: '1280x800', type: 'image/png', form_factor: 'wide' }
        ]
      },

      devOptions: {
        enabled: false,
        type: 'module',
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
      includeAssets: [
        "**/*"
      ]
    }),
  ],
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    include: ['react-pdf']
  },
  server: {
    host: true,
    proxy: {
      '/api-ipify': {
        target: 'https://api.ipify.org', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ipify/, ''),
      },
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  }
})