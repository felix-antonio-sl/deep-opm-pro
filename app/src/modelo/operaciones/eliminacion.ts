import { CANON } from "../constantes";
import { entidadDeExtremo, entidadIdDeExtremo, extremoEntidad } from "../extremos";
import { contenedorRefinamiento, posicionLibre, solapa } from "../layout";
import { refinamientosDe, tieneRefinamiento } from "../refinamientos";
import type {
  Apariencia,
  Enlace,
  Entidad,
  Estado,
  Id,
  Modelo,
  Opd,
  Posicion,
  Resultado,
} from "../tipos";
import { entidadVisibleEnOpd, fallo, ok, siguienteId } from "./helpers";
import { quitarRefinamientoEntidad } from "./refinamiento";

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

  return ok({ ...modelo, entidades, estados, enlaces, opds });
}

export function eliminarEnlace(modelo: Modelo, enlaceId: Id): Resultado<Modelo> {
  if (!modelo.enlaces[enlaceId]) return fallo(`Enlace no existe: ${enlaceId}`);
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

  return ok({ ...modelo, enlaces, opds });
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
  return { ...modelo, enlaces, opds };
}

// L2 ronda 2: convierte un enlace `efecto` en un par consumo + resultado con
// un objeto intermedio sintetico ("<origen> modificado"). Operacion atomica
// reversible via undo (HU-12.011 fase 2). El effect original se elimina; el
// nombre del intermedio se serializa con sufijo numerico ante colision.
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

  const extremos = extremosEffect(origen, destino);
  if (!extremos.ok) return extremos;
  if (!entidadVisibleEnOpd(opd, extremos.value.objeto.id) || !entidadVisibleEnOpd(opd, extremos.value.proceso.id)) {
    return fallo("El split requiere que objeto y proceso tengan apariencia en el OPD activo");
  }

  let nextSeq = modelo.nextSeq;
  const intermedioId = siguienteId({ ...modelo, nextSeq }, "o");
  nextSeq += 1;
  const aparienciaIntermediaId = siguienteId({ ...modelo, nextSeq }, "a");
  nextSeq += 1;
  const consumoId = siguienteId({ ...modelo, nextSeq }, "e");
  nextSeq += 1;
  const aparienciaConsumoId = siguienteId({ ...modelo, nextSeq }, "ae");
  nextSeq += 1;
  const resultadoId = siguienteId({ ...modelo, nextSeq }, "e");
  nextSeq += 1;
  const aparienciaResultadoId = siguienteId({ ...modelo, nextSeq }, "ae");
  nextSeq += 1;

  const intermedio: Entidad = {
    id: intermedioId,
    tipo: "objeto",
    nombre: nombreIntermedioUnico(modelo, `${extremos.value.objeto.nombre} modificado`),
    esencia: extremos.value.objeto.esencia,
    afiliacion: extremos.value.objeto.afiliacion,
  };
  const posicion = posicionIntermedioSplit(modelo, opdId, extremos.value.proceso.id);
  const aparienciaIntermedia: Apariencia = {
    id: aparienciaIntermediaId,
    entidadId: intermedioId,
    opdId,
    x: posicion.x,
    y: posicion.y,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };
  const consumo: Enlace = {
    id: consumoId,
    tipo: "consumo",
    origenId: extremos.value.objeto.id === origen.id ? enlace.origenId : enlace.destinoId,
    destinoId: extremoEntidad(extremos.value.proceso.id),
    etiqueta: "",
  };
  const resultado: Enlace = {
    id: resultadoId,
    tipo: "resultado",
    origenId: extremoEntidad(extremos.value.proceso.id),
    destinoId: extremoEntidad(intermedioId),
    etiqueta: "",
  };

  const enlaces = { ...modelo.enlaces };
  delete enlaces[enlaceId];
  enlaces[consumoId] = consumo;
  enlaces[resultadoId] = resultado;

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
    entidades: {
      ...modelo.entidades,
      [intermedioId]: intermedio,
    },
    enlaces,
    opds: {
      ...opds,
      [opdId]: {
        ...opdActualizado,
        apariencias: {
          ...opdActualizado.apariencias,
          [aparienciaIntermediaId]: aparienciaIntermedia,
        },
        enlaces: {
          ...opdActualizado.enlaces,
          [aparienciaConsumoId]: { id: aparienciaConsumoId, enlaceId: consumoId, opdId, vertices: [] },
          [aparienciaResultadoId]: { id: aparienciaResultadoId, enlaceId: resultadoId, opdId, vertices: [] },
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

function extremosEffect(origen: Entidad, destino: Entidad): Resultado<{ objeto: Entidad; proceso: Entidad }> {
  if (origen.tipo === "objeto" && destino.tipo === "proceso") return ok({ objeto: origen, proceso: destino });
  if (origen.tipo === "proceso" && destino.tipo === "objeto") return ok({ objeto: destino, proceso: origen });
  return fallo("Efecto requiere Objeto <-> Proceso");
}

function nombreIntermedioUnico(modelo: Modelo, base: string): string {
  const existentes = new Set(Object.values(modelo.entidades).map((entidad) => entidad.nombre));
  if (!existentes.has(base)) return base;
  for (let index = 2; index < Number.MAX_SAFE_INTEGER; index += 1) {
    const candidato = `${base} ${index}`;
    if (!existentes.has(candidato)) return candidato;
  }
  return base;
}

function posicionIntermedioSplit(modelo: Modelo, opdId: Id, procesoId: Id): Posicion {
  const fallback = posicionLibre(modelo, opdId, "objeto");
  const opd = modelo.opds[opdId];
  if (!opd) return fallback;
  const proceso = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === procesoId);
  if (!proceso) return fallback;

  const candidata = {
    x: proceso.x + CANON.dims.cosaWidth + 200,
    y: proceso.y,
  };
  const contenedor = contenedorRefinamiento(modelo, opdId);
  if (contenedor && !posicionDentroDeContorno(candidata, contenedor)) return fallback;
  if (Object.values(opd.apariencias).some((apariencia) => solapa(candidata, apariencia))) return fallback;
  return candidata;
}

function posicionDentroDeContorno(posicion: Posicion, contenedor: { x: number; y: number; width: number; height: number }): boolean {
  return (
    posicion.x >= contenedor.x &&
    posicion.y >= contenedor.y &&
    posicion.x + CANON.dims.cosaWidth <= contenedor.x + contenedor.width &&
    posicion.y + CANON.dims.cosaHeight <= contenedor.y + contenedor.height
  );
}

function aparienciaEnlaceExiste(apariencias: Record<Id, { enlaceId: Id }>, enlaceId: Id): boolean {
  return Object.values(apariencias).some((apariencia) => apariencia.enlaceId === enlaceId);
}
