import { chromium } from '@playwright/test';
import { existsSync, mkdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argumentos = process.argv.slice(2);
if (argumentos.length !== 0 && (argumentos.length !== 2 || argumentos[0] !== '--salida')) throw new Error('uso: medir-fuente.ts [--salida directorio]');
const salida = argumentos[1] ? resolve(argumentos[1]) : join(app, 'src/opd');
const esperado = chromium.executablePath();
const executablePath = existsSync('/opt/pw-browsers')
  ? join('/opt/pw-browsers', basename(dirname(dirname(esperado))), 'chrome-linux64/chrome')
  : esperado;
if (!existsSync(executablePath)) throw new Error('Chromium local no disponible; no se instala ni descarga');
const estilos = ['normal', 'italic'] as const;
const fuentes = await Promise.all(estilos.map(async estilo => Buffer.from(await Bun.file(join(app, `node_modules/@fontsource/inria-serif/files/inria-serif-latin-400-${estilo}.woff2`)).arrayBuffer()).toString('base64')));
const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
try {
  const context = await browser.newContext({ serviceWorkers: 'block' });
  await context.route('**/*', route => route.abort());
  const page = await context.newPage();
  const datos = await page.evaluate(async ({ fuentes }) => {
    const familia = 'Inria Serif medicion';
    const caras = ['normal', 'italic'].map((style, i) => new FontFace(familia, `url(data:font/woff2;base64,${fuentes[i]})`, { style, weight: '400' }));
    await Promise.all(caras.map(c => c.load())); caras.forEach(c => document.fonts.add(c)); await document.fonts.ready;
    if (caras.some(c => c.status !== 'loaded') || !document.fonts.check(`17px "${familia}"`) || !document.fonts.check(`italic 17px "${familia}"`)) throw new Error('Inria Serif no cargó');
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx || !('fontKerning' in ctx) || !('actualBoundingBoxLeft' in ctx.measureText('A'))) throw new Error('métricas de tinta no disponibles');
    const tablas = ['normal', 'italic'].map(estilo => {
      const medir = (px: number) => {
        ctx.font = `${estilo} ${px}px "${familia}"`; ctx.fontKerning = 'none';
        return Array.from({ length: 224 }, (_, i) => {
          const t = ctx.measureText(String.fromCodePoint(i + 32));
          if (![t.width, t.actualBoundingBoxLeft, t.actualBoundingBoxRight].every(Number.isFinite)) throw new Error('métrica no finita');
          return { avance: t.width, tinta: [t.actualBoundingBoxLeft, t.actualBoundingBoxRight] as [number, number] };
        });
      };
      const mil = medir(1000);
      return { avances: mil.map(t => t.avance), tinta1000: mil.map(t => t.tinta), tintaPx: Object.fromEntries([11, 13, 17].map(px => [px, medir(px).map(t => t.tinta)])) };
    });
    return { fuentes: caras.map(c => c.status), tablas };
  }, { fuentes });
  const normal = datos.tablas[0]!, italica = datos.tablas[1]!;
  const serializar = (valor: unknown) => JSON.stringify(valor);
  const cabecera = '// Generado por herramientas/medir-fuente.ts. No editar a mano.\n';
  const metricas = cabecera +
    `export const AVANCES_1000: Readonly<Record<Estilo, readonly number[]>> = Object.freeze({ normal: Object.freeze(${serializar(normal.avances)}), italica: Object.freeze(${serializar(italica.avances)}) });\n` +
    `const TINTA_1000: Readonly<Record<Estilo, readonly (readonly [number, number])[]>> = ${serializar({ normal: normal.tinta1000, italica: italica.tinta1000 })};\n` +
    `const TINTA_PX: Readonly<Record<string, Readonly<Record<Estilo, readonly (readonly [number, number])[]>>>> = ${serializar(Object.fromEntries([11, 13, 17].map(px => [px, { normal: normal.tintaPx[px], italica: italica.tintaPx[px] }])))};\n` + String.raw`

type Estilo = 'normal' | 'italica';
function validarPx(px: number): void {
  if (!Number.isFinite(px) || px < 0) throw new RangeError('tamaño de texto inválido');
}
/** Unión de avance y tinta. Copia NFC, sin DOM ni cambio del nombre persistido.
 * Dibujo debe usar Inria400, kerning:none, ligatures:none, spacing:0.
 * 11/13/17 usan márgenes medidos; otros px escalan1000 sin garantía universal2%.
 * Fuera de Latin-1 se reserva '?' por punto Unicode, no por unidad UTF-16;
 * no se afirma equivalencia con un glifo dibujado mediante fuente de respaldo. */
export function anchoTexto(texto: string, px: number, italica: boolean): number {
  validarPx(px);
  if (px === 0) return 0;
  const estilo: Estilo = italica ? 'italica' : 'normal', calibrada = TINTA_PX[px]?.[estilo];
  const tinta = calibrada ?? TINTA_1000[estilo], escalaTinta = calibrada ? 1 : px / 1000;
  let pen = 0, minimo = 0, maximo = 0;
  for (const char of texto.normalize('NFC')) {
    const cp = char.codePointAt(0)!, index = cp >= 32 && cp <= 255 ? cp - 32 : 63 - 32;
    const [izquierda, derecha] = tinta[index]!;
    minimo = Math.min(minimo, pen - izquierda * escalaTinta);
    maximo = Math.max(maximo, pen + derecha * escalaTinta);
    pen += AVANCES_1000[estilo][index]! * px / 1000;
  }
  return Math.max(maximo, pen) - minimo;
}
/** Conserva saltos explícitos y palabras indivisibles, normaliza espacios entre palabras.
 * Una palabra mayor que maxPx ocupa su propia línea; nunca se corta ni agrega elipsis. */
export function envolver(texto: string, maxPx: number, px: number, italica: boolean): readonly string[] {
  validarPx(px);
  if (!Number.isFinite(maxPx) || maxPx <= 0) throw new RangeError('ancho de envoltura inválido');
  const resultado: string[] = [];
  for (const parrafo of texto.normalize('NFC').split(/\r\n?|\n/u)) {
    const limpio = parrafo.trim();
    if (limpio === '') { resultado.push(''); continue; }
    let linea = '';
    for (const palabra of limpio.split(/\s+/u)) {
      const candidata = linea === '' ? palabra : linea + ' ' + palabra;
      if (linea !== '' && anchoTexto(candidata, px, italica) > maxPx) { resultado.push(linea); linea = palabra; }
      else linea = candidata;
    }
    resultado.push(linea);
  }
  return resultado;
}
`;
  const fuente = cabecera + `export const INRIA_REGULAR_WOFF2 = '${fuentes[0]}';\nexport const INRIA_ITALICA_WOFF2 = '${fuentes[1]}';\n`;
  mkdirSync(salida, { recursive: true });
  await Bun.write(join(salida, 'metricas.ts'), metricas);
  await Bun.write(join(salida, 'fuente.ts'), fuente);
  console.log(JSON.stringify({ chromium: browser.version(), fuentes: datos.fuentes, glifos: 224, tamanos: [11, 13, 17] }));
} finally { await browser.close(); }
