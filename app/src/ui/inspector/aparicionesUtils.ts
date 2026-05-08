import type { Apariencia, Id, Modelo, TipoRefinamiento } from "../../modelo/tipos";

/**
 * L1 ronda 20 — Helpers puros para el tab Apariciones del Inspector.
 *
 * "Apariencia" = instancia gráfica de una entidad en un OPD (SSOT
 * opm-iso-19450-es.md §3.71a, IFML §10.2). Una entidad puede aparecer en
 * varios OPDs (raíz, descomposiciones, despliegues). El tab Apariciones
 * lista esas apariciones para que el usuario navegue cross-OPD sin perder
 * la selección semántica.
 */

export interface AparicionItem {
  readonly opdId: Id;
  readonly opdNombre: string;
  readonly aparienciaId: Id;
  /**
   * Tipo de refinamiento del OPD donde aparece la entidad: "descomposicion",
   * "despliegue" o `null` si es el OPD raíz / OPD sin refinamiento entrante.
   * Permite que el tab Apariciones diga "raíz" vs "in-zoom" vs "unfold".
   */
  readonly refinamientoTipo: TipoRefinamiento | null;
  /** True cuando el OPD coincide con el OPD activo del inspector. */
  readonly esActivo: boolean;
}

/**
 * Lista todas las apariciones de la entidad ordenadas por OPD (raíz primero,
 * luego por nombre). El orden es determinista para que los tests no dependan
 * de la iteración del Record.
 *
 * @param modelo  Snapshot del modelo OPM.
 * @param entidadId  Id de la entidad cuyas apariciones se buscan.
 * @param opdActivoId  OPD actualmente visible; las apariciones en ese OPD
 *  reciben `esActivo=true` para que la UI las muestre como ya seleccionadas.
 */
export function listarApariciones(modelo: Modelo, entidadId: Id, opdActivoId: Id): AparicionItem[] {
  const items: AparicionItem[] = [];
  for (const opd of Object.values(modelo.opds)) {
    let primeraApariencia: Apariencia | undefined;
    for (const apariencia of Object.values(opd.apariencias)) {
      if (apariencia.entidadId !== entidadId) continue;
      if (!primeraApariencia) primeraApariencia = apariencia;
    }
    if (!primeraApariencia) continue;
    items.push({
      opdId: opd.id,
      opdNombre: opd.nombre,
      aparienciaId: primeraApariencia.id,
      refinamientoTipo: tipoRefinamientoDeOpd(modelo, opd.id),
      esActivo: opd.id === opdActivoId,
    });
  }
  return items.sort(comparadorApariciones(modelo.opdRaizId));
}

/**
 * Cuenta cuántas apariencias totales tiene la entidad y en cuántos OPDs
 * distintos. Reemplazo unificado del helper local `coberturaApariencias`
 * que vivía en `InspectorEntidad.tsx`. Idempotente, sin side-effects.
 */
export function coberturaApariencias(modelo: Modelo, entidadId: Id): { totalApariencias: number; opdsConEntidad: number } {
  let totalApariencias = 0;
  let opdsConEntidad = 0;
  for (const opd of Object.values(modelo.opds)) {
    let aparicionesEnOpd = 0;
    for (const apariencia of Object.values(opd.apariencias)) {
      if (apariencia.entidadId === entidadId) aparicionesEnOpd += 1;
    }
    if (aparicionesEnOpd > 0) {
      totalApariencias += aparicionesEnOpd;
      opdsConEntidad += 1;
    }
  }
  return { totalApariencias, opdsConEntidad };
}

/**
 * Etiqueta humana corta del tipo de refinamiento del OPD donde aparece la
 * entidad. Se muestra en el tab Apariciones y en otros lugares que necesiten
 * una distinción visual rápida raíz / in-zoom / unfold.
 */
export function etiquetaRefinamiento(tipo: TipoRefinamiento | null): string {
  if (tipo === "descomposicion") return "in-zoom";
  if (tipo === "despliegue") return "unfold";
  return "raíz";
}

/**
 * Devuelve el tipo de refinamiento que tiene como destino el OPD dado, o
 * `null` si ninguna entidad lo refina (caso del OPD raíz o de OPDs huérfanos).
 *
 * Búsqueda lineal sobre `entidad.refinamientos`, suficiente para los modelos
 * típicos del corpus.
 */
function tipoRefinamientoDeOpd(modelo: Modelo, opdId: Id): TipoRefinamiento | null {
  for (const entidad of Object.values(modelo.entidades)) {
    const refs = entidad.refinamientos;
    if (!refs) continue;
    if (refs.descomposicion?.opdId === opdId) return "descomposicion";
    if (refs.despliegue?.opdId === opdId) return "despliegue";
  }
  return null;
}

function comparadorApariciones(opdRaizId: Id): (a: AparicionItem, b: AparicionItem) => number {
  return (a, b) => {
    if (a.opdId === opdRaizId && b.opdId !== opdRaizId) return -1;
    if (b.opdId === opdRaizId && a.opdId !== opdRaizId) return 1;
    const cmpNombre = a.opdNombre.localeCompare(b.opdNombre, "es", { sensitivity: "base" });
    if (cmpNombre !== 0) return cmpNombre;
    return a.opdId.localeCompare(b.opdId);
  };
}
