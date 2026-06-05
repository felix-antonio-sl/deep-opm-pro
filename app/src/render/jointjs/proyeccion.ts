import { esAutoInvocacion } from "../../modelo/autoinvocacion";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import { aparicionesVisiblesEnOpd } from "../../modelo/politicaApariciones";
import { puertoComunDeAbanico } from "../../modelo/abanicos";
import type { Apariencia, Enlace, Estado, ExtremoEnlace, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";
import type { OplReferencia } from "../../opl/interaccion";
import { proyectarOverlayAbanicoCanonico } from "./abanicoOverlay";
import { centroApariencia, proyectarBusesEstructurales, separarCentroSimboloEstructural, type EnlaceConEndpointVisual, type ReservaSimboloEstructural } from "./agregacionBus";
import { proyectarAutoInvocacion } from "./autoinvocacionLoop";
import { proyectarEntidad } from "./composers/entidad";
import { proyectarEnlace, proyectarProxyExtraccion, proyectarRefinamientoEstructural, resolverEndpointVisual } from "./composers/enlace";
import {
  proyectarHaloSeleccion,
  proyectarHaloSeleccionEstado,
  proyectarHaloSimulacionEntidadInvolucrada,
  proyectarHaloSimulacionEstadoCurrent,
  proyectarHaloSimulacionEstadoInicial,
  proyectarHaloSimulacionEstadoResultado,
  proyectarHaloSimulacionProceso,
  refResaltaEnlace,
  refResaltaEntidad,
} from "./composers/halos";
import { proyectarImagenesEntidad } from "./composers/imagenOverlay";
import { normalizarOpcionesProyeccion, OPCIONES_PROYECCION_DEFAULT } from "./proyeccionOpciones";
import type { JointCellJson, OpcionesProyeccion } from "./proyeccionTipos";

export type { JointCellJson, OpcionesProyeccion, OpmJointMetadata, RolApariencia } from "./proyeccionTipos";
export { normalizarOpcionesProyeccion, OPCIONES_PROYECCION_DEFAULT } from "./proyeccionOpciones";
export { proyectarProxyExtraccion } from "./composers/enlace";

const TIPOS_REFINAMIENTO_ESTRUCTURAL: readonly TipoEnlace[] = [
  "agregacion",
  "exhibicion",
  "generalizacion",
  "clasificacion",
] as const;

const UMBRAL_JUMPOVER_DENSO = 35;

export interface OpcionesSimulacionRender {
  procesoActivoId: Id | null;
  estadosCurrent: Record<Id, Id>;
  entidadesInvolucradasIds?: readonly Id[];
  enlacesInvolucradosIds?: readonly Id[];
  estadosInicialesIds?: readonly Id[];
  estadosResultadoIds?: readonly Id[];
}

export function proyectarModeloAJointCells(
  modelo: Modelo,
  opdId: Id,
  seleccionEntidadId: Id | null,
  seleccionEnlaceId: Id | null,
  hoverOplRef: OplReferencia | null = null,
  seleccionados: readonly Id[] = [],
  opciones: OpcionesProyeccion = OPCIONES_PROYECCION_DEFAULT,
  simulacion: OpcionesSimulacionRender | null = null,
): JointCellJson[] {
  const modeloRender = modelo;
  const opd = modeloRender.opds[opdId];
  if (!opd) return [];
  const opcionesRender = normalizarOpcionesProyeccion(opciones);
  const seleccionMultiple = new Set(seleccionados);
  const entidadesInvolucradasSim = new Set(simulacion?.entidadesInvolucradasIds ?? []);
  const enlacesInvolucradosSim = new Set(simulacion?.enlacesInvolucradosIds ?? []);
  const estadosInicialesSim = new Set(simulacion?.estadosInicialesIds ?? []);
  const estadosResultadoSim = new Set(simulacion?.estadosResultadoIds ?? []);

  const apariencias = aparicionesVisiblesEnOpd(opd);
  const estadosSeleccionadosPorEntidad = new Map<Id, Estado[]>();
  for (const estado of Object.values(modeloRender.estados)) {
    if (!seleccionMultiple.has(estado.id)) continue;
    const seleccionadosEntidad = estadosSeleccionadosPorEntidad.get(estado.entidadId);
    if (seleccionadosEntidad) {
      seleccionadosEntidad.push(estado);
    } else {
      estadosSeleccionadosPorEntidad.set(estado.entidadId, [estado]);
    }
  }
  const usarJumpover = Object.keys(opd.enlaces).length <= UMBRAL_JUMPOVER_DENSO;
  const aparienciaPorEntidad = new Map(apariencias.map((apariencia) => [apariencia.entidadId, apariencia]));
  const elementos = apariencias.flatMap((apariencia) => {
    const entidad = modeloRender.entidades[apariencia.entidadId];
    if (!entidad) return [];
    // SEL-1: «única» = hay exactamente una cosa seleccionada (lote size<=1), no
    // un multi-select. La selección simple popula `seleccionados` con 1 id
    // además de `seleccionEntidadId`, así que el discriminante es el tamaño del
    // lote, no la mera pertenencia al set.
    const esMulti = seleccionMultiple.size > 1;
    const seleccionUnica = !esMulti && (entidad.id === seleccionEntidadId || seleccionMultiple.has(entidad.id));
    const enMulti = esMulti && seleccionMultiple.has(entidad.id);
    return [proyectarEntidad(
      modeloRender,
      opdId,
      apariencia,
      entidad,
      seleccionUnica || enMulti,
      refResaltaEntidad(modeloRender, entidad, hoverOplRef),
      opcionesRender,
      // SEL-1: el underline embebido se emite solo en selección única; en multi
      // lo aporta la celda-halo de `proyectarHaloSeleccion`.
      seleccionUnica,
      estadosSeleccionadosPorEntidad.get(entidad.id) ?? [],
    )];
  });
  const imagenes = apariencias.flatMap((apariencia) => {
    const entidad = modeloRender.entidades[apariencia.entidadId];
    return entidad ? proyectarImagenesEntidad(modeloRender, opdId, apariencia, entidad, opcionesRender.modoImagenGlobal) : [];
  });
  const proxies = apariencias.flatMap((apariencia) => proyectarProxyExtraccion(opdId, opd, apariencia));
  const overlaysAbanico = Object.values(modeloRender.abanicos ?? {})
    .filter((abanico) => abanico.opdId === opdId)
    .flatMap((abanico) => {
      const aparienciaPuerto = aparienciaPorEntidad.get(puertoComunDeAbanico(abanico).entidadId);
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
      ...(aparienciaEnlace.symbolAnchors ? { symbolAnchors: aparienciaEnlace.symbolAnchors } : {}),
      ...(aparienciaEnlace.labelPositions ? { labelPositions: aparienciaEnlace.labelPositions } : {}),
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
  const reservasSimbolosEstructurales = reservasDesdeTriangulos(busCells);
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
    if (TIPOS_REFINAMIENTO_ESTRUCTURAL.includes(enlace.tipo) && !origen.proxy && !destino.proxy) {
      const symbolPos = symbolPosEstructural(aparienciaEnlace.symbolPos, origen.apariencia, destino.apariencia, reservasSimbolosEstructurales);
      return proyectarRefinamientoEstructural(opdId, enlace, aparienciaEnlace.id, origen, destino, enlaceResaltado, symbolPos, ordenado, aparienciaEnlace.symbolAnchors, aparienciaEnlace.labelPositions);
    }
    return [proyectarEnlace(opdId, enlace, aparienciaEnlace.id, origen, destino, aparienciaEnlace.vertices, aparienciaEnlace.labelPositions, enlaceResaltado, enlacesEnAbanico.has(enlace.id), {
      usarJumpover,
      activaSimulacion: enlaceActivoRuntime,
    })];
  });

  // SEL-1 (Codex rev2 §5.1): el underline crimson persistente bajo la etiqueta.
  //
  // En selección ÚNICA el underline se renderiza EMBEBIDO en la propia celda de
  // la entidad (composers/entidad.ts → markupConSelectionUnderline), no como
  // celda-halo aparte: así la affordance no incrementa el conteo de
  // `.joint-element` (que multitud de smokes usa para contar entidades) y el
  // canon V-63 del borde se conserva intacto.
  //
  // En multi-selección se conserva la celda-halo aparte (`proyectarHaloSeleccion`)
  // porque ahí el bbox unido y los halos de estado requieren celdas propias.
  const hayHalosMulti = seleccionMultiple.size > 1;
  const halos = hayHalosMulti
    ? apariencias.flatMap((apariencia) => {
        const entidad = modeloRender.entidades[apariencia.entidadId];
        if (!entidad) return [];
        const cells: JointCellJson[] = [];
        if (seleccionMultiple.has(entidad.id)) cells.push(proyectarHaloSeleccion(opdId, apariencia, entidad));

        let necesitaFallbackEntidad = false;
        for (const estado of estadosSeleccionadosPorEntidad.get(entidad.id) ?? []) {
          const halo = proyectarHaloSeleccionEstado(modeloRender, opdId, apariencia, estado);
          if (halo) {
            cells.push(halo);
          } else {
            necesitaFallbackEntidad = true;
          }
        }
        if (necesitaFallbackEntidad && !seleccionMultiple.has(entidad.id)) {
          cells.push(proyectarHaloSeleccion(opdId, apariencia, entidad));
        }
        return cells;
      })
    : [];

  const halosSimulacion = simulacion
    ? apariencias.flatMap((apariencia) => {
        const entidad = modeloRender.entidades[apariencia.entidadId];
        if (!entidad) return [];
        const cells: JointCellJson[] = [];
        if (entidadesInvolucradasSim.has(entidad.id) && entidad.id !== simulacion.procesoActivoId) {
          cells.push(proyectarHaloSimulacionEntidadInvolucrada(modeloRender, opdId, apariencia, entidad, opcionesRender));
        }
        if (simulacion.procesoActivoId && entidad.id === simulacion.procesoActivoId && entidad.tipo === "proceso") {
          cells.push(proyectarHaloSimulacionProceso(modeloRender, opdId, apariencia, entidad, opcionesRender));
        }
        const currentId = simulacion.estadosCurrent[entidad.id];
        const currentEsResultadoFinal = simulacion.procesoActivoId === null && currentId !== undefined && estadosResultadoSim.has(currentId);
        if (currentId && entidad.tipo === "objeto" && entidadesInvolucradasSim.has(entidad.id) && !currentEsResultadoFinal) {
          const estado = modeloRender.estados[currentId];
          if (estado) cells.push(proyectarHaloSimulacionEstadoCurrent(modeloRender, opdId, apariencia, entidad, estado));
        }
        if (entidad.tipo === "objeto") {
          for (const estadoResultadoId of estadosResultadoSim) {
            const estado = modeloRender.estados[estadoResultadoId];
            if (!estado || estado.entidadId !== entidad.id || (estado.id === currentId && !currentEsResultadoFinal)) continue;
            cells.push(proyectarHaloSimulacionEstadoResultado(modeloRender, opdId, apariencia, entidad, estado));
          }
        }
        if (entidad.tipo === "objeto") {
          for (const estado of Object.values(modeloRender.estados)) {
            if (estado.entidadId !== entidad.id) continue;
            if (!estadosInicialesSim.has(estado.id)) continue;
            cells.push(proyectarHaloSimulacionEstadoInicial(modeloRender, opdId, apariencia, entidad, estado));
          }
        }
        return cells;
      })
    : [];

  return [...busCells, ...enlaces, ...proxies, ...overlaysAbanico, ...elementos, ...imagenes, ...halos, ...halosSimulacion];
}

function symbolPosEstructural(
  persistida: Posicion | undefined,
  origen: Apariencia,
  destino: Apariencia,
  reservas: ReservaSimboloEstructural[],
): Posicion {
  if (persistida && Number.isFinite(persistida.x) && Number.isFinite(persistida.y)) {
    const centro = { x: Math.round(persistida.x), y: Math.round(persistida.y) };
    reservas.push({ centro, persistida: true });
    return centro;
  }
  const origenCentro = centroApariencia(origen);
  const destinoCentro = centroApariencia(destino);
  const base = {
    x: Math.round((origenCentro.x + destinoCentro.x) / 2),
    y: Math.round((origenCentro.y + destinoCentro.y) / 2),
  };
  const centro = separarCentroSimboloEstructural(base, reservas, origenCentro);
  reservas.push({ centro });
  return centro;
}

function reservasDesdeTriangulos(cells: JointCellJson[]): ReservaSimboloEstructural[] {
  return cells.flatMap((cell) => {
    if (cell.type !== "standard.Polygon") return [];
    if (!String(cell.id).endsWith("-triangulo")) return [];
    const meta = cell.opm;
    if (meta.kind !== "grupo-enlaces") return [];
    const position = cell.position as { x?: unknown; y?: unknown } | undefined;
    const size = cell.size as { width?: unknown; height?: unknown } | undefined;
    if (typeof position?.x !== "number" || typeof position.y !== "number") return [];
    const width = typeof size?.width === "number" ? size.width : 30;
    const height = typeof size?.height === "number" ? size.height : 30;
    return [{
      centro: {
        x: Math.round(position.x + width / 2),
        y: Math.round(position.y + height / 2),
      },
      persistida: true,
    }];
  });
}
