import type { Punto, Marcador } from './escena';
import type { Orientacion } from './geometria';

export interface FiguraLiteral {
  readonly tipo: 'path' | 'polilinea' | 'poligono';
  readonly datos: string;
  readonly relleno: 'tinta' | 'papel' | 'ninguno';
}
/** Las cadenas de spec-OPD §18.3 no se reescriben para orientarlas. */
export const MARCADORES = Object.freeze({
  punta: { tipo: 'path', datos: 'M 0 0 L 23 8 L 12 0 L 23 -8 Z', relleno: 'papel' },
  piruletaNegra: { tipo: 'path', datos: 'M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0', relleno: 'tinta' },
  piruletaBlanca: { tipo: 'path', datos: 'M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0', relleno: 'papel' },
  abierta: { tipo: 'polilinea', datos: '0,0 20,-10 0,0 20,10', relleno: 'ninguno' },
  arpon: { tipo: 'polilinea', datos: '0.5,0 20,10', relleno: 'ninguno' },
  arponInverso: { tipo: 'polilinea', datos: '0.5,0 20,-10', relleno: 'ninguno' },
  sobretiempo: { tipo: 'polilinea', datos: '4,10 13,-10', relleno: 'ninguno' },
  subtiempo: { tipo: 'polilinea', datos: '4,10 13,-10 8.5,0 17,0 13,10 22,-10', relleno: 'ninguno' },
  triangulo: { tipo: 'poligono', datos: '15,0 30,30 0,30', relleno: 'papel' },
} as const satisfies Record<string, FiguraLiteral>);
/** Alcance de cada marcador terminal sobre el eje, medido desde el extremo (incluye el ancla). */
export const LARGO_MARCADOR: Readonly<Record<Marcador, number>> = Object.freeze({ punta: 23, piruletaNegra: 17, piruletaBlanca: 17, abierta: 20, arpon: 20, arponInverso: 20 });
export type Matriz = readonly [number, number, number, number, number, number];
export interface Circulo { readonly tipo: 'circulo'; readonly centro: Punto; readonly radio: number; readonly relleno: 'tinta' }
export function triangulo(relacion: 'agregacion' | 'generalizacion' | 'exhibicion' | 'clasificacion'): { readonly exterior: FiguraLiteral; readonly interior?: FiguraLiteral | Circulo } {
  return { exterior: { ...MARCADORES.triangulo, relleno: relacion === 'agregacion' ? 'tinta' : 'papel' },
    ...(relacion === 'exhibicion' ? { interior: { tipo: 'poligono' as const, datos: '15,12 21,24 9,24', relleno: 'tinta' as const } } :
      relacion === 'clasificacion' ? { interior: { tipo: 'circulo' as const, centro: { x: 15, y: 20 }, radio: 4, relleno: 'tinta' as const } } : {}) };
}
/** Marco terminal +x hacia extremo; tangente coincidente usa +x.
 * Punta/abierta/arpón se rotan π; piruleta ancla en tangencia x=17. */
export function colocarMarcador(id: Marcador, extremo: Punto, desde: Punto): { readonly figura: FiguraLiteral; readonly matriz: Matriz } {
  for (const p of [extremo, desde]) if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) throw new RangeError('coordenadas no finitas');
  const dx = extremo.x - desde.x, dy = extremo.y - desde.y, len = Math.hypot(dx, dy);
  if (!Number.isFinite(len)) throw new RangeError('tangente fuera de rango');
  const tx = len === 0 ? 1 : dx / len, ty = len === 0 ? 0 : dy / len;
  const piruleta = id === 'piruletaNegra' || id === 'piruletaBlanca', signo = piruleta ? 1 : -1, ancla = piruleta ? 17 : id === 'arpon' || id === 'arponInverso' ? .5 : 0;
  const a = signo * tx, b = signo * ty, c = -signo * ty, d = signo * tx;
  return { figura: MARCADORES[id], matriz: [a, b, c, d, extremo.x - a * ancla, extremo.y - b * ancla] };
}
/** El vértice es (15,0); +y intrínseco apunta a la base/refinadores. */
export function colocarTriangulo(vertice: Punto, orientacion: Orientacion): Matriz {
  if (!Number.isFinite(vertice.x) || !Number.isFinite(vertice.y)) throw new RangeError('coordenadas no finitas');
  const dx = orientacion === 'derecha' ? 1 : orientacion === 'izquierda' ? -1 : 0, dy = orientacion === 'abajo' ? 1 : orientacion === 'arriba' ? -1 : 0;
  const nx = dy, ny = -dx;
  return [nx, ny, dx, dy, vertice.x - 15 * nx, vertice.y - 15 * ny];
}
