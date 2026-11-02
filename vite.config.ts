import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

function gitHash() {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'unknown';
  }
}
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const builtAt = new Date().toISOString().slice(0, 16).replace('T', ' ');

// base './' lets the app work from a GitHub Pages sub-path or any other host.
export default defineConfig({
  base: './',
  define: { __APP_VERSION__: JSON.stringify(`v${pkg.version} · ${gitHash()} · ${builtAt} UTC`) },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,mp3,woff2}'] },
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
