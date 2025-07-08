import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default defineConfig({
  plugins: [
    svelte(),
    skeleton({
      themes: { preset: ["skeleton"] }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}); 