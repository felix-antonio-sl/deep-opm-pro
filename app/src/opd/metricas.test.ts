import { expect, test } from 'bun:test';
import * as m from './metricas';
import * as f from './fuente';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';

test('T-204 ancho real une avance y sobrepasos de todos los glifos, normaliza copia NFC', () => {
  expect(m.anchoTexto).toBeFunction();
  for (const [text, px, italica, bbox] of [['AV', 17, false, 22.675979614257812], ['AV', 17, true, 23.675979614257812], ['jÁ', 13, false, 14.705001831054688], ['fl', 11, false, 7.171875], ['ffi', 17, false, 17.265625]] as const) expect(Math.abs(m.anchoTexto(text, px, italica) - bbox) / bbox).toBeLessThan(.02);
  const original = 'A\u0301rbol'; expect(m.anchoTexto(original, 17, false)).toBe(m.anchoTexto('Árbol', 17, false)); expect(original).toBe('A\u0301rbol');
  expect(m.anchoTexto('', 17, false)).toBe(0); expect(m.anchoTexto('AV', 0, false)).toBe(0);
});
test('T-204 tabla conserva 224 avances1000 en ambos estilos y reserva por punto Unicode', () => {
  expect(m.AVANCES_1000).toBeDefined(); expect(m.AVANCES_1000.normal).toHaveLength(224); expect(m.AVANCES_1000.italica).toHaveLength(224);
  expect(m.AVANCES_1000.normal[65 - 32]).toBeCloseTo(627.9988403320312, 10);
  expect(m.anchoTexto('🦉', 19, false)).toBe(m.anchoTexto('?', 19, false)); expect(m.anchoTexto('😀😀', 19, true)).toBe(m.anchoTexto('??', 19, true));
  expect(m.anchoTexto('A', 20, false)).toBeCloseTo(m.anchoTexto('A', 40, false) / 2, 12);
  for (const px of [-1, NaN, Infinity]) expect(() => m.anchoTexto('A', px, false)).toThrow(RangeError);
});
test('T-204 envolver conserva palabras completas, saltos y palabra indivisible sin elipsis', () => {
  expect(m.envolver).toBeFunction();
  expect(m.envolver('AV AV AV', 30, 17, false)).toEqual(['AV', 'AV', 'AV']);
  expect(m.envolver('  Árbol   Ñandú\n\npingüino  ', 500, 17, false)).toEqual(['Árbol Ñandú', '', 'pingüino']);
  expect(m.envolver('extraordinariamente', 1, 17, true)).toEqual(['extraordinariamente']); expect(m.envolver('', 132, 17, false)).toEqual(['']);
  const text = 'Gestión de Órdenes para Almacenar información'; const lines = m.envolver(text, 132, 17, true); expect(lines.join(' ')).toBe(text); expect(lines.length).toBeGreaterThan(1);
  for (const line of lines) expect(m.anchoTexto(line, 17, true)).toBeLessThanOrEqual(132);
  expect(() => m.envolver('x', 0, 17, false)).toThrow(RangeError);
});
test('T-204 ambas WOFF2 generadas conservan bytes locales fuente', () => {
  expect(f.INRIA_REGULAR_WOFF2).toBeString(); expect(f.INRIA_ITALICA_WOFF2).toBeString();
  for (const [font, sha] of [[f.INRIA_REGULAR_WOFF2, '6352ec91d24e5cd9617fca75fb362e7d08df17781cc968929b0c3de313ccb4ea'], [f.INRIA_ITALICA_WOFF2, 'd91206821e54d1587380745c61ba80aab732668be025079cb6d73799a5e6338f']]) expect(createHash('sha256').update(Buffer.from(font!, 'base64')).digest('hex')).toBe(sha!);
});
test('T-204 generador real regenera ambos artefactos dos veces idénticos', async () => {
  const tool = new URL('../../herramientas/medir-fuente.ts', import.meta.url); expect(await Bun.file(tool).exists()).toBe(true);
  const scratch = mkdtempSync(join(tmpdir(), 'opforja-wp8a-generador-'));
  try {
    const resultados: string[][] = [];
    for (const parte of ['primera', 'segunda']) {
      const salida = join(scratch, parte);
      const child = Bun.spawn([process.execPath, '--no-env-file', tool.pathname, '--salida', salida], { cwd: new URL('../..', import.meta.url).pathname, stdout: 'pipe', stderr: 'pipe' });
      const [stdout, stderr, code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
      expect(stderr).toBe(''); expect(code).toBe(0); expect(JSON.parse(stdout).fuentes).toEqual(['loaded', 'loaded']);
      resultados.push(['metricas.ts', 'fuente.ts'].map(name => readFileSync(join(salida, name), 'utf8')));
    }
    expect(resultados[0]).toEqual(resultados[1]);
    expect(resultados[0]).toEqual(['metricas.ts', 'fuente.ts'].map(name => readFileSync(new URL(name, import.meta.url), 'utf8')));
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}, 30000);

test('T-204 API generada coincide en Bun/navegador y getBBox en 102 rótulos sintéticos', async () => {
  const { chromium } = await import('@playwright/test');
  const script = new Bun.Transpiler({ loader: 'ts' }).transformSync(readFileSync(new URL('metricas.ts', import.meta.url), 'utf8'));
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(script).toString('base64');
  const esperado = chromium.executablePath();
  const executablePath = existsSync('/opt/pw-browsers') ? join('/opt/pw-browsers', basename(dirname(dirname(esperado))), 'chrome-linux64/chrome') : esperado;
  const browser = await chromium.launch({ executablePath, headless: true, args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'] });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block' }); await context.route('**/*', route => route.abort()); const page = await context.newPage();
    const strings = ['AV', 'VA', 'To', 'WA', 'ffi', 'fi', 'fl', 'ffl', 'fifí', 'Árbol Ñandú pingüino', 'Almacenar información', 'Gestión de Órdenes', 'AV AV', 'iiii', 'jÁ', 'Pedido muy largo sin truncamiento', 'A\u0301rbol'];
    const observados = await page.evaluate(async ({ moduleUrl, fonts, strings }) => {
      const api = await import(moduleUrl) as { anchoTexto: (text: string, px: number, italic: boolean) => number; envolver: (text: string, max: number, px: number, italic: boolean) => string[] };
      const familia = 'Inria Serif prueba';
      const caras = ['normal', 'italic'].map((style, i) => new FontFace(familia, `url(data:font/woff2;base64,${fonts[i]})`, { style, weight: '400' }));
      await Promise.all(caras.map(c => c.load())); caras.forEach(c => document.fonts.add(c)); await document.fonts.ready;
      if (caras.some(c => c.status !== 'loaded')) throw new Error('fuente no cargada');
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); document.body.append(svg);
      const medidas: { text: string; px: number; italic: boolean; previsto: number; real: number }[] = [];
      for (const italic of [false, true]) for (const px of [11, 13, 17]) for (const text of strings) {
        const el = document.createElementNS(svg.namespaceURI, 'text') as SVGTextElement; el.textContent = text.normalize('NFC');
        Object.assign(el.style, { fontFamily: familia, fontSize: `${px}px`, fontStyle: italic ? 'italic' : 'normal', fontWeight: '400', fontKerning: 'none', fontVariantLigatures: 'none', letterSpacing: '0', wordSpacing: '0' });
        svg.append(el); medidas.push({ text, px, italic, previsto: api.anchoTexto(text, px, italic), real: el.getBBox().width }); el.remove();
      }
      return { medidas, envuelto: api.envolver('Árbol Ñandú pingüino Almacenar información', 132, 17, true) };
    }, { moduleUrl, fonts: [f.INRIA_REGULAR_WOFF2, f.INRIA_ITALICA_WOFF2], strings });
    expect(observados.medidas).toHaveLength(102);
    for (const o of observados.medidas) { expect(o.previsto).toBe(m.anchoTexto(o.text, o.px, o.italic)); expect(Math.abs(o.previsto - o.real) / o.real).toBeLessThan(.02); }
    expect(observados.envuelto).toEqual([...m.envolver('Árbol Ñandú pingüino Almacenar información', 132, 17, true)]);
  } finally { await browser.close(); }
}, 30000);
