import { existsSync } from 'node:fs';

if (!existsSync(new URL('../servidor/principal.ts', import.meta.url))) {
  throw new Error('pendiente: WP-11 debe implementar el servidor para iniciar el entorno local');
}
const hijos = [
  Bun.spawn(['bun', '--watch', 'servidor/principal.ts', '--datos', '.datos-dev'], {
    stdout: 'inherit', stderr: 'inherit',
  }),
  Bun.spawn(['bun', 'x', 'vite'], { stdout: 'inherit', stderr: 'inherit' }),
];
const detener = () => { for (const hijo of hijos) hijo.kill(); };
process.on('SIGINT', detener);
process.on('SIGTERM', detener);
try {
  const codigo = await Promise.race(hijos.map(hijo => hijo.exited));
  process.exitCode = codigo;
} finally {
  detener();
  await Promise.all(hijos.map(hijo => hijo.exited));
}
