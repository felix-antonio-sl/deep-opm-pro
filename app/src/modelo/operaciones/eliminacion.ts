import { naturalezaDeEnlace } from "../constantes";
import { sincronizarAbanicos } from "../abanicos";
import { entidadDeExtremo, entidadIdDeExtremo, extremoEntidad, extremoEstado } from "../extremos";
import { refinamientosDe, tieneRefinamiento } from "../refinamientos";
import type {
  Enlace,
  Entidad,
  Estado,
  Id,
  Modelo,
  Opd,
  Resultado,
} from "../tipos";
import { entidadVisibleEnOpd, fallo, ok, siguienteId } from "./helpers";
import { quitarRefinamientoEntidad, sincronizarRepresentacionesHijasDeOpd } from "./refinamiento";

/**
 * Operaciones de eliminación: eliminar entidad (cascada de enlaces + estados +
 * apariencias), eliminar enlace (con derivados), splitEffectEnPar (HU-12.011
 * fase 2), entidadesDelOpd (read-only).
 *
 * También expone `eliminarEnlacesPorExtremosEstado` como helper interno al
 * subdirectorio para que `estados.ts` lo consuma al eliminar estados.
 *
 * Refs: SSOT opm-iso-19450-es.md §3.* (cascading delete).
 */

export function eliminarEntidad(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (tieneRefinamiento(entidad)) {
    let modeloLimpio: Modelo = modelo;
    for (const ref of refinamientosDe(entidad)) {
      const paso = quitarRefinamientoEntidad(modeloLimpio, entidadId, ref.tipo);
      if (!paso.ok) return paso;
      modeloLimpio = paso.value;
      // El subárbol pudo haber removido la entidad si solo aparecía en el OPD
      // hijo eliminado; en ese caso no queda nada que eliminar.
      if (!modeloLimpio.entidades[entidadId]) return ok(modeloLimpio);
    }
    return eliminarEntidad(modeloLimpio, entidadId);
  }

  const entidades = { ...modelo.entidades };
  delete entidades[entidadId];
  const estados = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => estado.entidadId !== entidadId),
  ) as Record<Id, Estado>;

  const enlacesEliminados = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => (
        entidadIdDeExtremo(modelo, enlace.origenId) === entidadId ||
        entidadIdDeExtremo(modelo, enlace.destinoId) === entidadId
      ))
      .map((enlace) => enlace.id),
  );
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([id]) => !enlacesEliminados.has(id)),
  );

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        apariencias: Object.fromEntries(
          Object.entries(opd.apariencias).filter(([, apariencia]) => apariencia.entidadId !== entidadId),
        ),
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => !enlacesEliminados.has(apariencia.enlaceId)),
        ),
      },
    ]),
  );

  return ok(limpiarMetadatosHuerfanos({ ...modelo, entidades, estados, enlaces, opds }));
}

export function eliminarEnlace(modelo: Modelo, enlaceId: Id): Resultado<Modelo> {
  const enlaceOriginal = modelo.enlaces[enlaceId];
  if (!enlaceOriginal) return fallo(`Enlace no existe: ${enlaceId}`);
  const opdsPadreAfectados = Object.values(modelo.opds)
    .filter((opd) => Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId))
    .map((opd) => opd.id);
  const entidadIdsAfectadas = [
    entidadIdDeExtremo(modelo, enlaceOriginal.origenId),
    entidadIdDeExtremo(modelo, enlaceOriginal.destinoId),
  ].filter((id): id is Id => !!id);
  const enlacesEliminados = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => enlace.id === enlaceId || enlace.derivado?.enlacePadreId === enlaceId)
      .map((enlace) => enlace.id),
  );
  const enlaces = { ...modelo.enlaces };
  for (const id of enlacesEliminados) delete enlaces[id];

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => !enlacesEliminados.has(apariencia.enlaceId)),
        ),
      },
    ]),
  );

  let actualizado: Modelo = { ...modelo, enlaces, opds };
  for (const opdPadreId of opdsPadreAfectados) {
    const sincronizado = sincronizarRepresentacionesHijasDeOpd(actualizado, opdPadreId, entidadIdsAfectadas);
    if (!sincronizado.ok) return sincronizado;
    actualizado = sincronizado.value;
  }

  return ok(limpiarMetadatosHuerfanos(actualizado));
}

/**
 * Helper interno al subdirectorio: lo consume `estados.ts` (eliminarEstado y
 * quitarEstadosObjeto). NO se re-exporta desde el barrel `operaciones.ts`.
 */
export function eliminarEnlacesPorExtremosEstado(modelo: Modelo, estadoIds: Set<Id>): Modelo {
  if (estadoIds.size === 0) return modelo;
  const enlacesEliminados = new Set(
    Object.values(modelo.enlaces)
      .filter((enlace) => (
        (enlace.origenId.kind === "estado" && estadoIds.has(enlace.origenId.id)) ||
        (enlace.destinoId.kind === "estado" && estadoIds.has(enlace.destinoId.id))
      ))
      .map((enlace) => enlace.id),
  );
  if (enlacesEliminados.size === 0) return modelo;
  const enlaces = Object.fromEntries(
    Object.entries(modelo.enlaces).filter(([id]) => !enlacesEliminados.has(id)),
  ) as Record<Id, Enlace>;
  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([opdId, opd]) => [
      opdId,
      {
        ...opd,
        enlaces: Object.fromEntries(
          Object.entries(opd.enlaces).filter(([, apariencia]) => !enlacesEliminados.has(apariencia.enlaceId)),
        ),
      },
    ]),
  );
  return limpiarMetadatosHuerfanos({ ...modelo, enlaces, opds });
}

function limpiarMetadatosHuerfanos(modelo: Modelo): Modelo {
  return limpiarOrderedFundamentalTypesHuerfanos(sincronizarAbanicos(modelo));
}

function limpiarOrderedFundamentalTypesHuerfanos(modelo: Modelo): Modelo {
  let entidades: Record<Id, Entidad> | undefined;
  for (const entidad of Object.values(modelo.entidades)) {
    const actuales = entidad.orderedFundamentalTypes;
    if (!actuales?.length) continue;
    const vigentes = actuales.filter((tipo) => existeEnlaceEstructuralDeTipoParaEntidad(modelo, entidad.id, tipo));
    if (vigentes.length === actuales.length) continue;
    const actualizada = { ...entidad };
    if (vigentes.length > 0) actualizada.orderedFundamentalTypes = vigentes;
    else delete actualizada.orderedFundamentalTypes;
    entidades = entidades ?? { ...modelo.entidades };
    entidades[entidad.id] = actualizada;
  }
  return entidades ? { ...modelo, entidades } : modelo;
}

function existeEnlaceEstructuralDeTipoParaEntidad(modelo: Modelo, entidadId: Id, tipo: Enlace["tipo"]): boolean {
  return Object.values(modelo.enlaces).some((enlace) => (
    enlace.tipo === tipo &&
    naturalezaDeEnlace(enlace.tipo) === "estructural" &&
    (
      entidadIdDeExtremo(modelo, enlace.origenId) === entidadId ||
      entidadIdDeExtremo(modelo, enlace.destinoId) === entidadId
    )
  ));
}

// Convierte un efecto TS3 (Proceso -> Objeto con estadoEntradaId/estadoSalidaId)
// en el par escindido canonico TS4/TS5: estado -> proceso y proceso -> estado.
export function splitEffectEnPar(modelo: Modelo, opdId: Id, enlaceId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (!aparienciaEnlaceExiste(opd.enlaces, enlaceId)) {
    return fallo("El split requiere que el enlace tenga apariencia en el OPD activo");
  }
  if (enlace.tipo !== "efecto") return fallo("El split requiere un enlace de efecto");

  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return fallo("El enlace de efecto tiene extremos inválidos");

  if (origen.tipo !== "proceso" || destino.tipo !== "objeto" || enlace.origenId.kind !== "entidad" || enlace.destinoId.kind !== "entidad") {
    return fallo("El split canónico requiere un efecto TS3 Proceso -> Objeto con estado de entrada y salida");
  }
  const estadoEntrada = enlace.estadoEntradaId ? modelo.estados[enlace.estadoEntradaId] : undefined;
  const estadoSalida = enlace.estadoSalidaId ? modelo.estados[enlace.estadoSalidaId] : undefined;
  if (!estadoEntrada || !estadoSalida) {
    return fallo("El split requiere estado de entrada y estado de salida en el enlace de efecto");
  }
  if (estadoEntrada.entidadId !== destino.id || estadoSalida.entidadId !== destino.id) {
    return fallo("Los estados de entrada y salida del efecto deben pertenecer al objeto afectado");
  }
  if (!entidadVisibleEnOpd(opd, destino.id) || !entidadVisibleEnOpd(opd, origen.id)) {
    return fallo("El split requiere que objeto y proceso tengan apariencia en el OPD activo");
  }

  let nextSeq = modelo.nextSeq;
  const grupoId = siguienteId({ ...modelo, nextSeq }, "efe");
  nextSeq += 1;
  const entradaId = siguienteId({ ...modelo, nextSeq }, "e");
  nextSeq += 1;
  const aparienciaEntradaId = siguienteId({ ...modelo, nextSeq }, "ae");
  nextSeq += 1;
  const salidaId = siguienteId({ ...modelo, nextSeq }, "e");
  nextSeq += 1;
  const aparienciaSalidaId = siguienteId({ ...modelo, nextSeq }, "ae");
  nextSeq += 1;

  const entrada: Enlace = {
    id: entradaId,
    tipo: "efecto",
    origenId: extremoEstado(estadoEntrada.id),
    destinoId: extremoEntidad(origen.id),
    etiqueta: "",
    efectoEscindido: { grupoId, enlacePadreId: enlaceId, rol: "entrada" },
  };
  const salida: Enlace = {
    id: salidaId,
    tipo: "efecto",
    origenId: extremoEntidad(origen.id),
    destinoId: extremoEstado(estadoSalida.id),
    etiqueta: "",
    efectoEscindido: { grupoId, enlacePadreId: enlaceId, rol: "salida" },
  };

  const enlaces = { ...modelo.enlaces };
  delete enlaces[enlaceId];
  enlaces[entradaId] = entrada;
  enlaces[salidaId] = salida;

  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([actualOpdId, actual]) => [
      actualOpdId,
      {
        ...actual,
        enlaces: Object.fromEntries(
          Object.entries(actual.enlaces).filter(([, apariencia]) => apariencia.enlaceId !== enlaceId),
        ),
      },
    ]),
  );
  const opdActualizado = opds[opdId];
  if (!opdActualizado) return fallo(`OPD no existe: ${opdId}`);

  return ok({
    ...modelo,
    nextSeq,
    enlaces,
    opds: {
      ...opds,
      [opdId]: {
        ...opdActualizado,
        apariencias: opdActualizado.apariencias,
        enlaces: {
          ...opdActualizado.enlaces,
          [aparienciaEntradaId]: { id: aparienciaEntradaId, enlaceId: entradaId, opdId, vertices: [] },
          [aparienciaSalidaId]: { id: aparienciaSalidaId, enlaceId: salidaId, opdId, vertices: [] },
        },
      },
    },
  });
}

export function splitEffectParcial(modelo: Modelo, opdId: Id, enlaceId: Id): Resultado<Modelo> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (!aparienciaEnlaceExiste(opd.enlaces, enlaceId)) {
    return fallo("El split parcial requiere que el enlace tenga apariencia en el OPD activo");
  }
  if (enlace.tipo !== "efecto") return fallo("El split parcial requiere un enlace de efecto");

  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return fallo("El enlace de efecto tiene extremos inválidos");
  if (origen.tipo !== "proceso" || destino.tipo !== "objeto" || enlace.origenId.kind !== "entidad" || enlace.destinoId.kind !== "entidad") {
    return fallo("El split parcial requiere un efecto TS3 Proceso -> Objeto");
  }
  const estadoEntrada = enlace.estadoEntradaId ? modelo.estados[enlace.estadoEntradaId] : undefined;
  const estadoSalida = enlace.estadoSalidaId ? modelo.estados[enlace.estadoSalidaId] : undefined;
  if (!!estadoEntrada === !!estadoSalida) {
    return fallo("El split parcial requiere exactamente un estado de entrada o de salida");
  }
  const estado = estadoEntrada ?? estadoSalida;
  if (!estado || estado.entidadId !== destino.id) {
    return fallo("El estado parcial del efecto debe pertenecer al objeto afectado");
  }
  if (!entidadVisibleEnOpd(opd, destino.id) || !entidadVisibleEnOpd(opd, origen.id)) {
    return fallo("El split parcial requiere que objeto y proceso tengan apariencia en el OPD activo");
  }

  let nextSeq = modelo.nextSeq;
  const grupoId = siguienteId({ ...modelo, nextSeq }, "efe");
  nextSeq += 1;
  const parcialId = siguienteId({ ...modelo, nextSeq }, "e");
  nextSeq += 1;
  const aparienciaParcialId = siguienteId({ ...modelo, nextSeq }, "ae");
  nextSeq += 1;
  const rol = estadoEntrada ? "entrada" : "salida";
  const parcial: Enlace = {
    id: parcialId,
    tipo: "efecto",
    origenId: estadoEntrada ? extremoEstado(estado.id) : extremoEntidad(origen.id),
    destinoId: estadoEntrada ? extremoEntidad(origen.id) : extremoEstado(estado.id),
    etiqueta: "",
    efectoEscindido: { grupoId, enlacePadreId: enlaceId, rol, modo: "standalone" },
  };

  const enlaces = { ...modelo.enlaces };
  delete enlaces[enlaceId];
  enlaces[parcialId] = parcial;
  const opds = Object.fromEntries(
    Object.entries(modelo.opds).map(([actualOpdId, actual]) => [
      actualOpdId,
      {
        ...actual,
        enlaces: Object.fromEntries(
          Object.entries(actual.enlaces).filter(([, apariencia]) => apariencia.enlaceId !== enlaceId),
        ),
      },
    ]),
  );
  const opdActualizado = opds[opdId];
  if (!opdActualizado) return fallo(`OPD no existe: ${opdId}`);

  return ok({
    ...modelo,
    nextSeq,
    enlaces,
    opds: {
      ...opds,
      [opdId]: {
        ...opdActualizado,
        enlaces: {
          ...opdActualizado.enlaces,
          [aparienciaParcialId]: { id: aparienciaParcialId, enlaceId: parcialId, opdId, vertices: [] },
        },
      },
    },
  });
}

export function entidadesDelOpd(modelo: Modelo, opdId: Id): Entidad[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return Object.values(opd.apariencias)
    .map((apariencia) => modelo.entidades[apariencia.entidadId])
    .filter((entidad): entidad is Entidad => entidad !== undefined);
}

function aparienciaEnlaceExiste(apariencias: Record<Id, { enlaceId: Id }>, enlaceId: Id): boolean {
  return Object.values(apariencias).some((apariencia) => apariencia.enlaceId === enlaceId);
}
