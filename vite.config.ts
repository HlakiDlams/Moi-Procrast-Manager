import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

// https://vite.dev/config/
export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version.replace(/\.0$/, '')),
    __BUILD__: JSON.stringify(process.env.GITHUB_RUN_NUMBER ?? 'dev'),
    __BUILT_AT__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  // relative base so the build works from any sub-path (e.g. GitHub Pages)
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Un-procrast-inator',
        short_name: 'Un-procrast-inator',
        description: 'Study + life planner that beats procrastination. Works offline.',
        theme_color: '#0D0D0D',
        background_color: '#F70F85',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
      },
    }),
  ],
})
