import type { dia } from "jointjs";
import { CANON } from "../../../modelo/constantes";
import type { Modelo } from "../../../modelo/tipos";
import type { OplReferencia } from "../../../opl/interaccion";
import { cellViewModel, estadoDesdeSelector, jointSelector, metadata, paperOff } from "./helpers";

/**
 * Handlers de hover OPL JointCanvas: cell:mouseover/mouseout traducen la cell
 * bajo el cursor a OplReferencia (entidad/estado/enlace) y la pasan al store
 * para resaltado bidireccional canvas <-> OPL.
 *
 * También expone `aplicarHoverOpl`: actualiza estilo de cells según referencia
 * activa. Se invoca tanto en el handler como en el effect de proyección.
 *
 * Refs: HU-50.* (panel OPL bidireccional).
 */

export interface CablearHoverOplArgs {
  paper: dia.Paper;
  fijarHoverOplRef: { current: (ref: OplReferencia | null) => void };
}

export function cablearHoverOpl(args: CablearHoverOplArgs): () => void {
  const onCellMouseover = (cellView: dia.CellView, evt: dia.Event) => {
    args.fijarHoverOplRef.current(refDesdeCellView(cellView, evt.target));
  };
  const onCellMouseout = () => {
    args.fijarHoverOplRef.current(null);
  };
  args.paper.on("cell:mouseover", onCellMouseover);
  args.paper.on("cell:mouseout", onCellMouseout);
  return () => {
    paperOff(args.paper, "cell:mouseover", onCellMouseover as (...args: never[]) => void);
    paperOff(args.paper, "cell:mouseout", onCellMouseout as (...args: never[]) => void);
  };
}

export function refDesdeCellView(cellView: dia.CellView, target: EventTarget | null): OplReferencia | null {
  const meta = metadata(cellViewModel(cellView));
  if (meta?.kind === "enlace") return { tipo: "enlace", id: meta.enlaceId };
  if (meta?.kind !== "entidad") return null;
  const estadoId = estadoDesdeSelector(meta, jointSelector(target));
  if (estadoId) return { tipo: "estado", id: estadoId };
  return { tipo: "entidad", id: meta.entidadId };
}

export function aplicarHoverOpl(graph: dia.Graph, modelo: Modelo, ref: OplReferencia | null, enlaceSeleccionId: string | null): void {
  for (const cell of graph.getCells()) {
    const meta = metadata(cell);
    if (meta?.kind === "entidad") {
      const entidad = modelo.entidades[meta.entidadId];
      const apariencia = modelo.opds[meta.opdId]?.apariencias[meta.aparienciaId];
      if (!entidad || !apariencia) continue;
      const resaltada = ref?.tipo === "entidad" && ref.id === entidad.id
        || ref?.tipo === "estado" && modelo.estados[ref.id]?.entidadId === entidad.id;
      cell.attr("body/fill", resaltada ? "#E1E6EB" : apariencia.estilo?.fill ?? CANON.colores.relleno);
      continue;
    }
    if (meta?.kind === "enlace") {
      const resaltado = ref?.tipo === "enlace" && ref.id === meta.enlaceId;
      const seleccionado = enlaceSeleccionId === meta.enlaceId;
      const strokeWidth = resaltado || seleccionado ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible;
      cell.attr("line/strokeWidth", strokeWidth);
      cell.attr("body/strokeWidth", strokeWidth);
    }
  }
}
