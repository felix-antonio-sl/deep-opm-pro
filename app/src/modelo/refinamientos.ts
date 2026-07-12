import type { Entidad, SlotRefinamiento, TipoRefinamiento } from "./tipos";

/**
 * Helpers para el producto parcial `Entidad.refinamientos` (ronda 15.2).
 *
 * Una entidad puede tener descomposicion (in-zoom) y despliegue (unfold)
 * simultáneos: son ortogonales (Comportamiento vs Estructura, SSOT
 * `urn:fxsl:kb:opm-es` §refinamiento). Estos helpers encapsulan la lectura
 * y escritura del slot indexado por tipo, manteniendo inmutabilidad de la
 * entidad y preservando el slot complementario al fijar/quitar.
 *
 * Ref: urn:fxsl:kb:opm-es §refinamiento.
 */

export function obtenerRefinamiento(entidad: Entidad, tipo: TipoRefinamiento): SlotRefinamiento | undefined {
  return entidad.refinamientos?.[tipo];
}

export function tieneRefinamiento(entidad: Entidad, tipo?: TipoRefinamiento): boolean {
  if (!entidad.refinamientos) return false;
  if (tipo) return entidad.refinamientos[tipo] !== undefined;
  return Object.keys(entidad.refinamientos).length > 0;
}

export function refinamientosDe(entidad: Entidad): Array<{ tipo: TipoRefinamiento } & SlotRefinamiento> {
  if (!entidad.refinamientos) return [];
  const lista: Array<{ tipo: TipoRefinamiento } & SlotRefinamiento> = [];
  for (const tipo of ["descomposicion", "despliegue"] as const) {
    const slot = entidad.refinamientos[tipo];
    if (slot) lista.push({ tipo, ...slot });
  }
  return lista;
}

export function fijarRefinamiento(entidad: Entidad, tipo: TipoRefinamiento, slot: SlotRefinamiento): Entidad {
  return {
    ...entidad,
    refinamientos: {
      ...(entidad.refinamientos ?? {}),
      [tipo]: slot,
    },
  };
}

export function quitarRefinamiento(entidad: Entidad, tipo: TipoRefinamiento): Entidad {
  if (!entidad.refinamientos || entidad.refinamientos[tipo] === undefined) return entidad;
  const restante: Partial<Record<TipoRefinamiento, SlotRefinamiento>> = {};
  for (const otroTipo of ["descomposicion", "despliegue"] as const) {
    if (otroTipo === tipo) continue;
    const slot = entidad.refinamientos[otroTipo];
    if (slot) restante[otroTipo] = slot;
  }
  if (Object.keys(restante).length === 0) {
    const { refinamientos: _omitido, ...resto } = entidad;
    return resto;
  }
  return { ...entidad, refinamientos: restante };
}

/**
 * Devuelve el opdId del refinamiento del tipo dado, si existe. Atajo común
 * en consumidores que solo necesitan el destino del slot.
 */
export function opdIdDeRefinamiento(entidad: Entidad, tipo: TipoRefinamiento): string | undefined {
  return entidad.refinamientos?.[tipo]?.opdId;
}

/**
 * Devuelve true si la entidad tiene un refinamiento (cualquier tipo) cuyo
 * destino sea el opdId dado. Sustituye al patrón legacy
 * `entidad.refinamiento?.opdId === opdId`.
 */
export function refinaA(entidad: Entidad, opdId: string): { tipo: TipoRefinamiento; slot: SlotRefinamiento } | null {
  if (!entidad.refinamientos) return null;
  for (const tipo of ["descomposicion", "despliegue"] as const) {
    const slot = entidad.refinamientos[tipo];
    if (slot?.opdId === opdId) return { tipo, slot };
  }
  return null;
}
