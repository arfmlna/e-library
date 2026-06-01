import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { createRequire } from 'node:module'
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url)
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'))
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'))
const workerPath = normalizePath(path.join(pdfjsDistPath, 'legacy', 'build', 'pdf.worker.min.mjs'))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
        cleanupOutdatedCaches: true
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
  // server: {
  //   host: true,
  //   // host: '192.168.1.2',
  //   port: 3000,
  //   https: false,
  //   strictPort: true,
  //   // hmr: {
  //   //   port: 3000,
  //   // },
  //   // proxy: {
  //   //   '/api': {
  //   //     target: import.meta.env.VITE_POCKETBASE_URL,
  //   //     changeOrigin: true,
  //   //   }
  //   // },
  //   allowedHosts: true,
  //   mimeTypes: {
  //     'js': 'application/javascript',
  //   },
  //   watch: {
  //     ignored: [
  //       '**/node_modules/**',
  //       '**/.git/**',
  //       '**/dist/**',
  //       '**/cmaps/**',
  //       '**/pdf.worker.min.mjs'
  //     ]
  //   }
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@": path.resolve(import.meta.dirname, "./src"),
      // '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})