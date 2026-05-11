import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Apariencia, Enlace, ExtremoEnlace, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";
import type { OplReferencia } from "../../opl/interaccion";
import { proyectarOverlayAbanicoCanonico } from "./abanicoOverlay";
import { proyectarBusesAgregacion, type EnlaceConEndpointVisual } from "./agregacionBus";
import { proyectarAutoInvocacion } from "./autoinvocacionLoop";
import { proyectarEntidad } from "./composers/entidad";
import { proyectarEnlace, proyectarProxyExtraccion, proyectarRefinamientoEstructural, resolverEndpointVisual } from "./composers/enlace";
import {
  proyectarHaloSeleccion,
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
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const opcionesRender = normalizarOpcionesProyeccion(opciones);
  const seleccionMultiple = new Set(seleccionados);

  const apariencias = Object.values(opd.apariencias);
  const aparienciaPorEntidad = new Map(apariencias.map((apariencia) => [apariencia.entidadId, apariencia]));
  const elementos = apariencias.flatMap((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad ? [proyectarEntidad(modelo, opdId, apariencia, entidad, entidad.id === seleccionEntidadId || seleccionMultiple.has(entidad.id), refResaltaEntidad(modelo, entidad, hoverOplRef), opcionesRender)] : [];
  });
  const imagenes = apariencias.flatMap((apariencia) => {
    const entidad = modelo.entidades[apariencia.entidadId];
    return entidad ? proyectarImagenesEntidad(modelo, opdId, apariencia, entidad, opcionesRender.modoImagenGlobal) : [];
  });
  const proxies = apariencias.flatMap((apariencia) => proyectarProxyExtraccion(opdId, opd, apariencia));
  const overlaysAbanico = Object.values(modelo.abanicos ?? {})
    .filter((abanico) => abanico.opdId === opdId)
    .flatMap((abanico) => {
      const aparienciaPuerto = aparienciaPorEntidad.get(abanico.puertoEntidadId);
      if (!aparienciaPuerto) return [];
      return proyectarOverlayAbanicoCanonico({
        modelo,
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
    Object.values(modelo.abanicos ?? {})
      .filter((abanico) => abanico.opdId === opdId)
      .flatMap((abanico) => abanico.enlaceIds),
  );
  const enlacesConEndpoint = Object.values(opd.enlaces).flatMap((aparienciaEnlace): EnlaceConEndpointVisual[] => {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) return [];
    const origen = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.origenId);
    const destino = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.destinoId);
    if (!origen || !destino) return [];
    // BUG-1fc4d2: enlaces a estado (selectorEstado) tampoco entran al bus de
    // agregacion — agregacion no puede conectar a estados (regla OPM) y aun
    // si por error apareciera, el bus opera por endpoint cell-padre.
    if (origen.proxy || destino.proxy || origen.punto || destino.punto || origen.selectorEstado || destino.selectorEstado) return [];
    return [{ enlace, aparienciaEnlaceId: aparienciaEnlace.id, origen, destino }];
  });
  const { busCells, enlacesConsumidos } = proyectarBusesAgregacion({
    modelo,
    opdId,
    enlaces: enlacesConEndpoint,
    seleccionados: new Set([
      ...(seleccionEnlaceId ? [seleccionEnlaceId] : []),
      ...seleccionados.filter((id) => modelo.enlaces[id]),
      ...(hoverOplRef?.tipo === "enlace" ? [hoverOplRef.id] : []),
    ]),
  });
  const enlaces = Object.values(opd.enlaces).flatMap((aparienciaEnlace) => {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace || enlacesConsumidos.has(enlace.id)) return [];
    const origen = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.origenId);
    const destino = resolverEndpointVisual(modelo, opd, aparienciaPorEntidad, enlace.destinoId);
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
    return TIPOS_REFINAMIENTO_ESTRUCTURAL.includes(enlace.tipo) && !origen.proxy && !destino.proxy
      ? proyectarRefinamientoEstructural(opdId, enlace, aparienciaEnlace.id, origen.apariencia, destino.apariencia, enlaceResaltado)
      : [proyectarEnlace(opdId, enlace, aparienciaEnlace.id, origen, destino, aparienciaEnlace.vertices, enlaceResaltado, enlacesEnAbanico.has(enlace.id))];
  });

  const halos = seleccionMultiple.size > 1
    ? apariencias.flatMap((apariencia) => {
        const entidad = modelo.entidades[apariencia.entidadId];
        if (!entidad || !seleccionMultiple.has(entidad.id)) return [];
        return [proyectarHaloSeleccion(opdId, apariencia, entidad)];
      })
    : [];

  const halosSimulacion = simulacion
    ? apariencias.flatMap((apariencia) => {
        const entidad = modelo.entidades[apariencia.entidadId];
        if (!entidad) return [];
        const cells: JointCellJson[] = [];
        if (simulacion.procesoActivoId && entidad.id === simulacion.procesoActivoId && entidad.tipo === "proceso") {
          cells.push(proyectarHaloSimulacionProceso(opdId, apariencia, entidad));
        }
        const currentId = simulacion.estadosCurrent[entidad.id];
        if (currentId && entidad.tipo === "objeto") {
          const estado = modelo.estados[currentId];
          if (estado) cells.push(proyectarHaloSimulacionEstadoCurrent(opdId, apariencia, entidad, estado));
        }
        return cells;
      })
    : [];

  return [...busCells, ...enlaces, ...proxies, ...overlaysAbanico, ...elementos, ...imagenes, ...halos, ...halosSimulacion];
}
