/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// On GitHub Pages the app lives at /everthread/. Locally it runs at /.
// Reading VITE_BASE_URL from the environment lets CI set it to /everthread/
// while local `npm run dev` keeps it at / so asset paths resolve correctly.
const base = process.env.VITE_BASE_URL ?? '/';

export default defineConfig({
  base,
  plugins: [
    react()
  ],
  server: {
    port: 5173,
    open: false
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
