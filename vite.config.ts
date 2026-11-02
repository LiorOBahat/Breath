import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// base './' lets the app work from a GitHub Pages sub-path or any other host.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,mp3}'] },
      manifest: {
        name: 'נשימה',
        short_name: 'נשימה',
        lang: 'he',
        dir: 'rtl',
        display: 'standalone',
        background_color: '#0e1b2a',
        theme_color: '#0e1b2a',
        start_url: './',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
  test: { environment: 'node' },
});
