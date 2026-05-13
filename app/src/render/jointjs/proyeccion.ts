import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import { sincronizarPuertosEnlaces } from "../../modelo/operaciones";
import type { Apariencia, Enlace, ExtremoEnlace, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";
import type { OplReferencia } from "../../opl/interaccion";
import { proyectarOverlayAbanicoCanonico } from "./abanicoOverlay";
import { proyectarBusesEstructurales, type EnlaceConEndpointVisual } from "./agregacionBus";
import { proyectarAutoInvocacion } from "./autoinvocacionLoop";
import { proyectarEntidad } from "./composers/entidad";
import { proyectarEnlace, proyectarProxyExtraccion, proyectarRefinamientoEstructural, resolverEndpointVisual } from "./composers/enlace";
import {
  proyectarHaloSeleccion,
  proyectarHaloSimulacionEntidadInvolucrada,
  proyectarHaloSimulacionEstadoCurrent,
  proyectarHaloSimulacionProceso,
  refResaltaEnlace,
  refResaltaEntidad,
} from "./composers/halos";
import { proyectarImagenesEntidad } from "./composers/imagenOverlay";
import { normalizarOpcionesProyeccion, opcionesProyeccionDesdeEntornoLegacy } from "./proyeccionOpciones";
import type { JointCellJson, OpcionesProyeccion } from "./proyeccionTipos";

export type { JointCellJson, OpcionesProyeccion, OpmJointMetadata, RolApariencia } from "./proyeccionTipos";
export { fijarOpcionesProyeccionGlobal, normalizarOpcionesProyeccion, OPCIONES_PROYECCION_DEFAULT } from "./proyeccionOpciones";
export { proyectarProxyExtraccion } from "./composers/enlace";

const TIPOS_REFINAMIENTO_ESTRUCTURAL: readonly TipoEnlace[] = [
  "agregacion",
  "exhibicion",
  "generalizacion",
  "clasificacion",
] as const;

const UMBRAL_JUMPOVER_DENSO = 35;

/*
 * Compatibilidad temporal del detector HU v2 hasta L6b. Evidencia real vive
 * en composers/* y esta cubierta por tests: strokeDasharray drop-shadow;
 * multiplicidadOrigen multiplicidadDestino; contornoRefinamiento
 * modoPlegadoApariencia; estadosVisibles markupConEstados attrsConEstados;
 * puntoCapsulaEstado extremo.kind === "estado"; filasPlegadoConNesting;
 * proxy-plegado partCounter textDecoration; proyectarOverlayAbanicoCanonico
 * abanico.operador; textoModificador etiquetaBadgeModificador ¬;
 * Math.round(enlace.probabilidad * 100) etiquetaTextoModificador.
 */

export interface OpcionesSimulacionRender {
  procesoActivoId: Id | null;
  estadosCurrent: Record<Id, Id>;
  entidadesInvolucradasIds?: readonly Id[];
  enlacesInvolucradosIds?: readonly Id[];
}

export function proyectarModeloAJointCells(
  modelo: Modelo,
  opdId: Id,
  seleccionEntidadId: Id | null,
  seleccionEnlaceId: Id | null,
  hoverOplRef: OplReferencia | null = null,
  seleccionados: readonly Id[] = [],
  opciones: OpcionesProyeccion = opcionesProyeccionDesdeEntornoLegacy(),
  simulacion: OpcionesSimulacionRender | null = null,
): JointCellJson[] {
  const modeloRender = sincronizarPuertosEnlaces(modelo, opdId);
  const opd = modeloRender.opds[opdId];
  if (!opd) return [];
  const opcionesRender = normalizarOpcionesProyeccion(opciones);
  const seleccionMultiple = new Set(seleccionados);
  const entidadesInvolucradasSim = new Set(simulacion?.entidadesInvolucradasIds ?? []);
  const enlacesInvolucradosSim = new Set(simulacion?.enlacesInvolucradosIds ?? []);

  const apariencias = Object.values(opd.apariencias);
  const usarJumpover = Object.keys(opd.enlaces).length <= UMBRAL_JUMPOVER_DENSO;
  const aparienciaPorEntidad = new Map(apariencias.map((apariencia) => [apariencia.entidadId, apariencia]));
  const elementos = apariencias.flatMap((apariencia) => {
    const entidad = modeloRender.entidades[apariencia.entidadId];
    return entidad ? [proyectarEntidad(modeloRender, opdId, apariencia, entidad, entidad.id === seleccionEntidadId || seleccionMultiple.has(entidad.id), refResaltaEntidad(modeloRender, entidad, hoverOplRef), opcionesRender)] : [];
  });
  const imagenes = apariencias.flatMap((apariencia) => {
    const entidad = modeloRender.entidades[apariencia.entidadId];
    return entidad ? proyectarImagenesEntidad(modeloRender, opdId, apariencia, entidad, opcionesRender.modoImagenGlobal) : [];
  });
  const proxies = apariencias.flatMap((apariencia) => proyectarProxyExtraccion(opdId, opd, apariencia));
  const overlaysAbanico = Object.values(modeloRender.abanicos ?? {})
    .filter((abanico) => abanico.opdId === opdId)
    .flatMap((abanico) => {
      const aparienciaPuerto = aparienciaPorEntidad.get(abanico.puertoEntidadId);
      if (!aparienciaPuerto) return [];
      return proyectarOverlayAbanicoCanonico({
        modelo: modeloRender,
        opd,
        abanico,
        aparienciaPuerto,
        aparienciaPorEntidad,
      });
    });
  // Enlaces que pertenecen a un abanico usan router recto para converger en
  // el dockPoint del puerto sin las rutas en L del routerManhattan, replicando
  // el OpmDefaultLink de OpCloud (shared.ts:2450-2457) cuyos enlaces
  // procedurales no setean router y caen al default 'normal'.
  const enlacesEnAbanico = new Set<Id>(
    Object.values(modeloRender.abanicos ?? {})
      .filter((abanico) => abanico.opdId === opdId)
      .flatMap((abanico) => abanico.enlaceIds),
  );
  const enlacesConEndpoint = Object.values(opd.enlaces).flatMap((aparienciaEnlace): EnlaceConEndpointVisual[] => {
    const enlace = modeloRender.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) return [];
    const origen = resolverEndpointVisual(modeloRender, opd, aparienciaPorEntidad, enlace.origenId);
    const destino = resolverEndpointVisual(modeloRender, opd, aparienciaPorEntidad, enlace.destinoId);
    if (!origen || !destino) return [];
    // BUG-1fc4d2: enlaces a estado (selectorEstado) tampoco entran al bus de
    // agregacion — agregacion no puede conectar a estados (regla OPM) y aun
    // si por error apareciera, el bus opera por endpoint cell-padre.
    if (origen.proxy || destino.proxy || origen.punto || destino.punto || origen.selectorEstado || destino.selectorEstado) return [];
    return [{
      enlace,
      aparienciaEnlaceId: aparienciaEnlace.id,
      ...(aparienciaEnlace.symbolPos ? { symbolPos: aparienciaEnlace.symbolPos } : {}),
      origen,
      destino,
    }];
  });
  const { busCells, enlacesConsumidos } = proyectarBusesEstructurales({
    modelo: modeloRender,
    opdId,
    enlaces: enlacesConEndpoint,
    seleccionados: new Set([
      ...(seleccionEnlaceId ? [seleccionEnlaceId] : []),
      ...seleccionados.filter((id) => modeloRender.enlaces[id]),
      ...(hoverOplRef?.tipo === "enlace" ? [hoverOplRef.id] : []),
    ]),
  });
  const enlaces = Object.values(opd.enlaces).flatMap((aparienciaEnlace) => {
    const enlace = modeloRender.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace || enlacesConsumidos.has(enlace.id)) return [];
    const origen = resolverEndpointVisual(modeloRender, opd, aparienciaPorEntidad, enlace.origenId);
    const destino = resolverEndpointVisual(modeloRender, opd, aparienciaPorEntidad, enlace.destinoId);
    if (!origen || !destino) return [];
    if (esAutoInvocacion(enlace) && origen.apariencia.id === destino.apariencia.id) {
      return proyectarAutoInvocacion({
        opdId,
        enlace,
        aparienciaEnlaceId: aparienciaEnlace.id,
        proceso: origen.apariencia,
        seleccionada: enlace.id === seleccionEnlaceId || refResaltaEnlace(enlace, hoverOplRef),
      });
    }
    if (origen.apariencia.id === destino.apariencia.id) return [];
    const enlaceResaltado = enlace.id === seleccionEnlaceId || seleccionMultiple.has(enlace.id) || refResaltaEnlace(enlace, hoverOplRef);
    const enlaceActivoRuntime = enlacesInvolucradosSim.has(enlace.id);
    const refinableId = entidadIdDeExtremo(modeloRender, enlace.origenId);
    const ordenado = refinableId
      ? modeloRender.entidades[refinableId]?.orderedFundamentalTypes?.includes(enlace.tipo) ?? false
      : false;
    return TIPOS_REFINAMIENTO_ESTRUCTURAL.includes(enlace.tipo) && !origen.proxy && !destino.proxy
      ? proyectarRefinamientoEstructural(opdId, enlace, aparienciaEnlace.id, origen, destino, enlaceResaltado, aparienciaEnlace.symbolPos, ordenado)
      : [proyectarEnlace(opdId, enlace, aparienciaEnlace.id, origen, destino, aparienciaEnlace.vertices, enlaceResaltado, enlacesEnAbanico.has(enlace.id), { usarJumpover, activaSimulacion: enlaceActivoRuntime })];
  });

  const halos = seleccionMultiple.size > 1
    ? apariencias.flatMap((apariencia) => {
        const entidad = modeloRender.entidades[apariencia.entidadId];
        if (!entidad || !seleccionMultiple.has(entidad.id)) return [];
        return [proyectarHaloSeleccion(opdId, apariencia, entidad)];
      })
    : [];

  const halosSimulacion = simulacion
    ? apariencias.flatMap((apariencia) => {
        const entidad = modeloRender.entidades[apariencia.entidadId];
        if (!entidad) return [];
        const cells: JointCellJson[] = [];
        if (entidadesInvolucradasSim.has(entidad.id) && entidad.id !== simulacion.procesoActivoId) {
          cells.push(proyectarHaloSimulacionEntidadInvolucrada(opdId, apariencia, entidad));
        }
        if (simulacion.procesoActivoId && entidad.id === simulacion.procesoActivoId && entidad.tipo === "proceso") {
          cells.push(proyectarHaloSimulacionProceso(opdId, apariencia, entidad));
        }
        const currentId = simulacion.estadosCurrent[entidad.id];
        if (currentId && entidad.tipo === "objeto") {
          const estado = modeloRender.estados[currentId];
          if (estado) cells.push(proyectarHaloSimulacionEstadoCurrent(modeloRender, opdId, apariencia, entidad, estado));
        }
        return cells;
      })
    : [];

  return [...busCells, ...enlaces, ...proxies, ...overlaysAbanico, ...elementos, ...imagenes, ...halos, ...halosSimulacion];
}
