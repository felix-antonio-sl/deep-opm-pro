// W3.1 (H1) — Fuente ÚNICA de las constantes de dimensionado canónico del in-zoom.
//
// Hallazgo H1: las constantes del in-zoom estaban DUPLICADAS y coincidían por casualidad entre
// `modelo/operaciones/refinamiento/descomposicion.ts` (canónica, semilla del in-zoom) y
// `canvas/layoutSugerido.ts` (auto-layout heurístico del OPD activo). Aquí viven UNA sola vez.
//
// Verificación de igualdad EXACTA antes de unificar (W3.1.1):
//   paddingSuperior  100  ==  descomposicion.paddingSuperior 100   ==  layoutSugerido.paddingSuperior 100
//   paddingInferior   65  ==  descomposicion (+65 en contornoHeight) ==  layoutSugerido.paddingInferior  65
//   gapInterno        30  ==  descomposicion.separacionVertical 30  ==  layoutSugerido.gapInterno        30
//   multAncho          3  ==  descomposicion (*3 en contornoWidth)  ==  layoutSugerido.multAncho          3
//   minSubthings       3  ==  descomposicion.subprocesosIniciales 3 ==  layoutSugerido.minSubthings       3
// Las cinco coinciden byte-a-byte → se unifican. Lo que NO coincide se queda en su sitio (ver abajo).
//
// NO unificado (divergencia documentada, intencional):
//   - `descomposicion.ts`: `toleranciaParaleloY: 4` — exclusivo de la semilla (umbral de paralelismo
//     al colocar subprocesos iniciales); no existe en layoutSugerido. Se queda en descomposicion.
//   - `layoutSugerido.ts`: `margenExterno 24`, `gapExterno 32`, `gapInternoHorizontal 50`,
//     `paddingLateralDenso 45` — exclusivos del auto-layout denso (multi-columna de externos,
//     grilla densa de embedded); no existen en la semilla. Se quedan en layoutSugerido.
//   - `autoria/layout.ts` (motor de bundle) usa su PROPIO juego `LAYOUT` (GAP_H/ROWH/X0/…), que es
//     un conjunto SEMÁNTICAMENTE DISTINTO (tuning de bandas topológicas del bundle), no una tercera
//     copia de estas constantes de in-zoom. No se toca aquí.
//
// `CANON.dims.{cosaWidth,cosaHeight}` es la otra entrada del dimensionado; vive en `modelo/constantes`.
// Dependencia: `canvas → modelo` (legal); consumidores `modelo/…/descomposicion` y `canvas/layoutSugerido`
// importan estas constantes (mismo precedente que `modelo/operaciones/apariencias → canvas/grid`).
import { CANON } from "../modelo/constantes";

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
 * Con `n = minSubthings` reproduce la semilla de `descomponerProceso` (subprocesos iniciales).
 */
export function contornoHeightCanonico(n: number = INZOOM_CANON.minSubthings): number {
  return (
    (CANON.dims.cosaHeight + INZOOM_CANON.gapInterno) * Math.max(n, INZOOM_CANON.minSubthings) +
    INZOOM_CANON.paddingSuperior +
    INZOOM_CANON.paddingInferior
  );
}
