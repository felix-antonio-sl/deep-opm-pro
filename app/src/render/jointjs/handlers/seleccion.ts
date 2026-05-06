import type { dia } from "jointjs";
import type { ModoPlegado, TipoEntidad } from "../../../modelo/tipos";
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
  modoEnlaceRef: { current: unknown };
  modoCreacionRef: { current: TipoEntidad | null };
  rubberBandRef: { current: boolean };
  suprimirBlankClickRef: { current: boolean };
  seleccionarEntidadRef: { current: (id: string) => void };
  seleccionarPartePlegadaRef: { current: (aparienciaId: string, parteEntidadId: string) => void };
  seleccionarEstadoComoExtremoRef: { current: (estadoId: string) => void };
  seleccionarEnlaceRef: { current: (id: string) => void };
  cambiarModoPlegadoAparienciaRef: { current: (aparienciaId: string, modo: ModoPlegado) => void };
  agregarASeleccionRef: { current: (id: string) => void };
  toggleSeleccionRef: { current: (id: string) => void };
  vaciarSeleccionRef: { current: () => void };
  crearEntidadEnCanvasRef: { current: (tipo: TipoEntidad, posicion: { x: number; y: number }) => void };
}

export function cablearSeleccion(args: CablearSeleccionArgs): () => void {
  const {
    paper,
    modoEnlaceRef,
    modoCreacionRef,
    rubberBandRef,
    suprimirBlankClickRef,
    seleccionarEntidadRef,
    seleccionarPartePlegadaRef,
    seleccionarEstadoComoExtremoRef,
    seleccionarEnlaceRef,
    cambiarModoPlegadoAparienciaRef,
    agregarASeleccionRef,
    toggleSeleccionRef,
    vaciarSeleccionRef,
    crearEntidadEnCanvasRef,
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
        if (modoEnlaceRef.current) {
          seleccionarEstadoComoExtremoRef.current(estadoId);
          return;
        }
        seleccionarEntidadRef.current(meta.entidadId);
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
      seleccionarEnlaceRef.current(meta.enlaceId);
    }
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

  paper.on("element:pointerclick", onElementPointerclick);
  paper.on("link:pointerclick", onLinkPointerclick);
  paper.on("blank:pointerclick", onBlankPointerclick);

  return () => {
    paperOff(paper, "element:pointerclick", onElementPointerclick as (...args: never[]) => void);
    paperOff(paper, "link:pointerclick", onLinkPointerclick as (...args: never[]) => void);
    paperOff(paper, "blank:pointerclick", onBlankPointerclick as (...args: never[]) => void);
  };
}
