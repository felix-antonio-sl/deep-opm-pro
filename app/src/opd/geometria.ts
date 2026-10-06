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
  return { salida, retorno, pico, puntos: [...rayo(salida, pico), ...rayo(pico, retorno).slice(1)] };
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
export function peine(refinable: Contorno, refinadores: readonly (Contorno & { readonly id: string })[], incompleta: boolean): GeometriaPeine | null {
  const c = centro(refinable.caja);
  if (refinadores.length === 0) return null;
  const centros = refinadores.map(r => ({ r, c: centro(r.caja) }));
  const delta = diferencia(c, centroide(centros.map(r => r.c), c));
  const horizontal = Math.abs(delta.x) >= Math.abs(delta.y), signo = horizontal ? (delta.x < 0 ? -1 : 1) : (delta.y < 0 ? -1 : 1);
  const orientacion: Orientacion = horizontal ? (signo > 0 ? 'derecha' : 'izquierda') : (signo > 0 ? 'abajo' : 'arriba');
  const d = horizontal ? { x: signo, y: 0 } : { x: 0, y: signo };
  const n = horizontal ? { x: 0, y: 1 } : { x: 1, y: 0 };
  const borde = recortar(refinable.caja, sumar(c, d), refinable.forma), vertice = sumar(borde, d, 24), base = sumar(vertice, d, 30), bus = sumar(base, d, 16);
  const transversal = (p: Punto) => horizontal ? p.y : p.x;
  centros.sort((a, b) => transversal(a.c) - transversal(b.c) || ordenPuntos(a.c, b.c) || (a.r.id < b.r.id ? -1 : a.r.id > b.r.id ? 1 : 0));
  const coordenadas = [transversal(bus), ...centros.map(r => transversal(r.c))];
  const barra: readonly [Punto, Punto] = [sumar(bus, n, Math.min(...coordenadas) - transversal(bus)), sumar(bus, n, Math.max(...coordenadas) - transversal(bus))];
  const ramas = centros.map(({ r, c: cr }) => {
    const inicio = sumar(bus, n, transversal(cr) - transversal(bus));
    const hacia = inicio.x === cr.x && inicio.y === cr.y ? sumar(cr, d, -1) : inicio;
    return { id: r.id, puntos: [inicio, recortar(r.caja, hacia, r.forma)] as const };
  });
  return { orientacion, vertice, base, tronco: [borde, vertice], tallo: [base, bus], barra, ramas,
    ...(incompleta ? { incompleta: [sumar(sumar(base, d, 8), n, -7), sumar(sumar(base, d, 8), n, 7)] as const } : {}) };
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
function rangoRadio(c: Punto, puntos: readonly Punto[]): readonly [number, number] {
  let min = Infinity, max = 0;
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1]!, b = puntos[i]!, dx = b.x - a.x, dy = b.y - a.y, len = dx * dx + dy * dy;
    const t = len ? Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.y - a.y) * dy) / len)) : 0;
    min = Math.min(min, Math.hypot(a.x + t * dx - c.x, a.y + t * dy - c.y));
    max = Math.max(max, Math.hypot(a.x - c.x, a.y - c.y), Math.hypot(b.x - c.x, b.y - c.y));
  }
  return [min, max];
}
/** Selección por eventos de la geometría actual, sin malla ni radio envolvente
 * impuesto. Cada candidato se acepta sólo por intersecciones/sector visibles. */
export function agruparRecorridos(comun: Rect, caminos: readonly (readonly Punto[])[], operador: 'XOR' | 'OR', opacos: readonly Rect[]): readonly ArcoGeometrico[] | null {
  const c = centro(comun), delta = operador === 'OR' ? 5 : 0;
  const coordenadas = (eje: 'x' | 'y', longitud: number): number[] => {
    const lo = comun[eje], hi = lo + longitud;
    const eventos = [lo, c[eje], hi, ...caminos.flatMap(ps => ps.map(p => p[eje])).filter(n => n > lo && n < hi), ...opacos.flatMap(r => [r[eje], r[eje] + (eje === 'x' ? r.ancho : r.alto)]).filter(n => n > lo && n < hi)];
    const ordenados = [...new Set(eventos)].sort((a, b) => a - b);
    return [...new Set([...ordenados, ...ordenados.slice(1).map((n, i) => (n + ordenados[i]!) / 2)])].sort((a, b) => a - b);
  };
  const candidatos = coordenadas('x', comun.ancho).flatMap(x => coordenadas('y', comun.alto).map(y => ({ x, y })));
  candidatos.sort((a, b) => Math.hypot(a.x - c.x, a.y - c.y) - Math.hypot(b.x - c.x, b.y - c.y) || ordenPuntos(a, b));
  for (const centroArco of candidatos) {
    const rangos = caminos.map(ps => rangoRadio(centroArco, ps));
    const lo = Math.max(.01, ...rangos.map(r => r[0] + .01)), hi = Math.min(...rangos.map(r => r[1] - delta - .01));
    if (lo >= hi) continue;
    // Distancias a lados/vértices: cambios de incidencia círculo/obstáculo.
    const eventos = [lo, hi, ...opacos.flatMap(r => {
      const xs = [r.x, r.x + r.ancho], ys = [r.y, r.y + r.alto];
      return [...xs.flatMap(x => ys.map(y => Math.hypot(x - centroArco.x, y - centroArco.y))), ...xs.map(x => Math.abs(x - centroArco.x)), ...ys.map(y => Math.abs(y - centroArco.y))];
    }).flatMap(r => [r, r - delta]).filter(r => r > lo && r < hi)].sort((a, b) => a - b);
    const radios = eventos.slice(1).map((r, i) => (r + eventos[i]!) / 2);
    for (const radio of radios) {
      const hits = caminos.flatMap(ps => [radio, ...(delta ? [radio + delta] : [])].flatMap(r => ps.slice(1).flatMap((b, i) => crucesCirculo(centroArco, r, ps[i]!, b))));
      const sector = sectorMinimo(centroArco, hits);
      if (sector.hasta - sector.desde < 1e-6) continue;
      const arcos: ArcoGeometrico[] = [radio, ...(delta ? [radio + delta] : [])].map(r => ({ centro: centroArco, radio: r, ...sector, dash: '4 1', trazo: 1.5 }));
      if (arcos.every(a => arcoLibre(a, opacos))) return arcos;
    }
  }
  return null;
}

/** Grafo de visibilidad de las esquinas exteriores de obstáculos rectangulares.
 * El camino completo se contrasta con los obstáculos; no cambia posiciones. */
function caminoLibre(inicio: Punto, fin: Punto, cajas: readonly Rect[]): readonly Punto[] | null {
  if (cajas.some(r => dentroRect(inicio, r) || dentroRect(fin, r))) return null;
  const libre = (a: Punto, b: Punto) => !cajas.some(r => intersectaCaja(a, b, r, 'rectangulo'));
  if (libre(inicio, fin)) return [inicio, fin];
  const vertices = [inicio, fin, ...cajas.flatMap(r => {
    const e = expandirCaja(r, 1);
    return [{ x: e.x, y: e.y }, { x: e.x + e.ancho, y: e.y }, { x: e.x, y: e.y + e.alto }, { x: e.x + e.ancho, y: e.y + e.alto }];
  }).filter(p => !cajas.some(r => dentroRect(p, r))).sort(ordenPuntos)];
  const dist = vertices.map(() => Infinity), prev = vertices.map(() => -1), visto = new Set<number>(); dist[0] = 0;
  while (visto.size < vertices.length) {
    let elegido = -1;
    for (let i = 0; i < vertices.length; i++) if (!visto.has(i) && (elegido < 0 || dist[i]! < dist[elegido]!)) elegido = i;
    if (elegido < 0 || !Number.isFinite(dist[elegido]!)) return null;
    if (elegido === 1) {
      const result: Punto[] = []; let i = 1;
      while (i >= 0) { result.unshift(vertices[i]!); i = prev[i]!; }
      return result;
    }
    visto.add(elegido);
    for (let j = 0; j < vertices.length; j++) if (!visto.has(j) && libre(vertices[elegido]!, vertices[j]!)) {
      const value = dist[elegido]! + Math.hypot(vertices[j]!.x - vertices[elegido]!.x, vertices[j]!.y - vertices[elegido]!.y);
      if (value < dist[j]! - EPS) { dist[j] = value; prev[j] = elegido; }
    }
  }
  return null;
}
function recorridoTerminal(terminal: Contorno, fin: Punto, obstaculos: readonly Rect[]): readonly Punto[] | null {
  const c = centro(terminal.caja), hacia = unidad(diferencia(c, fin));
  const dirs = [hacia, ...[0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4, Math.PI, 5 * Math.PI / 4, 3 * Math.PI / 2, 7 * Math.PI / 4].map(t => ({ x: Math.cos(t), y: Math.sin(t) }))];
  let mejor: readonly Punto[] | null = null, coste = Infinity;
  for (const d of dirs) {
    const recorte = recortar(terminal.caja, sumar(c, d), terminal.forma);
    // Redondeo de la última suma: el puerto permanece dentro de SU caja exacta.
    const puerto = { x: Math.max(terminal.caja.x, Math.min(recorte.x, terminal.caja.x + terminal.caja.ancho)), y: Math.max(terminal.caja.y, Math.min(recorte.y, terminal.caja.y + terminal.caja.alto)) }, salida = sumar(puerto, d, 24);
    if (obstaculos.some(r => intersectaCaja(puerto, salida, r, 'rectangulo'))) continue;
    const camino = caminoLibre(salida, fin, [...obstaculos, expandirCaja(terminal.caja, 1)]);
    if (!camino) continue;
    const puntos = [puerto, ...camino];
    const longitud = puntos.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - puntos[i]!.x, p.y - puntos[i]!.y), 0);
    if (longitud < coste - EPS) { coste = longitud; mejor = puntos; }
  }
  return mejor;
}
export interface RamaAgrupada {
  readonly id: string;
  readonly terminal: Contorno;
  readonly proceso: Contorno;
  readonly obstaculosTerminal: readonly Rect[];
  readonly obstaculosProceso: readonly Rect[];
}
/** Recorridos separados: cruces radiales distintos, sin hub ni unión compartida.
 * La envolvente sólo ubica esta construcción exterior; no sustituye la prueba
 * de visibilidad ni se utiliza para imponer radio a los recorridos primarios. */
export function agruparConVertices(comun: Rect, ramas: readonly RamaAgrupada[], operador: 'XOR' | 'OR', opacos: readonly Rect[]): { readonly caminos: ReadonlyMap<string, readonly Punto[]>; readonly arcos: readonly ArcoGeometrico[] } | null {
  const c = centro(comun), delta = operador === 'OR' ? 5 : 0;
  const radio = Math.max(1, ...opacos.flatMap(r => [Math.hypot(r.x - c.x, r.y - c.y), Math.hypot(r.x + r.ancho - c.x, r.y + r.alto - c.y), Math.hypot(r.x - c.x, r.y + r.alto - c.y), Math.hypot(r.x + r.ancho - c.x, r.y - c.y)])) + 64;
  const ordenadas = [...ramas].sort((a, b) => ordenPuntos(centro(a.terminal.caja), centro(b.terminal.caja)) || ordenPuntos(centro(a.proceso.caja), centro(b.proceso.caja)));
  const media = centroide(ramas.map(r => centro(r.proceso.caja)), c), base = Math.atan2(media.y - c.y, media.x - c.x);
  for (const giro of [0, Math.PI / 2, -Math.PI / 2, Math.PI]) {
    const caminos = new Map<string, readonly Punto[]>(), hits: Punto[] = [];
    for (const [i, rama] of ordenadas.entries()) {
      const theta = base + giro + (i - (ramas.length - 1) / 2) * Math.min(.15, 1 / ramas.length);
      const d = { x: Math.cos(theta), y: Math.sin(theta) }, interno = sumar(c, d, radio - 16), externo = sumar(c, d, radio + delta + 16);
      const desdeO = recorridoTerminal(rama.terminal, interno, rama.obstaculosTerminal);
      const desdeP = recorridoTerminal(rama.proceso, externo, rama.obstaculosProceso);
      if (!desdeO || !desdeP) break;
      caminos.set(rama.id, [...desdeO, externo, ...desdeP.slice(0, -1).reverse()]);
      hits.push(sumar(c, d, radio), ...(delta ? [sumar(c, d, radio + delta)] : []));
    }
    if (caminos.size !== ramas.length) continue;
    const sector = sectorMinimo(c, hits);
    const arcos: ArcoGeometrico[] = [radio, ...(delta ? [radio + delta] : [])].map(r => ({ centro: c, radio: r, ...sector, dash: '4 1', trazo: 1.5 }));
    if (arcos.every(a => arcoLibre(a, opacos))) return { caminos, arcos };
  }
  return null;
}

/** Distancias de un rectángulo recortado por un sector. Cada pieza angular es
 * convexa (<= π); vértices y proyecciones sobre sus lados dan los extremos
 * radiales exactos. No se usa una resolución angular ni una malla de radios. */
function intervalosPoligono(c: Punto, sector: { readonly desde: number; readonly hasta: number }, vertices: readonly Punto[]): readonly (readonly [number, number])[] {
  const rangos: [number, number][] = [];
  const cortar = (ps: readonly Punto[], d: Punto, signo: number): Punto[] => {
    const valor = (p: Punto) => signo * (d.x * (p.y - c.y) - d.y * (p.x - c.x));
    const result: Punto[] = [];
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i]!, b = ps[(i + 1) % ps.length]!, va = valor(a), vb = valor(b);
      if (va >= -EPS) result.push(a);
      if ((va < 0 && vb > 0) || (va > 0 && vb < 0)) { const t = va / (va - vb); result.push({x:a.x + t*(b.x-a.x), y:a.y + t*(b.y-a.y)}); }
    }
    return result;
  };
  const piezas = Math.max(1, Math.ceil((sector.hasta - sector.desde) / Math.PI));
  for (let i = 0; i < piezas; i++) {
    const desde = sector.desde + (sector.hasta-sector.desde)*i/piezas, hasta = sector.desde + (sector.hasta-sector.desde)*(i+1)/piezas;
    let ps: readonly Punto[] = vertices;
    ps = cortar(cortar(ps,{x:Math.cos(desde),y:Math.sin(desde)},1),{x:Math.cos(hasta),y:Math.sin(hasta)},-1);
    if (!ps.length) continue;
    let minimo = dentroPoligono(c,vertices) ? 0 : Infinity, maximo = 0;
    for(let j=0;j<ps.length;j++) {
      const a=ps[j]!, b=ps[(j+1)%ps.length]!, dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy;
      const t=l?Math.max(0,Math.min(1,((c.x-a.x)*dx+(c.y-a.y)*dy)/l)):0;
      minimo=Math.min(minimo,Math.hypot(a.x+t*dx-c.x,a.y+t*dy-c.y));
      maximo=Math.max(maximo,Math.hypot(a.x-c.x,a.y-c.y));
    }
    rangos.push([minimo,maximo]);
  }
  return rangos;
}
/** Sólo segmentos radiales C→Q (o su inversa) ya materializados. El mismo
 * sector real rige ambos radios OR. Prioridad literal 30/35; luego primer
 * componente abierto factible, elegido por su punto medio interior. */
export function radioUniforme(c: Punto, fines: readonly Punto[], operador: 'XOR' | 'OR', opacos: readonly Rect[], elipses: readonly Rect[] = [], figuras: readonly ObstaculoArco[] = []): readonly ArcoGeometrico[] | null {
  const delta=operador==='OR'?5:0, sector=sectorMinimo(c,fines);
  const hi=Math.min(...fines.map(p=>Math.hypot(p.x-c.x,p.y-c.y)))-delta;
  if(fines.length<2 || hi<30) return null;
  const materializar=(radio:number): readonly ArcoGeometrico[] => [radio,...(delta?[radio+delta]:[])].map(r=>({centro:c,radio:r,...sector,dash:'4 1',trazo:1.5}));
  const fijo=materializar(30);
  if(fijo.every(a=>arcoLibre(a,opacos) && elipses.every(e=>arcoLibreElipse(a,e)) && figuras.every(f=>figuraLibre(a,f)))) return fijo;
  const rangos=[...opacos.flatMap(r=>intervalosPoligono(c,sector,verticesCaja(r))),...elipses.flatMap(r=>intervalosElipse(c,sector,r)),...figuras.flatMap(f=>f.tipo==='poligono'?intervalosPoligono(c,sector,f.puntos):intervalosDisco(c,sector,f.centro,f.radio))].flatMap(([a,b])=>[[a,b] as const,...(delta?[[a-delta,b-delta] as const]:[])])
    .filter(([a,b])=>b>=30 && a<=hi).sort((a,b)=>a[0]-b[0] || a[1]-b[1]);
  let lo=30;
  for(const [a,b] of [...rangos,[hi,hi] as const]) {
    if(a>lo+EPS) { const arcos=materializar((lo+Math.min(a,hi))/2); if(arcos.every(arc=>arcoLibre(arc,opacos) && elipses.every(e=>arcoLibreElipse(arc,e)) && figuras.every(f=>figuraLibre(arc,f)))) return arcos; }
    lo=Math.max(lo,b); if(lo>=hi) break;
  }
  return null;
}

/** Raíces reales de polinomio mediante sus puntos críticos (recursión sobre la
 * derivada). Cada intervalo es monótono; bisección de una raíz aislada, no
 * muestreo geométrico. Las tangencias se conservan como eventos cerrados. */
function raicesPolinomio(coeficientes: readonly number[]): readonly number[] {
  const p=[...coeficientes];while(p.length>1 && p.at(-1)===0)p.pop();
  const n=p.length-1;if(n===0)return [];if(n===1)return[-p[0]!/p[1]!];
  const evaluar=(x:number)=>p.reduceRight((v,c)=>v*x+c,0);
  const B=1+Math.max(...p.slice(0,-1).map(c=>Math.abs(c/p[n]!)));
  const criticos=raicesPolinomio(p.slice(1).map((c,i)=>c*(i+1))).filter(x=>x>-B && x<B);
  const cortes=[-B,...criticos,B],r:number[]=[];
  for(const x of criticos) if(Math.abs(evaluar(x))<=1e-10*p.reduce((v,c,i)=>v+Math.abs(c*x**i),0))r.push(x);
  for(let i=1;i<cortes.length;i++){let a=cortes[i-1]!,b=cortes[i]!,va=evaluar(a),vb=evaluar(b);
    if(va===0)r.push(a);if(vb===0)r.push(b);if(va*vb>=0)continue;
    for(let j=0;j<96;j++){const m=(a+b)/2,vm=evaluar(m);if((va<0)===(vm<0)){a=m;va=vm;}else{b=m;vb=vm;}}r.push((a+b)/2);
  }
  return [...new Set(r)].sort((a,b)=>a-b);
}
function enSector(sector:{readonly desde:number;readonly hasta:number},c:Punto,p:Punto):boolean{let a=Math.atan2(p.y-c.y,p.x-c.x);while(a<sector.desde-EPS)a+=TAU;return a<=sector.hasta+EPS;}
/** Intersección círculo/elipse: sustitución tan(θ/2) en la ecuación exacta
 * produce grado4. Cubre TODO sector, incluidos tangencias y extremos. */
export function arcoLibreElipse(a:ArcoGeometrico,caja:Rect):boolean{
  const E=centro(caja),rx=caja.ancho/2,ry=caja.alto/2,u=a.centro.x-E.x,v=a.centro.y-E.y,r=a.radio;
  const X=[u+r,0,u-r],Y=[v,2*r,v],p=[-1,0,-2,0,-1];
  for(let i=0;i<3;i++)for(let j=0;j<3;j++)p[i+j]!+=X[i]!*X[j]!/(rx*rx)+Y[i]!*Y[j]!/(ry*ry);
  const angulos=[a.desde,a.hasta,Math.PI,...raicesPolinomio(p).map(z=>2*Math.atan(z))];
  for(const angle of angulos){const P={x:a.centro.x+r*Math.cos(angle),y:a.centro.y+r*Math.sin(angle)};
    if(enSector(a,a.centro,P) && ((P.x-E.x)/rx)**2+((P.y-E.y)/ry)**2<=1+1e-10)return false;
  }return true;
}
function intervalosElipse(c:Punto,sector:{readonly desde:number;readonly hasta:number},caja:Rect):readonly (readonly[number,number])[]{
  const E=centro(caja),rx=caja.ancho/2,ry=caja.alto/2,dx=E.x-c.x,dy=E.y-c.y,diff=ry*ry-rx*rx;
  const theta=[Math.PI,...raicesPolinomio([dy*ry,-2*dx*rx+2*diff,0,-2*dx*rx-2*diff,-dy*ry]).map(z=>2*Math.atan(z))];
  const extrema=theta.map(t=>({x:E.x+rx*Math.cos(t),y:E.y+ry*Math.sin(t)})),rangos:[number,number][]=[],piezas=Math.max(1,Math.ceil((sector.hasta-sector.desde)/Math.PI));
  for(let i=0;i<piezas;i++){
    const s={desde:sector.desde+(sector.hasta-sector.desde)*i/piezas,hasta:sector.desde+(sector.hasta-sector.desde)*(i+1)/piezas};
    const ps=extrema.filter(p=>enSector(s,c,p));
    for(const t of[s.desde,s.hasta]){const ux=Math.cos(t),uy=Math.sin(t),x=c.x-E.x,y=c.y-E.y,A=(ux/rx)**2+(uy/ry)**2,B=2*(x*ux/(rx*rx)+y*uy/(ry*ry)),D=(x/rx)**2+(y/ry)**2-1,disc=B*B-4*A*D;
      if(disc>=0)for(const k of[(-B-Math.sqrt(disc))/(2*A),(-B+Math.sqrt(disc))/(2*A)])if(k>=0)ps.push({x:c.x+k*ux,y:c.y+k*uy});
    }
    if(!ps.length)continue;const dist=ps.map(p=>Math.hypot(p.x-c.x,p.y-c.y));
    rangos.push([((c.x-E.x)/rx)**2+((c.y-E.y)/ry)**2<=1?0:Math.min(...dist),Math.max(...dist)]);
  }return rangos;
}

export type ObstaculoArco = { readonly tipo: 'poligono'; readonly puntos: readonly Punto[] } | { readonly tipo: 'disco'; readonly centro: Punto; readonly radio: number };
const verticesCaja=(r:Rect):readonly Punto[]=>[{x:r.x,y:r.y},{x:r.x+r.ancho,y:r.y},{x:r.x+r.ancho,y:r.y+r.alto},{x:r.x,y:r.y+r.alto}];
function dentroPoligono(p:Punto,ps:readonly Punto[]):boolean{
  let dentro=false;for(let i=0,j=ps.length-1;i<ps.length;j=i++){const a=ps[i]!,b=ps[j]!;if(contieneSegmento(a,b,p))return true;
    if((a.y>p.y)!==(b.y>p.y) && p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)dentro=!dentro;}return dentro;
}
function arcoLibreDisco(a:ArcoGeometrico,c:Punto,r:number):boolean{
  const dx=c.x-a.centro.x,dy=c.y-a.centro.y,D=Math.hypot(dx,dy);
  const angles=[a.desde,a.hasta];
  if(D>0 && D<=a.radio+r && D>=Math.abs(a.radio-r)){const theta=Math.atan2(dy,dx),v=Math.max(-1,Math.min(1,(D*D+a.radio*a.radio-r*r)/(2*D*a.radio))),delta=Math.acos(v);angles.push(theta-delta,theta+delta);}
  return !angles.some(t=>{const p={x:a.centro.x+a.radio*Math.cos(t),y:a.centro.y+a.radio*Math.sin(t)};return enSector(a,a.centro,p) && Math.hypot(p.x-c.x,p.y-c.y)<=r+EPS;});
}
function intervalosDisco(c:Punto,sector:{readonly desde:number;readonly hasta:number},E:Punto,r:number):readonly (readonly[number,number])[]{
  const dx=E.x-c.x,dy=E.y-c.y,D=Math.hypot(dx,dy),theta=Math.atan2(dy,dx),ps:Punto[]=[];
  for(const t of[theta,theta+Math.PI]){const p={x:E.x+r*Math.cos(t),y:E.y+r*Math.sin(t)};if(enSector(sector,c,p))ps.push(p);}
  for(const t of[sector.desde,sector.hasta]){const ux=Math.cos(t),uy=Math.sin(t),b=dx*ux+dy*uy,disc=b*b-D*D+r*r;if(disc>=0)for(const k of[b-Math.sqrt(disc),b+Math.sqrt(disc)])if(k>=0)ps.push({x:c.x+k*ux,y:c.y+k*uy});}
  if(!ps.length)return[];const ds=ps.map(p=>Math.hypot(p.x-c.x,p.y-c.y));return[[D<=r?0:Math.min(...ds),Math.max(...ds)]];
}
function figuraLibre(a:ArcoGeometrico,f:ObstaculoArco):boolean{return f.tipo==='disco'?arcoLibreDisco(a,f.centro,f.radio):arcoLibrePoligono(a,f.puntos,0);}
/** Polígono relleno y distancia euclídea a TODO contorno: cada lado tiene
 * banda orientada + discos de radio pad en sus extremos (Minkowski). */
export function arcoLibrePoligono(a:ArcoGeometrico,ps:readonly Punto[],pad:number):boolean{
  for(const t of[a.desde,a.hasta])if(dentroPoligono({x:a.centro.x+a.radio*Math.cos(t),y:a.centro.y+a.radio*Math.sin(t)},ps))return false;
  for(let i=0;i<ps.length;i++){const p=ps[i]!,q=ps[(i+1)%ps.length]!,dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy);
    if(!arcoLibreDisco(a,p,pad))return false;if(!l)continue;
    const theta=Math.atan2(dy,dx),ux=dx/l,uy=dy/l,local={...a,centro:{x:(a.centro.x-p.x)*ux+(a.centro.y-p.y)*uy,y:-(a.centro.x-p.x)*uy+(a.centro.y-p.y)*ux},desde:a.desde-theta,hasta:a.hasta-theta};
    if(!arcoLibre(local,[{x:0,y:-pad,ancho:l,alto:Math.max(2*pad,1e-12)}]))return false;
  }return true;
}
/** Componentes exactos de tinta del marcador: punta cóncava triangulada;
 * piruleta rellena + palito. La transformación viene del glifo real. */
export function tintaMarcador(tipo:'punta'|'piruletaNegra'|'piruletaBlanca',M:readonly number[],pad:number):readonly ObstaculoArco[]{
  const en=(x:number,y:number)=>({x:M[0]!*x+M[2]!*y+M[4]!,y:M[1]!*x+M[3]!*y+M[5]!});
  const ps=tipo==='punta'?[en(0,0),en(23,8),en(12,0),en(23,-8)]:[en(0,0),en(7,0)];
  const result:ObstaculoArco[]=tipo==='punta'?[{tipo:'poligono',puntos:[ps[0]!,ps[1]!,ps[2]!]},{tipo:'poligono',puntos:[ps[0]!,ps[2]!,ps[3]!]}]:[{tipo:'disco',centro:en(12,0),radio:5+pad}];
  const n=tipo==='punta'?4:1;for(let i=0;i<n;i++){const a=ps[i]!,b=ps[(i+1)%ps.length]!,l=Math.hypot(b.x-a.x,b.y-a.y),nx=-(b.y-a.y)/l*pad,ny=(b.x-a.x)/l*pad;
    result.push({tipo:'poligono',puntos:[{x:a.x+nx,y:a.y+ny},{x:b.x+nx,y:b.y+ny},{x:b.x-nx,y:b.y-ny},{x:a.x-nx,y:a.y-ny}]},{tipo:'disco',centro:a,radio:pad},{tipo:'disco',centro:b,radio:pad});}
  return result;
}
