import {
  entidadIdDeExtremo,
  extremoApuntaAEntidad,
} from "../../extremos";
import type {
  Apariencia,
  Enlace,
  Entidad,
  Estado,
  Id,
  Modelo,
  Opd,
  Resultado,
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

export function quitarRefinamientoEntidad(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad?.refinamiento) return fallo("La entidad no tiene refinamiento");
  const removidos = idsSubarbolOpd(modelo, entidad.refinamiento.opdId);
  if (!removidos.has(entidad.refinamiento.opdId)) {
    return fallo(`OPD de refinamiento no existe: ${entidad.refinamiento.opdId}`);
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
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === procesoRefinadoId);
  if (!contorno) return [];
  return Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.entidadId !== procesoRefinadoId)
    .filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso")
    .filter((apariencia) => dentroDe(apariencia, contorno))
    .sort((a, b) => compararOrdenTemporal(a, b));
}

export function procesoDescompuestoEnOpd(modelo: Modelo, opd: Opd): { entidad: Entidad; apariencia: Apariencia } | null {
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad?.tipo === "proceso" && entidad.refinamiento?.tipo === "descomposicion" && entidad.refinamiento.opdId === opd.id) {
      return { entidad, apariencia };
    }
  }
  return null;
}

export function enlacesExternosDelProceso(
  modelo: Modelo,
  opdPadre: Opd,
  procesoId: Id,
): Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> {
  const aparienciasPadre = new Map(Object.values(opdPadre.apariencias).map((apariencia) => [apariencia.entidadId, apariencia]));
  const externos: Array<{ enlace: Enlace; externoId: Id; aparienciaPadre: Apariencia }> = [];
  for (const aparienciaEnlace of Object.values(opdPadre.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const externoExtremo = extremoApuntaAEntidad(enlace.origenId, procesoId)
      ? enlace.destinoId
      : extremoApuntaAEntidad(enlace.destinoId, procesoId)
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
  if (!entidad.refinamiento || !removidos.has(entidad.refinamiento.opdId)) return entidad;
  const { refinamiento: _refinamiento, ...sinRefinamiento } = entidad;
  return sinRefinamiento;
}
