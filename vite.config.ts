import { defineConfig } from 'vite';

export default defineConfig({
  // Відносні шляхи, щоб збірка працювала і в корені, і в підпапці на GitHub Pages
  base: './',
  server: {
    port: 9000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
