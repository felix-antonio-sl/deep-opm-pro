import { CANON } from "./constantes";

/** Constantes de dimensionado canónico del in-zoom, compartidas por la semilla y el auto-layout. */
export const INZOOM_CANON = {
  /** Padding vertical superior dentro del contorno (espacio para el título). */
  paddingSuperior: 100,
  /** Padding inferior dentro del contorno (espacio bajo el último subthing). */
  paddingInferior: 65,
  /** Separación vertical entre subthings apilados dentro del contorno. */
  gapInterno: 30,
  /** Multiplicador de ancho del contorno relativo a `CANON.dims.cosaWidth`. */
  multAncho: 3,
  /** Número mínimo de subthings considerado para dimensionar el contorno. */
  minSubthings: 3,
} as const;

/** Ancho canónico del contorno de in-zoom: `cosaWidth * multAncho`. */
export const contornoWidthCanonico = CANON.dims.cosaWidth * INZOOM_CANON.multAncho;

/**
 * Alto canónico del contorno de in-zoom para `n` subthings:
 * `(cosaHeight + gapInterno) * max(n, minSubthings) + paddingSuperior + paddingInferior`.
 */
export function contornoHeightCanonico(n: number = INZOOM_CANON.minSubthings): number {
  return (
    (CANON.dims.cosaHeight + INZOOM_CANON.gapInterno) * Math.max(n, INZOOM_CANON.minSubthings) +
    INZOOM_CANON.paddingSuperior +
    INZOOM_CANON.paddingInferior
  );
}
