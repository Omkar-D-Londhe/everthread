/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/everthread/',
  plugins: [
    react(),
    {
      name: 'everthread-base-asset-resolver',
      enforce: 'post',
      renderChunk(code) {
        return code.replace(/(?<!\/everthread)\/images\//g, '/everthread/images/');
      }
    }
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
