import type { dia } from "jointjs";
import { obtenerRefinamiento } from "../../../modelo/refinamientos";
import type { Modelo, ModoPlegado, TipoEntidad } from "../../../modelo/tipos";
import type { OpmJointMetadata } from "../proyeccion";
import {
  cellViewModel,
  ctrlEvento,
  estadoDesdeSelector,
  jointSelector,
  metadata,
  multiEvento,
  paperOff,
  parteEntidadDesdeSelector,
  posicionCanvasDesdeEvento,
} from "./helpers";

/**
 * Handlers de selección JointCanvas: click simple, Ctrl/Cmd+clic toggle,
 * Shift+clic agregar, click sobre estado para extremos de enlace, click sobre
 * apariencia plegada para seleccionar parte, blank deselect (con guards de
 * rubber band y modo creación), creación de entidad por click en modo barra.
 *
 * Refs: docs/HANDOFF.md §Decisiones Vigentes (multi-selección, modo barra
 *       creación sticky HU-11.001),
 *       opm-extracted/src/app/configuration/rappidEnviromentFunctionality/
 *       selectionConfiguration.ts:5-65.
 */

export interface CablearSeleccionArgs {
  paper: dia.Paper;
  modeloRef: { current: Modelo };
  modoEnlaceRef: { current: unknown };
  modoCreacionRef: { current: TipoEntidad | null };
  rubberBandRef: { current: boolean };
  suprimirBlankClickRef: { current: boolean };
  seleccionarEntidadRef: { current: (id: string) => void };
  seleccionarPartePlegadaRef: { current: (aparienciaId: string, parteEntidadId: string) => void };
  seleccionarEstadoComoExtremoRef: { current: (estadoId: string) => void };
  seleccionarEnlaceRef: { current: (id: string) => void };
  seleccionarGrupoEstructuralRef: { current: (id: string, ids: string[]) => void };
  cambiarOpdActivoRef: { current: (id: string) => void };
  cambiarModoPlegadoAparienciaRef: { current: (aparienciaId: string, modo: ModoPlegado) => void };
  alternarModoImagenEntidadRef: { current: (entidadId: string) => void };
  abrirModalImagenRef: { current: (entidadId: string) => void };
  agregarASeleccionRef: { current: (id: string) => void };
  toggleSeleccionRef: { current: (id: string) => void };
  vaciarSeleccionRef: { current: () => void };
  crearEntidadEnCanvasRef: { current: (tipo: TipoEntidad, posicion: { x: number; y: number }) => void };
  crearAparienciaEntidadEnCanvasRef: { current: (entidadId: string, posicion: { x: number; y: number }) => void };
  abrirRenombradoInlineRef: { current: (input: { aparienciaId: string; entidadId: string }) => void };
  /**
   * Paquete "Estados ciudadanos de primera clase" (2026-05-23).
   * Click sobre cápsula en modo normal: selecciona el estado en vez de
   * redirigir al objeto. Multi-select Shift/Ctrl invoca
   * `agregarEstadoASeleccionRef` / `toggleSeleccionEstadoRef` (validan
   * mismo objeto propietario). Modo enlace preservado: el handler
   * existente (`seleccionarEstadoComoExtremoRef`) sigue siendo el camino
   * cuando `modoEnlaceRef.current` es no-null.
   *
   * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §5, §7.
   */
  seleccionarEstadoRef: { current: (estadoId: string) => void };
  agregarEstadoASeleccionRef: { current: (estadoId: string) => void };
  toggleSeleccionEstadoRef: { current: (estadoId: string) => void };
}

export function cablearSeleccion(args: CablearSeleccionArgs): () => void {
  const {
    paper,
    modeloRef,
    modoEnlaceRef,
    modoCreacionRef,
    rubberBandRef,
    suprimirBlankClickRef,
    seleccionarEntidadRef,
    seleccionarPartePlegadaRef,
    seleccionarEstadoComoExtremoRef,
    seleccionarEnlaceRef,
    seleccionarGrupoEstructuralRef,
    cambiarOpdActivoRef,
    cambiarModoPlegadoAparienciaRef,
    alternarModoImagenEntidadRef,
    abrirModalImagenRef,
    agregarASeleccionRef,
    toggleSeleccionRef,
    vaciarSeleccionRef,
    crearEntidadEnCanvasRef,
    crearAparienciaEntidadEnCanvasRef,
    abrirRenombradoInlineRef,
    seleccionarEstadoRef,
    agregarEstadoASeleccionRef,
    toggleSeleccionEstadoRef,
  } = args;

  const onElementPointerclick = (elementView: dia.ElementView, evt: dia.Event) => {
    evt.stopPropagation();
    const tipoCreacion = modoCreacionRef.current;
    if (tipoCreacion) {
      const posicion = posicionCanvasDesdeEvento(paper, evt);
      crearEntidadEnCanvasRef.current(tipoCreacion, {
        x: Math.round(posicion.x),
        y: Math.round(posicion.y),
      });
      return;
    }
    const meta = metadata(cellViewModel(elementView));
    if (meta?.kind === "imagen-insignia") {
      alternarModoImagenEntidadRef.current(meta.entidadId);
      return;
    }
    if (meta?.kind === "entidad") {
      if (multiEvento(evt)) {
        if (ctrlEvento(evt)) toggleSeleccionRef.current(meta.entidadId);
        else agregarASeleccionRef.current(meta.entidadId);
        return;
      }
      const selector = jointSelector(evt.target);
      if (selector === "foldBadge") {
        cambiarModoPlegadoAparienciaRef.current(meta.aparienciaId, "parcial");
        return;
      }
      const parteEntidadId = parteEntidadDesdeSelector(meta, selector);
      if (parteEntidadId) {
        seleccionarPartePlegadaRef.current(meta.aparienciaId, parteEntidadId);
        return;
      }
      const estadoId = estadoDesdeSelector(meta, selector);
      if (estadoId) {
        // Modo enlace preservado (escenario 9 del smoke): el estado actúa como
        // extremo del enlace en construcción. Igual comportamiento que pre-2026-05-23.
        if (modoEnlaceRef.current) {
          seleccionarEstadoComoExtremoRef.current(estadoId);
          return;
        }
        // Paquete "Estados ciudadanos de primera clase" (2026-05-23):
        // click sobre cápsula en modo normal selecciona el estado, no el
        // objeto. Shift/Ctrl multi-select va al estado (constraint:
        // mismo objeto propietario, validado en el slice).
        // Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §5, §7.
        if (multiEvento(evt)) {
          if (ctrlEvento(evt)) toggleSeleccionEstadoRef.current(estadoId);
          else agregarEstadoASeleccionRef.current(estadoId);
          return;
        }
        seleccionarEstadoRef.current(estadoId);
        return;
      }
      seleccionarEntidadRef.current(meta.entidadId);
    }
    if (meta?.kind === "enlace") {
      if (multiEvento(evt)) {
        if (ctrlEvento(evt)) toggleSeleccionRef.current(meta.enlaceId);
        else agregarASeleccionRef.current(meta.enlaceId);
        return;
      }
      if (meta.rolEstructural === "simbolo" && meta.enlaceIds && meta.enlaceIds.length > 1) {
        seleccionarGrupoEstructuralRef.current(meta.enlaceId, meta.enlaceIds);
        return;
      }
      seleccionarEnlaceRef.current(meta.enlaceId);
    }
  };

  const onElementContextmenu = (elementView: dia.ElementView, evt: dia.Event) => {
    evt.stopPropagation();
    const event = evt as unknown as MouseEvent;
    event.preventDefault();
    const meta = metadata(cellViewModel(elementView));
    if (meta?.kind === "imagen-insignia") {
      abrirModalImagenRef.current(meta.entidadId);
      return;
    }
    if (meta?.kind === "entidad") {
      // Paquete "Estados ciudadanos de primera clase" (2026-05-23):
      // right-click sobre cápsula → MenuContextualEstado. Selecciona el
      // estado primero para sellar el invariante del coproducto y luego
      // dispara el evento custom que `MenuContextualEstado` escucha.
      // V-202: el menú contextual es affordance UI, no gramática.
      const selector = jointSelector(evt.target);
      const estadoId = estadoDesdeSelector(meta, selector);
      if (estadoId && !modoEnlaceRef.current) {
        seleccionarEstadoRef.current(estadoId);
        window.dispatchEvent(new CustomEvent("opm:menu-contextual-estado", {
          detail: { estadoId, entidadId: meta.entidadId, aparienciaId: meta.aparienciaId, x: event.clientX, y: event.clientY },
        }));
      }
    }
  };

  const onLinkContextmenu = (linkView: dia.LinkView, evt: dia.Event) => {
    evt.stopPropagation();
    const event = evt as unknown as MouseEvent;
    event.preventDefault();
    const meta = metadata(cellViewModel(linkView));
    if (meta?.kind !== "enlace") return;
    seleccionarEnlaceRef.current(meta.enlaceId);
    window.dispatchEvent(new CustomEvent("opm:menu-contextual-enlace", {
      detail: { enlaceId: meta.enlaceId, x: event.clientX, y: event.clientY },
    }));
  };

  const onElementPointerdblclick = (elementView: dia.ElementView, evt: dia.Event) => {
    const meta = metadata(cellViewModel(elementView));
    if (meta?.kind !== "entidad") return;
    const selector = jointSelector(evt.target);
    if (parteEntidadDesdeSelector(meta, selector) || estadoDesdeSelector(meta, selector)) return;
    const opdRefinadoId = opdRefinadoPorDobleClick(modeloRef.current, meta);
    if (opdRefinadoId) {
      evt.stopPropagation();
      seleccionarEntidadRef.current(meta.entidadId);
      cambiarOpdActivoRef.current(opdRefinadoId);
      return;
    }
    if (!esSubprocesoInternoTimeline(modeloRef.current, meta)) return;
    evt.stopPropagation();
    abrirRenombradoInlineRef.current({ aparienciaId: meta.aparienciaId, entidadId: meta.entidadId });
  };

  const onLinkPointerclick = (linkView: dia.LinkView, evt: dia.Event) => {
    evt.stopPropagation();
    const tipoCreacion = modoCreacionRef.current;
    if (tipoCreacion) {
      const posicion = posicionCanvasDesdeEvento(paper, evt);
      crearEntidadEnCanvasRef.current(tipoCreacion, {
        x: Math.round(posicion.x),
        y: Math.round(posicion.y),
      });
      return;
    }
    const meta = metadata(cellViewModel(linkView));
    if (meta?.kind === "enlace") {
      if (multiEvento(evt)) {
        if (ctrlEvento(evt)) toggleSeleccionRef.current(meta.enlaceId);
        else agregarASeleccionRef.current(meta.enlaceId);
        return;
      }
      if (meta.rolEstructural === "simbolo" && meta.enlaceIds && meta.enlaceIds.length > 1) {
        seleccionarGrupoEstructuralRef.current(meta.enlaceId, meta.enlaceIds);
        return;
      }
      seleccionarEnlaceRef.current(meta.enlaceId);
    }
  };

  const onBlankPointerclick = (evt: dia.Event) => {
    const tipoCreacion = modoCreacionRef.current;
    if (!tipoCreacion) {
      if (!rubberBandRef.current && !suprimirBlankClickRef.current) vaciarSeleccionRef.current();
      return;
    }
    const posicion = posicionCanvasDesdeEvento(paper, evt);
    crearEntidadEnCanvasRef.current(tipoCreacion, {
      x: Math.round(posicion.x),
      y: Math.round(posicion.y),
    });
  };

  const onDragOver = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    const types = Array.from(event.dataTransfer.types);
    if (types.includes("application/x-opm-tipo") || types.includes("application/x-opm-entidad-id")) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }
  };

  const onDrop = (event: DragEvent) => {
    if (!event.dataTransfer) return;
    const tipo = event.dataTransfer.getData("application/x-opm-tipo") as TipoEntidad | "";
    const entidadId = event.dataTransfer.getData("application/x-opm-entidad-id");
    if (!tipo && !entidadId) return;
    event.preventDefault();
    event.stopPropagation();
    const posicion = posicionCanvasDesdeEvento(paper, event as unknown as dia.Event);
    const punto = { x: Math.round(posicion.x), y: Math.round(posicion.y) };
    if (tipo === "objeto" || tipo === "proceso") {
      crearEntidadEnCanvasRef.current(tipo, punto);
      return;
    }
    if (entidadId) {
      crearAparienciaEntidadEnCanvasRef.current(entidadId, punto);
    }
  };

  paper.on("element:pointerclick", onElementPointerclick);
  paper.on("element:pointerdblclick", onElementPointerdblclick);
  paper.on("element:contextmenu", onElementContextmenu);
  paper.on("link:pointerclick", onLinkPointerclick);
  paper.on("link:contextmenu", onLinkContextmenu);
  paper.on("blank:pointerclick", onBlankPointerclick);
  const paperEl = (paper as unknown as { el: HTMLElement }).el;
  paperEl.addEventListener("dragover", onDragOver);
  paperEl.addEventListener("drop", onDrop);

  return () => {
    paperOff(paper, "element:pointerclick", onElementPointerclick as (...args: never[]) => void);
    paperOff(paper, "element:pointerdblclick", onElementPointerdblclick as (...args: never[]) => void);
    paperOff(paper, "element:contextmenu", onElementContextmenu as (...args: never[]) => void);
    paperOff(paper, "link:pointerclick", onLinkPointerclick as (...args: never[]) => void);
    paperOff(paper, "link:contextmenu", onLinkContextmenu as (...args: never[]) => void);
    paperOff(paper, "blank:pointerclick", onBlankPointerclick as (...args: never[]) => void);
    paperEl.removeEventListener("dragover", onDragOver);
    paperEl.removeEventListener("drop", onDrop);
  };
}

export function opdRefinadoPorDobleClick(modelo: Modelo, meta: OpmJointMetadata): string | null {
  if (meta.kind !== "entidad") return null;
  const entidad = modelo.entidades[meta.entidadId];
  if (!entidad) return null;
  const descomposicion = obtenerRefinamiento(entidad, "descomposicion")?.opdId;
  if (descomposicion && modelo.opds[descomposicion]) return descomposicion;
  const despliegue = obtenerRefinamiento(entidad, "despliegue")?.opdId;
  if (despliegue && modelo.opds[despliegue]) return despliegue;
  return null;
}

function esSubprocesoInternoTimeline(modelo: Modelo, meta: OpmJointMetadata): meta is Extract<OpmJointMetadata, { kind: "entidad" }> {
  if (meta.kind !== "entidad") return false;
  const entidad = modelo.entidades[meta.entidadId];
  if (entidad?.tipo !== "proceso") return false;
  const opd = modelo.opds[meta.opdId];
  if (!opd) return false;
  if (meta.rol === "interno") return true;
  const contorno = Object.values(opd.apariencias).find((apariencia) => {
    const refinable = modelo.entidades[apariencia.entidadId];
    return refinable?.tipo === "proceso" && obtenerRefinamiento(refinable, "descomposicion")?.opdId === opd.id;
  });
  if (!contorno || contorno.entidadId === meta.entidadId) return false;
  const apariencia = opd.apariencias[meta.aparienciaId];
  return !!apariencia &&
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height;
}
