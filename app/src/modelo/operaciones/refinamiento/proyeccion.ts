import {
  entidadDeExtremo,
  extremoApuntaAEntidad,
  extremoEntidad,
  mismoExtremo,
} from "../../extremos";
import type {
  AparienciaEnlace,
  Enlace,
  ExtremoEnlace,
  Id,
  Modelo,
  Resultado,
  TipoEnlace,
} from "../../tipos";
import { entidadVisibleEnOpd, ok, siguienteId, validarFirmaEnlace } from "../helpers";
import {
  cosaDescompuestaEnOpd,
  enlacesExternosDeEntidad,
  enlacesExternosDelProceso,
  procesoDescompuestoEnOpd,
  subprocesosOrdenadosDeRefinamiento,
} from "./helpers";

/**
 * Proyección de enlaces externos del padre sobre el OPD hijo:
 * - `proyectarEnlacesExternosEnRefinamiento` (helper interno usado por descomposicion).
 * - `refrescarEnlacesExternosDerivados` (re-exportado vía barrel; consumido por
 *   apariencias.ts/enlaces.ts tras mover/reanclar).
 * - `redistribuirEnlacesExternosSiPrimerSubproceso` (re-exportado vía barrel;
 *   consumido por creacion.ts cuando se agrega el primer subproceso).
 *
 * Refs: HU-12.* enlaces derivados de refinamiento.
 */

export function refrescarEnlacesExternosDerivados(modelo: Modelo, opdId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const subprocesos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  const primero = subprocesos[0];
  const ultimo = subprocesos[subprocesos.length - 1];
  if (!primero || !ultimo) return ok(modelo);

  const limpio = limpiarEnlacesDerivadosAutomaticos(modelo, opdId, contorno.entidad.id);
  return proyectarEnlacesExternosEnRefinamiento(limpio, opdId, {
    primeroId: primero.entidadId,
    ultimoId: ultimo.entidadId,
    todosIds: subprocesos.map((apariencia) => apariencia.entidadId),
  });
}

export function redistribuirEnlacesExternosSiPrimerSubproceso(modelo: Modelo, opdId: Id, subprocesoId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = procesoDescompuestoEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const procesosInternos = subprocesosOrdenadosDeRefinamiento(modelo, opd, contorno.entidad.id);
  if (procesosInternos.length !== 1 || procesosInternos[0]?.entidadId !== subprocesoId) return ok(modelo);

  return proyectarEnlacesExternosEnRefinamiento(modelo, opdId, {
    primeroId: subprocesoId,
    ultimoId: subprocesoId,
  });
}

export function proyectarEnlacesExternosEnRefinamiento(
  modelo: Modelo,
  opdId: Id,
  subprocesos: { primeroId: Id; ultimoId: Id; todosIds?: Id[] },
): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return ok(modelo);
  const contorno = cosaDescompuestaEnOpd(modelo, opd);
  if (!contorno) return ok(modelo);
  const padre = modelo.opds[opd.padreId];
  if (!padre) return ok(modelo);
  const externos = enlacesExternosDeEntidad(modelo, padre, contorno.entidad.id)
    .filter(({ externoId }) => entidadVisibleEnOpd(opd, externoId));
  if (externos.length === 0) return ok(modelo);
  let nextSeq = modelo.nextSeq;
  const enlaces = { ...modelo.enlaces };
  const aparienciasEnlace: Record<Id, AparienciaEnlace> = { ...opd.enlaces };

  for (const { enlace } of externos) {
    if (enlaceDerivadoManualExisteParaPadre(enlaces, aparienciasEnlace, enlace.id, contorno.entidad.id)) {
      continue;
    }
    const proyecciones = contorno.entidad.tipo === "proceso"
      ? proyeccionesEnlaceExterno(enlace, contorno.entidad.id, subprocesos)
      : [];
    if (proyecciones.length === 0) {
      if (!aparienciaEnlaceExiste(aparienciasEnlace, enlace.id)) {
        const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
        nextSeq += 1;
        aparienciasEnlace[aparienciaId] = { id: aparienciaId, enlaceId: enlace.id, opdId, vertices: [] };
      }
    } else {
      for (const proyeccion of proyecciones) {
        const origen = entidadDeExtremo(modelo, proyeccion.origenId);
        const destino = entidadDeExtremo(modelo, proyeccion.destinoId);
        if (!origen || !destino) continue;
        const firma = validarFirmaEnlace(enlace.tipo, origen, destino, {
          origen: proyeccion.origenId,
          destino: proyeccion.destinoId,
        });
        if (!firma.ok) continue;
        if (enlaceDerivadoExiste(enlaces, aparienciasEnlace, enlace.tipo, proyeccion.origenId, proyeccion.destinoId)) {
          continue;
        }
        const enlaceId = siguienteId({ ...modelo, nextSeq }, "e");
        nextSeq += 1;
        const aparienciaId = siguienteId({ ...modelo, nextSeq }, "ae");
        nextSeq += 1;
        enlaces[enlaceId] = {
          id: enlaceId,
          tipo: enlace.tipo,
          origenId: proyeccion.origenId,
          destinoId: proyeccion.destinoId,
          etiqueta: enlace.etiqueta,
          derivado: {
            tipo: "enlace-externo-refinamiento",
            refinamientoId: contorno.entidad.id,
            enlacePadreId: enlace.id,
            origen: "automatico",
          },
        };
        aparienciasEnlace[aparienciaId] = {
          id: aparienciaId,
          enlaceId,
          opdId,
          vertices: [],
        };
      }
    }
  }

  if (nextSeq === modelo.nextSeq) return ok(modelo);
  return ok({
    ...modelo,
    nextSeq,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: aparienciasEnlace,
      },
    },
  });
}

function proyeccionesEnlaceExterno(
  enlace: Enlace,
  procesoRefinadoId: Id,
  subprocesos: { primeroId: Id; ultimoId: Id; todosIds?: Id[] },
): Array<{ origenId: ExtremoEnlace; destinoId: ExtremoEnlace }> {
  const todos = subprocesos.todosIds?.length ? subprocesos.todosIds : [subprocesos.primeroId, subprocesos.ultimoId];
  if (enlace.tipo === "consumo" && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return [{ origenId: enlace.origenId, destinoId: extremoEntidad(subprocesos.primeroId) }];
  }
  if (
    (enlace.tipo === "resultado" || enlace.tipo === "invocacion") &&
    extremoApuntaAEntidad(enlace.origenId, procesoRefinadoId)
  ) {
    return [{ origenId: extremoEntidad(subprocesos.ultimoId), destinoId: enlace.destinoId }];
  }
  if ((enlace.tipo === "agente" || enlace.tipo === "instrumento") && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return todos.map((subprocesoId) => ({ origenId: enlace.origenId, destinoId: extremoEntidad(subprocesoId) }));
  }
  if (enlace.tipo === "efecto" && extremoApuntaAEntidad(enlace.destinoId, procesoRefinadoId)) {
    return todos.map((subprocesoId) => ({ origenId: enlace.origenId, destinoId: extremoEntidad(subprocesoId) }));
  }
  if (enlace.tipo === "efecto" && extremoApuntaAEntidad(enlace.origenId, procesoRefinadoId)) {
    return todos.map((subprocesoId) => ({ origenId: extremoEntidad(subprocesoId), destinoId: enlace.destinoId }));
  }
  return [];
}

function aparienciaEnlaceExiste(apariencias: Record<Id, AparienciaEnlace>, enlaceId: Id): boolean {
  return Object.values(apariencias).some((apariencia) => apariencia.enlaceId === enlaceId);
}

function enlaceDerivadoExiste(
  enlaces: Record<Id, Enlace>,
  apariencias: Record<Id, AparienciaEnlace>,
  tipo: TipoEnlace,
  origenId: ExtremoEnlace,
  destinoId: ExtremoEnlace,
): boolean {
  return Object.values(enlaces).some((existente) => (
    existente.tipo === tipo &&
    mismoExtremo(existente.origenId, origenId) &&
    mismoExtremo(existente.destinoId, destinoId) &&
    aparienciaEnlaceExiste(apariencias, existente.id)
  ));
}

function enlaceDerivadoManualExisteParaPadre(
  enlaces: Record<Id, Enlace>,
  apariencias: Record<Id, AparienciaEnlace>,
  enlacePadreId: Id,
  refinamientoId: Id,
): boolean {
  return Object.values(enlaces).some((existente) => (
    existente.derivado?.tipo === "enlace-externo-refinamiento" &&
    existente.derivado.refinamientoId === refinamientoId &&
    existente.derivado.enlacePadreId === enlacePadreId &&
    existente.derivado.origen === "manual" &&
    aparienciaEnlaceExiste(apariencias, existente.id)
  ));
}

function limpiarEnlacesDerivadosAutomaticos(modelo: Modelo, opdId: Id, procesoRefinadoId: Id): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd?.padreId) return modelo;
  const candidatos = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => enlace.derivado?.tipo === "enlace-externo-refinamiento")
      .filter((enlace) => enlace.derivado?.refinamientoId === procesoRefinadoId)
      .filter((enlace) => enlace.derivado?.origen !== "manual")
      .map((enlace) => enlace.id),
  );
  if (candidatos.size === 0) return modelo;

  const enlacesOpd = Object.fromEntries(
    Object.entries(opd.enlaces).filter(([, apariencia]) => !candidatos.has(apariencia.enlaceId)),
  );
  const idsAunVisibles = new Set(
    Object.values(modelo.opds)
      .flatMap((item) => Object.values(item.id === opdId ? enlacesOpd : item.enlaces))
      .map((apariencia) => apariencia.enlaceId),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([enlaceId]) => !candidatos.has(enlaceId) || idsAunVisibles.has(enlaceId)),
  );

  return {
    ...modelo,
    enlaces,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        enlaces: enlacesOpd,
      },
    },
  };
}
