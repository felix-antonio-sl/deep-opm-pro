import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';

const app = resolve(import.meta.dir, '..');
const capas: Record<string, string[]> = {
  nucleo: ['nucleo'], codec: ['codec', 'nucleo'], opl: ['opl', 'nucleo'],
  opd: ['opd', 'nucleo'], editor: ['editor', 'nucleo', 'codec', 'opl', 'opd'],
  ui: ['ui', 'editor', 'nucleo', 'codec', 'opl', 'opd'], servidor: ['servidor', 'codec'],
};
const capa = (ruta: string) => ruta.startsWith('src/') ? ruta.split('/')[1]! : ruta.split('/')[0]!;
const prueba = (ruta: string) => /\.test(?:\.[cm]?[jt]sx?)?$/.test(ruta);
function permitida(origen: string, destino: string): boolean {
  if (prueba(origen) || origen.startsWith('src/pruebas/')) return true;
  if (prueba(destino) || destino.startsWith('src/pruebas/')) return false;
  if (origen === 'src/main.tsx') return capa(destino) === 'ui';
  if (origen === 'herramientas/migrar-postgres.ts') return ['codec', 'nucleo'].includes(capa(destino));
  return capas[capa(origen)]?.includes(capa(destino)) ?? false;
}
function importaciones(texto: string): string[] {
  return [...texto.matchAll(/(?:\b(?:import|export)\s+(?:[^'";]*?\s+from\s*)?|\b(?:import|require)\s*\(\s*)['"]([^'"]+)['"]/g)].map(m => m[1]!);
}

test('arquitectura: admite las dependencias de DESIGN §2.2', () => {
  for (const [origen, destinos] of Object.entries(capas)) for (const destino of destinos)
    expect(permitida(`${origen === 'servidor' ? '' : 'src/'}${origen}/a.ts`, `${destino === 'servidor' ? '' : 'src/'}${destino}/b.ts`)).toBe(true);
  expect(permitida('herramientas/migrar-postgres.ts', 'src/nucleo/diagnostico.ts')).toBe(true);
  expect(permitida('src/nucleo/a.test.ts', 'src/pruebas/constructores.ts')).toBe(true);
  expect(permitida('src/nucleo/a.test.ts', 'src/nucleo/b.test.ts')).toBe(true);
  expect(permitida('src/pruebas/constructores.ts', 'src/nucleo/b.test.ts')).toBe(true);
});
test.each([
  ['src/ui/App.tsx', 'src/nucleo/modelo.test.ts'],
  ['src/nucleo/tipos.ts', 'src/nucleo/tipos.test.ts'],
  ['src/ui/App.tsx', 'src/nucleo/modelo.test'],
  ['src/nucleo/tipos.ts', 'src/nucleo/tipos.test'],
])('arquitectura: producto %s no importa la prueba %s', (origen, destino) => {
  expect(permitida(origen, destino)).toBe(false);
});
test('arquitectura: los mutantes de dependencia quedan rechazados', () => {
  for (const [origen, destino] of [['src/nucleo/a.ts', 'src/ui/b.ts'], ['src/opl/a.ts', 'src/opd/b.ts'], ['src/opd/a.ts', 'src/opl/b.ts'], ['src/ui/a.ts', 'servidor/b.ts'], ['servidor/a.ts', 'src/nucleo/b.ts'], ['servidor/a.ts', 'src/ui/b.ts'], ['src/editor/a.ts', 'src/pruebas/b.ts'], ['herramientas/dev.ts', 'src/nucleo/b.ts']]) expect(permitida(origen!, destino!)).toBe(false);
  expect(importaciones(`import type {
 A
 } from '../nucleo/tipos'; export { b } from '../opd/b'; import('../ui/c'); require('../codec/d');`)).toEqual(['../nucleo/tipos', '../opd/b', '../ui/c', '../codec/d']);
});
test('arquitectura: el código respeta las capas y las pruebas no se empaquetan', () => {
  const errores: string[] = [];
  for (const ruta of new Bun.Glob('{src,servidor,herramientas}/**/*.{ts,tsx}').scanSync({ cwd: app })) {
    if (!prueba(ruta) && ruta !== 'src/main.tsx' && !capas[capa(ruta)] && !ruta.startsWith('src/pruebas/') && !ruta.startsWith('herramientas/')) errores.push(`${ruta}: capa desconocida`);
    for (const modulo of importaciones(readFileSync(resolve(app, ruta), 'utf8'))) {
      if (!modulo.startsWith('.') && !modulo.startsWith('/')) continue;
      const destino = relative(app, resolve(app, dirname(ruta), modulo)).split(sep).join('/');
      if (!permitida(ruta, destino)) errores.push(`${ruta} → ${modulo}`);
    }
  }
  expect(errores).toEqual([]);
});
test('andamiaje: dependencias y check corresponden a DESIGN §§2.2 y 10.1', () => {
  const paquete = JSON.parse(readFileSync(resolve(app, 'package.json'), 'utf8'));
  expect(Object.keys(paquete.dependencies).sort()).toEqual(['@fontsource/inria-serif', 'preact']);
  expect(Object.keys(paquete.devDependencies).sort()).toEqual(['@playwright/test', '@preact/preset-vite', '@types/bun', 'typescript', 'vite']);
  expect(paquete.scripts.check).toBe('tsc --noEmit -p . && bun test src servidor herramientas');
  const tsconfig = JSON.parse(readFileSync(resolve(app, 'tsconfig.json'), 'utf8'));
  expect(tsconfig.compilerOptions.strict).toBe(true);
  expect(tsconfig.compilerOptions.paths).toBeUndefined();
  expect(tsconfig.compilerOptions.baseUrl).toBeUndefined();
  expect(tsconfig.include).toEqual(expect.arrayContaining(['src', 'servidor', 'e2e', 'herramientas']));
});
