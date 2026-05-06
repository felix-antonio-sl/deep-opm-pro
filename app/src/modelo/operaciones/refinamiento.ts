/**
 * Barrel de operaciones de refinamiento OPD: re-exporta las firmas públicas
 * desde los sub-archivos por dominio:
 * - descomposicion.ts: descomponerProceso, quitarDescomposicionProceso, INZOOM,
 *   apariencias proxy externas, subprocesos iniciales in-zoom.
 * - despliegue.ts: desplegarObjeto, quitarDespliegueObjeto, UNFOLD, partes
 *   iniciales, enlaces estructurales por modo (agregacion/exhibicion/...).
 * - proyeccion.ts: refrescarEnlacesExternosDerivados,
 *   redistribuirEnlacesExternosSiPrimerSubproceso, proyectarEnlacesExternosEnRefinamiento.
 * - helpers.ts: quitarRefinamientoEntidad, subprocesosOrdenadosDeRefinamiento,
 *   procesoDescompuestoEnOpd + utilidades privadas.
 *
 * El barrel preserva las firmas públicas pre-ronda 9.5 que consume el resto del
 * subdirectorio `operaciones/`: `enlaces.ts`, `apariencias.ts`, `eliminacion.ts`,
 * `creacion.ts`. Sin él, sus imports `from "./refinamiento"` se romperían.
 *
 * Refs: docs/instrucciones-lineas-dev/ronda9.5/ (sub-sub-particionado L1 ronda 9).
 */

export { descomponerProceso, quitarDescomposicionProceso } from "./refinamiento/descomposicion";
export type { DescomposicionProceso } from "./refinamiento/descomposicion";

export { desplegarObjeto, quitarDespliegueObjeto } from "./refinamiento/despliegue";
export type { DespliegueObjeto } from "./refinamiento/despliegue";

export {
  refrescarEnlacesExternosDerivados,
  redistribuirEnlacesExternosSiPrimerSubproceso,
} from "./refinamiento/proyeccion";

export {
  procesoDescompuestoEnOpd,
  quitarRefinamientoEntidad,
  subprocesosOrdenadosDeRefinamiento,
} from "./refinamiento/helpers";
