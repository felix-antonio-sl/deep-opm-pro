// Heuristicas geometricas puras para el layout del modelador OPM.
// Aisladas del store para que la orquestacion (store) no mezcle lazos
// arquitecturales con calculo de posiciones; permite testear el layout
// sin levantar el ciclo completo de zustand.
import { CANON } from "./constantes";
import { obtenerRefinamiento } from "./refinamientos";
import type { Apariencia, Id, Modelo, Posicion, TipoEntidad } from "./tipos";

export interface ContornoRefinable {
  id: Id;
  entidadId: Id;
  x: number;
  y: number;
  width: number;
  height: number;
}

const FILAS_BUSQUEDA = 20;
const ALTO_FILA = 88;
const MARGEN_INTERNO = 36;
const PADDING_OFFSET = 68;
const PADDING_INFERIOR = 24;
const MARGEN_SOLAPE = 18;
const CONTORNO_PAD_X = 4;
const CONTORNO_PAD_TOP = 28;
const CONTORNO_PAD_BOTTOM = 8;
export const CANVAS_GEOMETRICO_BASE = { width: 7200, height: 5200 } as const;
export const CENTRO_CANVAS_GEOMETRICO = {
  x: Math.round(CANVAS_GEOMETRICO_BASE.width / 2),
  y: Math.round(CANVAS_GEOMETRICO_BASE.height / 2),
} as const;
export const POSICION_INICIAL_CANVAS: Posicion = {
  x: Math.round(CENTRO_CANVAS_GEOMETRICO.x - CANON.dims.cosaWidth / 2),
  y: Math.round(CENTRO_CANVAS_GEOMETRICO.y - CANON.dims.cosaHeight / 2),
};

const OFFSET_COLUMNAS_CENTRO = 220;
const COLUMNAS_LIBRES_CANVAS = [
  POSICION_INICIAL_CANVAS.x,
  POSICION_INICIAL_CANVAS.x - OFFSET_COLUMNAS_CENTRO,
  POSICION_INICIAL_CANVAS.x + OFFSET_COLUMNAS_CENTRO,
  POSICION_INICIAL_CANVAS.x - OFFSET_COLUMNAS_CENTRO * 2,
  POSICION_INICIAL_CANVAS.x + OFFSET_COLUMNAS_CENTRO * 2,
];

export function posicionLibre(modelo: Modelo, opdId: Id, tipo: TipoEntidad): Posicion {
  const contenedor = contenedorRefinamiento(modelo, opdId);
  const columnas = contenedor
    ? columnasDentroDe(contenedor, tipo)
    : COLUMNAS_LIBRES_CANVAS;
  const yInicial = contenedor ? contenedor.y + PADDING_OFFSET : POSICION_INICIAL_CANVAS.y;
  const yMax = contenedor
    ? contenedor.y + contenedor.height - CANON.dims.cosaHeight - PADDING_INFERIOR
    : Number.POSITIVE_INFINITY;
  const apariencias = Object.values(modelo.opds[opdId]?.apariencias ?? {});
  for (let fila = 0; fila < FILAS_BUSQUEDA; fila += 1) {
    for (const x of columnas) {
      const candidata = { x, y: yInicial + fila * ALTO_FILA };
      if (candidata.y > yMax) continue;
      if (!apariencias.some((apariencia) => solapa(candidata, apariencia))) return candidata;
    }
  }
  return { x: columnas[0] ?? 80, y: Math.min(yInicial + apariencias.length * ALTO_FILA, yMax) };
}

export function solapa(
  posicion: Posicion,
  apariencia: { x: number; y: number; width: number; height: number },
): boolean {
  if (esContornoRefinamiento(apariencia)) return false;
  const a = {
    left: posicion.x - MARGEN_SOLAPE,
    right: posicion.x + CANON.dims.cosaWidth + MARGEN_SOLAPE,
    top: posicion.y - MARGEN_SOLAPE,
    bottom: posicion.y + CANON.dims.cosaHeight + MARGEN_SOLAPE,
  };
  const b = {
    left: apariencia.x - MARGEN_SOLAPE,
    right: apariencia.x + apariencia.width + MARGEN_SOLAPE,
    top: apariencia.y - MARGEN_SOLAPE,
    bottom: apariencia.y + apariencia.height + MARGEN_SOLAPE,
  };
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export function contenedorRefinamiento(modelo: Modelo, opdId: Id): ContornoRefinable | null {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return null;
  return Object.values(opd.apariencias).find((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad ? obtenerRefinamiento(entidad, "descomposicion")?.opdId === opdId : false;
  }) ?? null;
}

export function columnasDentroDe(contenedor: { x: number; width: number }, tipo: TipoEntidad): number[] {
  const left = contenedor.x + MARGEN_INTERNO;
  const center = contenedor.x + Math.max(MARGEN_INTERNO, (contenedor.width - CANON.dims.cosaWidth) / 2);
  const right = contenedor.x + contenedor.width - CANON.dims.cosaWidth - MARGEN_INTERNO;
  return tipo === "proceso" ? [center, left, right] : [left, center, right];
}

export function esContornoRefinamiento(apariencia: { width: number; height: number }): boolean {
  return apariencia.width > CANON.dims.cosaWidth || apariencia.height > CANON.dims.cosaHeight;
}

export function dentroDeApariencia(
  apariencia: { x: number; y: number; width: number; height: number },
  contorno: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

export function encajarAparienciaEnContorno(
  apariencia: { x: number; y: number; width: number; height: number },
  contorno: { x: number; y: number; width: number; height: number },
): Posicion {
  const minX = contorno.x + CONTORNO_PAD_X;
  const maxX = contorno.x + contorno.width - apariencia.width - CONTORNO_PAD_X;
  const minY = contorno.y + CONTORNO_PAD_TOP;
  const maxY = contorno.y + contorno.height - apariencia.height - CONTORNO_PAD_BOTTOM;
  return {
    x: Math.round(Math.max(minX, Math.min(maxX, apariencia.x))),
    y: Math.round(Math.max(minY, Math.min(maxY, apariencia.y))),
  };
}
