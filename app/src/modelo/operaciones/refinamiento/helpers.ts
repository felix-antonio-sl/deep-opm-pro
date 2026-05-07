import {
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
} from "../../extremos";
import {
  obtenerRefinamiento,
  quitarRefinamiento as quitarRefinamientoSlot,
  refinamientosDe,
  tieneRefinamiento,
} from "../../refinamientos";
import type {
  Apariencia,
  Enlace,
  Entidad,
  Estado,
  Id,
  Modelo,
  Opd,
  Resultado,
  TipoRefinamiento,
} from "../../tipos";
import { fallo, ok } from "../helpers";

/**
 * Helpers internos al subdirectorio refinamiento/.
 *
 * Algunos se re-exportan desde el barrel `refinamiento.ts` para preservar
 * el contrato público pre-ronda 9.5 (consumidores externos):
 *   - `quitarRefinamientoEntidad` (consumida por eliminacion.ts)
 *   - `subprocesosOrdenadosDeRefinamiento` (consumida por enlaces.ts)
 *   - `procesoDescompuestoEnOpd` (consumida por enlaces.ts/proyeccion.ts)
 *
 * El resto son privados al subdirectorio.
 */

export function quitarRefinamientoEntidad(modelo: Modelo, entidadId: Id, tipo?: TipoRefinamiento): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad || !tieneRefinamiento(entidad)) return fallo("La entidad no tiene refinamiento");
  // Si no se especifica tipo y hay solo uno, ese es el blanco; si hay dos, es ambiguo.
  const slots = refinamientosDe(entidad);
  const tipoBlanco = tipo ?? (slots.length === 1 ? slots[0]!.tipo : undefined);
  if (!tipoBlanco) return fallo("Refinamiento ambiguo: especificar tipo");
  const slot = obtenerRefinamiento(entidad, tipoBlanco);
  if (!slot) return fallo("La entidad no tiene refinamiento");
  const removidos = idsSubarbolOpd(modelo, slot.opdId);
  if (!removidos.has(slot.opdId)) {
    return fallo(`OPD de refinamiento no existe: ${slot.opdId}`);
  }

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).filter(([opdId]) => !removidos.has(opdId)),
  );
  const entidadesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId)),
  );
  const entidades = Object.fromEntries(
    Object.entries(modelo.entidades)
      .filter(([id]) => entidadesVisibles.has(id))
      .map(([id, item]) => [id, sinRefinamientoRemovido(item, removidos)]),
  ) as Record<Id, Entidad>;
  const estados = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => entidades[estado.entidadId]),
  ) as Record<Id, Estado>;
  const enlacesVisibles = new Set(
    Object.values(opds).flatMap((opd) => Object.values(opd.enlaces).map((apariencia) => apariencia.enlaceId)),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId, enlace]) => (
      enlacesVisibles.has(enlaceId) &&
      entidadIdDeExtremo({ ...modelo, entidades, estados }, enlace.origenId) !== null &&
      entidadIdDeExtremo({ ...modelo, entidades, estados }, enlace.destinoId) !== null
    )),
  ) as Record<Id, Enlace>;
  const opdsSinEnlacesHuerfanos = Object.fromEntries(
    Object.entries(opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => enlaces[apariencia.enlaceId]),
        ),
      },
    ]),
  );

  return ok({ ...modelo, entidades, estados, enlaces, opds: opdsSinEnlacesHuerfanos });
}

export function subprocesosOrdenadosDeRefinamiento(modelo: Modelo, opd: Opd, procesoRefinadoId: Id): Apariencia[] {
  return entidadesInternasOrdenadasDeRefinamiento(modelo, opd, procesoRefinadoId, "proceso");
}

export function entidadesInternasOrdenadasDeRefinamiento(modelo: Modelo, opd: Opd, entidadRefinadaId: Id, tipo?: Entidad["tipo"]): Apariencia[] {
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadRefinadaId);
  if (!contorno) return [];
  return Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.entidadId !== entidadRefinadaId)
    .filter((apariencia) => {
      const entidad = modelo.entidades[apariencia.entidadId];
      return entidad && (!tipo || entidad.tipo === tipo);
    })
    .filter((apariencia) => dentroDe(apariencia, contorno))
    .sort((a, b) => compararOrdenTemporal(a, b));
}

export function cosaDescompuestaEnOpd(modelo: Modelo, opd: Opd): { entidad: Entidad; apariencia: Apariencia } | null {
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id) {
      return { entidad, apariencia };
    }
  }
  return null;
}

/**
 * Agrupa subprocesos cuya altura superior difiere dentro de la tolerancia OPM
 * de in-zooming. La linea temporal fluye de arriba hacia abajo; alturas
 * equivalentes representan invocacion implicita paralela.
 *
 * Refs: opm-iso-19450-es.md:708, opm-opl-es.md:453-454.
 */
export function agruparSubprocesosParalelos(
  subprocesos: Apariencia[],
  toleranciaY = 4,
): Apariencia[][] {
  const ordenados = [...subprocesos].sort((a, b) => compararOrdenTemporal(a, b));
  const grupos: Apariencia[][] = [];

  for (const apariencia of ordenados) {
    const ultimo = grupos[grupos.length - 1];
    const referenciaY = ultimo?.[0]?.y;
    if (ultimo && referenciaY !== undefined && Math.abs(apariencia.y - referenciaY) <= toleranciaY) {
      ultimo.push(apariencia);
      ultimo.sort((a, b) => a.x - b.x || a.id.localeCompare(b.id));
      continue;
    }
    grupos.push([apariencia]);
  }

  return grupos;
}

export function procesoDescompuestoEnOpd(modelo: Modelo, opd: Opd): { entidad: Entidad; apariencia: Apariencia } | null {
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad?.tipo === "proceso" && obtenerRefinamiento(entidad, "descomposicion")?.opdId === opd.id) {
      return { entidad, apariencia };
    }
  }
  return null;
}

export function enlacesExternosDeEntidad(
  modelo: Modelo,
  opdPadre: Opd,
  entidadId: Id,
): Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> {
  const aparienciasPadre = new Map(Object.values(opdPadre.apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const externos: Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> = [];
  for (const aparienciaEnlace of Object.values(opdPadre.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const externoExtremo = extremoApuntaAEntidad(enlace.origenId, entidadId)
      ? enlace.destinoId
      : extremoApuntaAEntidad(enlace.destinoId, entidadId)
        ? enlace.origenId
        : null;
    const externoId = externoExtremo ? entidadIdDeExtremo(modelo, externoExtremo) : null;
    if (!externoId) continue;
    const aparienciaPadre = aparienciasPadre.get(externoId);
    if (!aparienciaPadre) continue;
    externos.push({ enlace, externoId, aparienciaPadre });
  }
  return externos;
}

export function enlacesExternosDelProceso(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
): Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> {
  return enlacesExternosDeEntidad(modelo, opdPadre, procesoId);
}

export function siguienteNombreOpdHijo(modelo: Modelo, opdPadreId: Id): string {
  const opdPadre = modelo.opds[opdPadreId];
  const codigoPadre = codigoOpd(opdPadre?.nombre ?? "SD");
  const usados = new Set(
    Object.values(modelo.opds)
      .filter((opd) => opd.padreId === opdPadreId)
      .map((opd) => codigoOpd(opd.nombre)),
  );

  for (let index = 1; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const candidato = codigoPadre === "SD" ? `SD${index}` : `${codigoPadre}.${index}`;
    if (!usados.has(candidato)) return candidato;
  }
  return codigoPadre === "SD" ? "SD1" : `${codigoPadre}.1`;
}

export function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

export function compararOrdenTemporal(a: Apariencia, b: Apariencia): number {
  return a.y - b.y || a.x - b.x || a.id.localeCompare(b.id);
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function idsSubarbolOpd(modelo: Modelo, raizId: Id): Set<Id> {
  const removidos = new Set<Id>();
  const pendientes = [raizId];
  while (pendientes.length > 0) {
    const actual = pendientes.pop();
    if (!actual || removidos.has(actual) || !modelo.opds[actual]) continue;
    removidos.add(actual);
    for (const opd of Object.values(modelo.opds)) {
      if (opd.padreId === actual) pendientes.push(opd.id);
    }
  }
  return removidos;
}

function sinRefinamientoRemovido(entidad: Entidad, removidos: Set<Id>): Entidad {
  if (!entidad.refinamientos) return entidad;
  let resultado = entidad;
  for (const tipo of ["descomposicion", "despliegue"] as const) {
    const slot = resultado.refinamientos?.[tipo];
    if (slot && removidos.has(slot.opdId)) {
      resultado = quitarRefinamientoSlot(resultado, tipo);
    }
  }
  return resultado;
}
