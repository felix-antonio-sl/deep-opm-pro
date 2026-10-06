import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  define: { __OPFORJA_VERSION__: JSON.stringify(process.env.OPFORJA_VERSION ?? 'local') },
  plugins: [
    {
      name: 'opforja-entrada',
      transformIndexHtml: {
        order: 'pre',
        handler: (html: string) => html.replace('</body>', '<script type="module" src="/src/main.tsx"></script>\n  </body>'),
      },
    },
    preact(),
  ],
  envDir: false,
  server: {
    host: '127.0.0.1', port: 5173, strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:8787', '/salud': 'http://127.0.0.1:8787' },
  },
  build: { outDir: 'dist' },
});
