import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  envDir: false,
  server: {
    host: '127.0.0.1', port: 5173, strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:8787', '/salud': 'http://127.0.0.1:8787' },
  },
  build: { outDir: 'dist/cliente' },
});
