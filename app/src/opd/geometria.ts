import type { Punto, Rect } from './escena';

export type Forma = 'rectangulo' | 'elipse' | 'capsula';
export interface Contorno { readonly caja: Rect; readonly forma: Forma }
export type Orientacion = 'abajo' | 'arriba' | 'derecha' | 'izquierda';
const TAU = Math.PI * 2;
const EPS = 1e-9;
function punto(p: Punto): void {
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) throw new RangeError('coordenadas no finitas');
}
function centro(caja: Rect): Punto {
  punto(caja);
  if (!Number.isFinite(caja.ancho) || !Number.isFinite(caja.alto) || caja.ancho <= 0 || caja.alto <= 0) throw new RangeError('caja sin área finita');
  const c = { x: caja.x + caja.ancho / 2, y: caja.y + caja.alto / 2 }; punto(c); return c;
}
function diferencia(a: Punto, b: Punto): Punto { punto(a); punto(b); const d = { x: b.x - a.x, y: b.y - a.y }; punto(d); return d; }
function sumar(a: Punto, b: Punto, k = 1): Punto { const p = { x: a.x + b.x * k, y: a.y + b.y * k }; punto(p); return p; }
function unidad(d: Punto): Punto {
  const len = Math.hypot(d.x, d.y);
  if (!Number.isFinite(len)) throw new RangeError('dirección fuera de rango');
  return len === 0 ? { x: 1, y: 0 } : { x: d.x / len, y: d.y / len };
}

/** Semirrecta centro→hacia. Sin dirección usa este; cajas sin área se rechazan. */
export function recortar(caja: Rect, hacia: Punto, forma: Forma): Punto {
  const c = centro(caja), d = unidad(diferencia(c, hacia)), w = caja.ancho / 2, h = caja.alto / 2;
  const ax = Math.abs(d.x), ay = Math.abs(d.y);
  let s = forma === 'elipse' ? 1 / Math.hypot(d.x / w, d.y / h) : Math.min(ax === 0 ? Infinity : w / ax, ay === 0 ? Infinity : h / ay);
  if (forma === 'capsula') {
    const r = Math.min(8, w, h), x = ax * s, y = ay * s;
    if (x > w - r && y > h - r) {
      const cx = w - r, cy = h - r, proyeccion = ax * cx + ay * cy;
      const perpendicular = ax * cy - ay * cx;
      s = proyeccion + Math.sqrt(Math.max(0, r * r - perpendicular * perpendicular));
    }
  }
  return sumar(c, d, s);
}
/** Al invertir extremos se invierte el resultado, también con centros coincidentes. */
export function recortarEnlace(a: Rect, formaA: Forma, b: Rect, formaB: Forma): readonly [Punto, Punto] {
  return [recortar(a, centro(b), formaA), recortar(b, centro(a), formaB)];
}
export function rayo(a: Punto, b: Punto): readonly [Punto, Punto, Punto, Punto] {
  const delta = diferencia(a, b), len = Math.hypot(delta.x, delta.y);
  if (!Number.isFinite(len)) throw new RangeError('segmento fuera de rango');
  if (len === 0) return [{ ...a }, { ...a }, { ...b }, { ...b }];
  const n = { x: -delta.y / len, y: delta.x / len }, k = Math.min(22, Math.max(12, len * .08));
  return [{ ...a }, sumar(sumar(a, delta, .46), n, k), sumar(sumar(a, delta, .54), n, -k), { ...b }];
}
export function autoinvocacion(caja: Rect): { readonly salida: Punto; readonly retorno: Punto; readonly pico: Punto; readonly puntos: readonly Punto[] } {
  const c = centro(caja), angulo = 35 * Math.PI / 180;
  const salida = recortar(caja, sumar(c, { x: Math.sin(angulo), y: Math.cos(angulo) }), 'elipse');
  const retorno = recortar(caja, sumar(c, { x: -Math.sin(angulo), y: Math.cos(angulo) }), 'elipse');
  const pico = { x: c.x, y: caja.y + caja.alto + Math.max(56, caja.alto * .55) }; punto(pico);
  return { salida, retorno, pico, puntos: [salida, pico, retorno] };
}
function ordenPuntos(a: Punto, b: Punto): number { return a.x - b.x || a.y - b.y; }
function centroide(puntos: readonly Punto[], reserva: Punto): Punto {
  if (puntos.length === 0) return { ...reserva };
  // Orden fijo: la permutación de las ramas no altera la suma de flotantes.
  const ordenados = [...puntos].sort(ordenPuntos); ordenados.forEach(punto);
  const c = { x: ordenados.reduce((s, p) => s + p.x / ordenados.length, 0), y: ordenados.reduce((s, p) => s + p.y / ordenados.length, 0) }; punto(c); return c;
}
export interface GeometriaPeine {
  readonly orientacion: Orientacion;
  readonly vertice: Punto;
  readonly base: Punto;
  readonly tronco: readonly [Punto, Punto];
  readonly tallo: readonly [Punto, Punto];
  readonly barra: readonly [Punto, Punto];
  readonly ramas: readonly { readonly id: string; readonly puntos: readonly [Punto, Punto] }[];
  readonly incompleta?: readonly [Punto, Punto];
}
/** Peine ortogonal (R-OPD-LAY-4). Primero el preferido: barra transversal en el lado de los
 * refinadores. Si atraviesa cosas, prueba la barra lateral y las otras orientaciones, y queda la
 * de menos cosas atravesadas; a igual cuenta, la anterior (DEC34). No mueve ni redimensiona cosas. */
export function peine(refinable: Contorno, refinadores: readonly (Contorno & { readonly id: string })[], incompleta: boolean, obstaculos: readonly Contorno[] = [], trazos: readonly (readonly Punto[])[] = [], peines: readonly (readonly Punto[])[] = []): GeometriaPeine | null {
  const c = centro(refinable.caja);
  if (refinadores.length === 0) return null;
  const centros = refinadores.map(r => ({ r, c: centro(r.caja) }));
  const delta = diferencia(c, centroide(centros.map(r => r.c), c));
  const horizontal = Math.abs(delta.x) >= Math.abs(delta.y), signo = horizontal ? (delta.x < 0 ? -1 : 1) : (delta.y < 0 ? -1 : 1);
  const otro = horizontal ? (delta.y < 0 ? -1 : 1) : (delta.x < 0 ? -1 : 1);
  const direcciones: readonly Punto[] = horizontal ? [{ x: signo, y: 0 }, { x: 0, y: otro }, { x: 0, y: -otro }, { x: -signo, y: 0 }] : [{ x: 0, y: signo }, { x: otro, y: 0 }, { x: -otro, y: 0 }, { x: 0, y: -signo }];
  let mejor: GeometriaPeine | undefined, menor = Infinity;
  for (const d of direcciones) for (const lateral of [false, true]) {
    const geo = trazarPeine(refinable, centros, incompleta, d, lateral);
    if (!geo) continue;
    // Montarse sobre otro peine confunde más que cortar un enlace, pero menos que atravesar una cosa.
    const k = atravesadas(geo, refinable, refinadores, obstaculos) + cortes(geo, peines) / 10 + cortes(geo, trazos) / 1000;
    if (k < menor) { mejor = geo; menor = k; }
    if (menor === 0) return mejor!;
  }
  return mejor ?? null;
}
function trazarPeine(refinable: Contorno, centros: readonly { readonly r: Contorno & { readonly id: string }; readonly c: Punto }[], incompleta: boolean, d: Punto, lateral: boolean): GeometriaPeine | null {
  const c = centro(refinable.caja), horizontal = d.y === 0;
  const orientacion: Orientacion = horizontal ? (d.x > 0 ? 'derecha' : 'izquierda') : (d.y > 0 ? 'abajo' : 'arriba');
  const n = horizontal ? { x: 0, y: 1 } : { x: 1, y: 0 };
  const borde = recortar(refinable.caja, sumar(c, d), refinable.forma), vertice = sumar(borde, d, 24), base = sumar(vertice, d, 30), bus = sumar(base, d, 16);
  const transversal = (p: Punto) => horizontal ? p.y : p.x, axial = (p: Punto) => horizontal ? p.x * d.x : p.y * d.y;
  const ordenados = [...centros].sort((a, b) => transversal(a.c) - transversal(b.c) || ordenPuntos(a.c, b.c) || (a.r.id < b.r.id ? -1 : a.r.id > b.r.id ? 1 : 0));
  let barra: readonly [Punto, Punto], ramas: { readonly id: string; readonly puntos: readonly [Punto, Punto] }[];
  if (!lateral) {
    const coordenadas = [transversal(bus), ...ordenados.map(r => transversal(r.c))];
    barra = [sumar(bus, n, Math.min(...coordenadas) - transversal(bus)), sumar(bus, n, Math.max(...coordenadas) - transversal(bus))];
    ramas = ordenados.map(({ r, c: cr }) => {
      const inicio = sumar(bus, n, transversal(cr) - transversal(bus));
      const hacia = inicio.x === cr.x && inicio.y === cr.y ? sumar(cr, d, -1) : inicio;
      return { id: r.id, puntos: [inicio, recortar(r.caja, hacia, r.forma)] as const };
    });
  } else {
    // Barra lateral: sigue la dirección del tallo y cada rama sale en perpendicular hacia su
    // refinador. Sólo vale si todos quedan más allá del tallo y fuera de su eje.
    if (ordenados.some(({ c: cr }) => axial(cr) <= axial(bus) || transversal(cr) === transversal(bus))) return null;
    const hasta = Math.max(...ordenados.map(({ c: cr }) => axial(cr))) - axial(bus);
    barra = [bus, sumar(bus, d, hasta)];
    ramas = ordenados.map(({ r, c: cr }) => {
      const inicio = sumar(bus, d, axial(cr) - axial(bus));
      return { id: r.id, puntos: [inicio, recortar(r.caja, inicio, r.forma)] as const };
    });
  }
  return { orientacion, vertice, base, tronco: [borde, vertice], tallo: [base, bus], barra, ramas,
    ...(incompleta ? { incompleta: [sumar(sumar(base, d, 8), n, -7), sumar(sumar(base, d, 8), n, 7)] as const } : {}) };
}
// Enlaces ya trazados que corta el peine: sólo desempata entre peines que no atraviesan cosas.
function cortes(g: GeometriaPeine, trazos: readonly (readonly Punto[])[]): number {
  const n = g.orientacion === 'derecha' || g.orientacion === 'izquierda' ? { x: 0, y: 15 } : { x: 15, y: 0 };
  const propios: (readonly [Punto, Punto])[] = [g.tronco, g.tallo, g.barra, ...g.ramas.map(r => r.puntos), [g.vertice, sumar(g.base, n)], [sumar(g.base, n), sumar(g.base, n, -1)], [sumar(g.base, n, -1), g.vertice]];
  let k = 0;
  for (const t of trazos) for (let i = 1; i < t.length; i++) if (propios.some(([a, b]) => intersectanSegmentos(a, b, t[i - 1]!, t[i]!))) k++;
  return k;
}
// Cosas que cruza el peine: cada tramo exime sólo su propio extremo, y el triángulo exime al refinable.
function atravesadas(g: GeometriaPeine, refinable: Contorno, refinadores: readonly (Contorno & { readonly id: string })[], obstaculos: readonly Contorno[]): number {
  const forma = (x: Contorno) => x.forma === 'elipse' ? 'elipse' : 'rectangulo';
  const toca = (a: Punto, b: Punto, x: Contorno) => intersectaCaja(a, b, x.caja, forma(x));
  const n = g.orientacion === 'derecha' || g.orientacion === 'izquierda' ? { x: 0, y: 15 } : { x: 15, y: 0 };
  const triangulo: readonly (readonly [Punto, Punto])[] = [[g.vertice, sumar(g.base, n)], [sumar(g.base, n), sumar(g.base, n, -1)], [sumar(g.base, n, -1), g.vertice]];
  let k = 0;
  for (const x of [...obstaculos, ...refinadores]) {
    if ([g.tronco, g.tallo, g.barra, ...triangulo].some(([a, b]) => toca(a, b, x))) k++;
  }
  for (const r of g.ramas) for (const x of [...obstaculos, refinable, ...refinadores.filter(y => y.id !== r.id)]) if (toca(r.puntos[0], r.puntos[1], x)) k++;
  if ([g.tallo, g.barra, ...triangulo].some(([a, b]) => toca(a, b, refinable))) k++;
  return k;
}
/** Radianes: 0=este, positivos hacia abajo en SVG; hasta puede superar 2π.
 * Empate de huecos: menor ángulo de inicio. Puntos coincidentes no aportan dirección. */
export function sectorMinimo(acople: Punto, otros: readonly Punto[]): { readonly desde: number; readonly hasta: number } {
  punto(acople);
  const angulos = otros.map(p => diferencia(acople, p)).filter(p => p.x !== 0 || p.y !== 0).map(p => (Math.atan2(p.y, p.x) + TAU) % TAU).sort((a, b) => a - b);
  if (angulos.length === 0) return { desde: 0, hasta: 0 };
  let hueco = -1, desde = 0;
  for (let i = 0; i < angulos.length; i++) {
    const a = angulos[i]!, siguiente = angulos[(i + 1) % angulos.length]!, gap = (i === angulos.length - 1 ? siguiente + TAU : siguiente) - a;
    if (gap > hueco + 1e-12 || (Math.abs(gap - hueco) <= 1e-12 && siguiente < desde)) { hueco = gap; desde = siguiente; }
  }
  return { desde, hasta: desde + TAU - hueco };
}
export interface ArcoGeometrico { readonly centro: Punto; readonly radio: number; readonly desde: number; readonly hasta: number; readonly dash: '4 1'; readonly trazo: 1.5 }
export function abanico(comun: Contorno, otros: readonly Punto[], operador: 'AND' | 'XOR' | 'OR'): { readonly acople: Punto; readonly arcos: readonly ArcoGeometrico[] } {
  const c = centro(comun.caja), acople = recortar(comun.caja, centroide(otros, c), comun.forma), sector = sectorMinimo(acople, otros);
  const radios = operador === 'AND' || otros.length < 2 ? [] : operador === 'XOR' ? [30] : [30, 35];
  return { acople, arcos: radios.map(radio => ({ centro: { ...acople }, radio, ...sector, dash: '4 1', trazo: 1.5 })) };
}
function cruz(a: Punto, b: Punto, c: Punto): number { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }
function contieneSegmento(a: Punto, b: Punto, p: Punto): boolean {
  return Math.abs(cruz(a, b, p)) <= EPS && p.x >= Math.min(a.x, b.x) - EPS && p.x <= Math.max(a.x, b.x) + EPS && p.y >= Math.min(a.y, b.y) - EPS && p.y <= Math.max(a.y, b.y) + EPS;
}
/** Incluye contacto, tangencia y solape colineal; nunca prolonga segmentos. */
export function intersectanSegmentos(a: Punto, b: Punto, c: Punto, d: Punto): boolean {
  [a, b, c, d].forEach(punto);
  const ac = cruz(a, b, c), ad = cruz(a, b, d), ca = cruz(c, d, a), cb = cruz(c, d, b);
  if (((ac > EPS && ad < -EPS) || (ac < -EPS && ad > EPS)) && ((ca > EPS && cb < -EPS) || (ca < -EPS && cb > EPS))) return true;
  return contieneSegmento(a, b, c) || contieneSegmento(a, b, d) || contieneSegmento(c, d, a) || contieneSegmento(c, d, b);
}
/** Intersección con el área cerrada: incluye segmentos interiores y tangentes. */
export function intersectaCaja(a: Punto, b: Punto, caja: Rect, forma: 'rectangulo' | 'elipse'): boolean {
  const c = centro(caja); punto(a); punto(b);
  if (forma === 'rectangulo') {
    let desde = 0, hasta = 1;
    for (const [start, end, minimo, maximo] of [[a.x, b.x, caja.x, caja.x + caja.ancho], [a.y, b.y, caja.y, caja.y + caja.alto]]) {
      const delta = end! - start!;
      if (delta === 0) { if (start! < minimo! || start! > maximo!) return false; }
      else { const t0 = (minimo! - start!) / delta, t1 = (maximo! - start!) / delta; desde = Math.max(desde, Math.min(t0, t1)); hasta = Math.min(hasta, Math.max(t0, t1)); if (desde > hasta) return false; }
    }
    return true;
  }
  const x = (a.x - c.x) / (caja.ancho / 2), y = (a.y - c.y) / (caja.alto / 2), dx = (b.x - a.x) / (caja.ancho / 2), dy = (b.y - a.y) / (caja.alto / 2);
  const len2 = dx * dx + dy * dy, t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(x * dx + y * dy) / len2));
  return (x + t * dx) ** 2 + (y + t * dy) ** 2 <= 1 + 1e-12;
}

/** Área redondeada + margen de tinta: unión analítica de dos bandas y cuatro
 * discos. Una esquina vacía del bbox nunca se trata como una cápsula opaca. */
export function intersectaCapsula(a: Punto, b: Punto, caja: Rect, pad = 0): boolean {
  const r = Math.min(8, caja.ancho / 2, caja.alto / 2);
  const bandas = [{ x: caja.x + r, y: caja.y - pad, ancho: caja.ancho - 2 * r, alto: caja.alto + 2 * pad }, { x: caja.x - pad, y: caja.y + r, ancho: caja.ancho + 2 * pad, alto: caja.alto - 2 * r }];
  if (bandas.some(c => c.ancho > 0 && c.alto > 0 && intersectaCaja(a, b, c, 'rectangulo'))) return true;
  const dx = b.x - a.x, dy = b.y - a.y, len = dx * dx + dy * dy;
  return [caja.x + r, caja.x + caja.ancho - r].some(x => [caja.y + r, caja.y + caja.alto - r].some(y => {
    const t = len ? Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / len)) : 0;
    return Math.hypot(a.x + t * dx - x, a.y + t * dy - y) <= r + pad;
  }));
}

/** Raíces círculo/segmento finito; la prolongación nunca aporta un cruce. */
export function crucesCirculo(c: Punto, radio: number, a: Punto, b: Punto): readonly Punto[] {
  const dx = b.x - a.x, dy = b.y - a.y, x = a.x - c.x, y = a.y - c.y;
  const aa = dx * dx + dy * dy, bb = 2 * (x * dx + y * dy), cc = x * x + y * y - radio * radio;
  const disc = bb * bb - 4 * aa * cc;
  if (!aa || disc < 0) return [];
  return [(-bb - Math.sqrt(disc)) / (2 * aa), (-bb + Math.sqrt(disc)) / (2 * aa)]
    .filter(t => t >= -EPS && t <= 1 + EPS).map(t => ({ x: a.x + t * dx, y: a.y + t * dy }));
}
const anguloEn = (a: ArcoGeometrico, p: Punto): number => {
  let angle = Math.atan2(p.y - a.centro.y, p.x - a.centro.x);
  while (angle < a.desde - EPS) angle += TAU;
  return angle;
};
const dentroRect = (p: Punto, r: Rect): boolean => p.x >= r.x && p.x <= r.x + r.ancho && p.y >= r.y && p.y <= r.y + r.alto;
export const expandirCaja = (r: Rect, pad: number): Rect => ({ x: r.x - pad, y: r.y - pad, ancho: r.ancho + 2 * pad, alto: r.alto + 2 * pad });
/** Visibilidad exacta respecto a rectángulos conservadores. Los límites son las
 * intersecciones analíticas círculo/lados, no una resolución de muestreo. */
export function arcoLibre(a: ArcoGeometrico, cajas: readonly Rect[]): boolean {
  const en = (angle: number): Punto => ({ x: a.centro.x + a.radio * Math.cos(angle), y: a.centro.y + a.radio * Math.sin(angle) });
  for (const r of cajas) {
    const corners = [{ x: r.x, y: r.y }, { x: r.x + r.ancho, y: r.y }, { x: r.x + r.ancho, y: r.y + r.alto }, { x: r.x, y: r.y + r.alto }];
    const cortes = corners.flatMap((p, i) => crucesCirculo(a.centro, a.radio, p, corners[(i + 1) % 4]!)).map(p => anguloEn(a, p)).filter(t => t >= a.desde - EPS && t <= a.hasta + EPS);
    if (cortes.length || dentroRect(en(a.desde), r) || dentroRect(en(a.hasta), r)) return false;
  }
  return true;
}
