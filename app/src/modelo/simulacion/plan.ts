import { tieneDesignacion } from "../estadosDesignaciones";
import { obtenerRefinamiento } from "../refinamientos";
import type { Enlace, ExtremoEnlace, Id, Modelo } from "../tipos";
import type { PasoSimulacion, TransicionEstadoSim } from "./tipos";

/**
 * Planifica una simulación conceptual sobre un OPD.
 *
 * Reglas:
 *   - Solo procesos del OPD entran al plan (HU-B0.005).
 *   - Orden canónico por `apariencia.y` ascendente (HU-B0.013); desempate
 *     alfabético es-CL para determinismo.
 *   - Cada proceso colecciona sus enlaces entrada/salida (apariencias del OPD).
 *   - Transiciones de estado se infieren de pares consumo↔resultado sobre
 *     estados del mismo objeto (HU-B0.027).
 */
export function planificarSimulacion(modelo: Modelo, opdId: Id): PasoSimulacion[] {
  return planificarOpd(modelo, opdId, 0, undefined, new Set());
}

function planificarOpd(
  modelo: Modelo,
  opdId: Id,
  profundidad: number,
  procesoPadreId: Id | undefined,
  visitados: Set<Id>,
): PasoSimulacion[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  if (visitados.has(opdId)) return [];
  const visitadosHijos = new Set(visitados);
  visitadosHijos.add(opdId);

  const pasos: PasoSimulacion[] = [];
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad || entidad.tipo !== "proceso") continue;
    if (apariencia.contextoRefinamiento?.rol === "contorno" || apariencia.contextoRefinamiento?.rol === "externo") continue;

    const enlacesEntradaIds: Id[] = [];
    const enlacesSalidaIds: Id[] = [];

    for (const aparienciaEnlace of Object.values(opd.enlaces)) {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      if (!enlace) continue;
      if (extremoAfectaA(enlace.destinoId, modelo, entidad.id)) enlacesEntradaIds.push(enlace.id);
      if (extremoAfectaA(enlace.origenId, modelo, entidad.id)) enlacesSalidaIds.push(enlace.id);
    }

    const transicionesPlanificadas = inferirTransiciones(modelo, enlacesEntradaIds, enlacesSalidaIds);
    const opdHijoId = obtenerRefinamiento(entidad, "descomposicion")?.opdId;
    const opdHijo = opdHijoId && opdHijoId !== opdId ? modelo.opds[opdHijoId] : undefined;

    pasos.push({
      opdId,
      opdNombre: opd.nombre,
      profundidad,
      ...(procesoPadreId ? { procesoPadreId } : {}),
      procesoId: entidad.id,
      procesoNombre: entidad.nombre,
      ordenY: apariencia.y,
      ...(opdHijo ? { opdHijoId: opdHijo.id, opdHijoNombre: opdHijo.nombre } : {}),
      enlacesEntradaIds,
      enlacesSalidaIds,
      transicionesPlanificadas,
    });
  }

  const ordenados = pasos.sort((a, b) => {
    if (a.ordenY !== b.ordenY) return a.ordenY - b.ordenY;
    return a.procesoNombre.localeCompare(b.procesoNombre, "es-CL");
  });
  return ordenados.flatMap((paso) => {
    const hijo = paso.opdHijoId && modelo.opds[paso.opdHijoId]
      ? planificarOpd(modelo, paso.opdHijoId, profundidad + 1, paso.procesoId, visitadosHijos)
      : [];
    return [paso, ...hijo];
  });
}

/**
 * Estado current inicial del modelo: tomar estados con designación `current`;
 * si un objeto no tiene `current`, caer a `default`, luego `inicial`, y
 * finalmente al primer estado por orden estable (los modelos casuales no
 * siempre designan `inicial` y la simulación necesita un current observable
 * para que se vea avance visual desde el primer paso).
 */
export function estadosCurrentIniciales(modelo: Modelo): Record<Id, Id> {
  const resultado: Record<Id, Id> = {};
  const fallbackDefault: Record<Id, Id> = {};
  const fallbackInicial: Record<Id, Id> = {};
  const primerEstadoPorEntidad: Record<Id, string> = {};

  for (const estado of Object.values(modelo.estados)) {
    if (estado.suprimido) continue;
    if (tieneDesignacion(estado, "current")) {
      resultado[estado.entidadId] = estado.id;
    } else if (tieneDesignacion(estado, "default")) {
      fallbackDefault[estado.entidadId] = estado.id;
    } else if (tieneDesignacion(estado, "inicial")) {
      fallbackInicial[estado.entidadId] = estado.id;
    }
    const previo = primerEstadoPorEntidad[estado.entidadId];
    if (!previo || estado.id.localeCompare(previo) < 0) {
      primerEstadoPorEntidad[estado.entidadId] = estado.id;
    }
  }

  for (const [entidadId, estadoId] of Object.entries(fallbackDefault)) {
    if (!(entidadId in resultado)) resultado[entidadId] = estadoId;
  }
  for (const [entidadId, estadoId] of Object.entries(fallbackInicial)) {
    if (!(entidadId in resultado)) resultado[entidadId] = estadoId;
  }
  for (const [entidadId, estadoId] of Object.entries(primerEstadoPorEntidad)) {
    if (!(entidadId in resultado)) resultado[entidadId] = estadoId;
  }
  return resultado;
}

function extremoAfectaA(extremo: ExtremoEnlace, modelo: Modelo, entidadId: Id): boolean {
  if (extremo.kind === "entidad") return extremo.id === entidadId;
  const estado = modelo.estados[extremo.id];
  return estado?.entidadId === entidadId;
}

/**
 * Infiere transiciones de estado emparejando consumo↔resultado sobre estados
 * del mismo objeto.
 *
 *   - Si un enlace entrada parte de un Estado y existe un enlace salida hacia
 *     un Estado del mismo objeto: transición estadoAntes → estadoDespues.
 *   - Si solo hay consumo de estado (sin salida emparejable): estadoDespues=null
 *     (terminación de estado).
 *   - Si solo hay resultado a estado (sin consumo emparejable): estadoAntes=null
 *     (creación de estado).
 *
 * Se ignoran enlaces estructurales (agregación/exhibición/etc.) y los
 * tipos procedurales agente/instrumento/invocación: estos no transicionan
 * estado en Beta2 inicial.
 */
function inferirTransiciones(
  modelo: Modelo,
  enlacesEntradaIds: Id[],
  enlacesSalidaIds: Id[],
): TransicionEstadoSim[] {
  const entradasEstado = enlacesEntradaIds
    .map((id) => modelo.enlaces[id])
    .filter((e): e is Enlace => Boolean(e))
    .filter((e) => e.tipo === "consumo" || e.tipo === "efecto")
    .filter((e) => e.origenId.kind === "estado");

  const salidasEstado = enlacesSalidaIds
    .map((id) => modelo.enlaces[id])
    .filter((e): e is Enlace => Boolean(e))
    .filter((e) => e.tipo === "resultado" || e.tipo === "efecto")
    .filter((e) => e.destinoId.kind === "estado");

  const transiciones: TransicionEstadoSim[] = [];
  const consumidos = new Set<string>();
  const producidos = new Set<string>();

  for (const consumo of entradasEstado) {
    const estadoAntes = modelo.estados[consumo.origenId.id];
    if (!estadoAntes) continue;
    const entidadId = estadoAntes.entidadId;

    const resultado = salidasEstado.find((s) => {
      const estadoDespues = modelo.estados[s.destinoId.id];
      return estadoDespues?.entidadId === entidadId;
    });

    if (resultado) {
      const estadoDespues = modelo.estados[resultado.destinoId.id];
      if (estadoDespues) {
        transiciones.push({
          entidadId,
          estadoAntesId: estadoAntes.id,
          estadoDespuesId: estadoDespues.id,
        });
        consumidos.add(consumo.id);
        producidos.add(resultado.id);
      }
    } else {
      transiciones.push({
        entidadId,
        estadoAntesId: estadoAntes.id,
        estadoDespuesId: null,
      });
      consumidos.add(consumo.id);
    }
  }

  for (const salida of salidasEstado) {
    if (producidos.has(salida.id)) continue;
    const estadoDespues = modelo.estados[salida.destinoId.id];
    if (!estadoDespues) continue;
    transiciones.push({
      entidadId: estadoDespues.entidadId,
      estadoAntesId: null,
      estadoDespuesId: estadoDespues.id,
    });
  }

  return transiciones;
}
