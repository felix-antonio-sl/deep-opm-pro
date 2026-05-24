import { dia, elementTools } from "jointjs";
import { anclajeRefinableSimbolo, anclajeRefinadorSimbolo, limitarAnclajeSimbolo, MITAD_SIMBOLO_ESTRUCTURAL } from "../../../modelo/simboloEstructural";
import type { AnclajesSimboloEstructural, Id, Posicion } from "../../../modelo/tipos";
import { CODEX } from "../constantes.codex";
import { cellViewModel, metadata } from "./helpers";

interface AdapterMin {
  graph: dia.Graph;
  paper: dia.Paper;
}

type RolAncla = "refinable" | "refinador";
type PuertoAncla = "in" | "out";

interface SymbolAnchorControlOptions extends elementTools.Control.Options {
  portId: PuertoAncla;
  rol: RolAncla;
  onCommit: (aparienciaEnlaceIds: Id[], posicion: Posicion, anclajes: AnclajesSimboloEstructural) => void;
}

export function instalarHerramientasSimboloEstructuralSeleccionado(
  adapter: AdapterMin,
  enlaceSeleccionId: Id | null,
  onCommit: (aparienciaEnlaceIds: Id[], posicion: Posicion, anclajes: AnclajesSimboloEstructural) => void,
): void {
  if (!enlaceSeleccionId) return;
  const simbolos = adapter.graph.getElements().filter((cell) => {
    const meta = metadata(cell);
    return meta?.kind === "enlace" &&
      meta.rolEstructural === "simbolo" &&
      (meta.enlaceId === enlaceSeleccionId || meta.enlaceIds?.includes(enlaceSeleccionId) === true) &&
      cell.hasPort("in") &&
      cell.hasPort("out");
  });

  for (const simbolo of simbolos) {
    const view = adapter.paper.findViewByModel<dia.ElementView>(simbolo);
    view.removeTools();
    view.addTools(
      new dia.ToolsView({
        tools: [
          new SymbolAnchorControl({
            portId: "in",
            rol: "refinable",
            onCommit,
            handleAttributes: attrsHandle(CODEX.colores.crimson),
            selector: null,
          }),
          new SymbolAnchorControl({
            portId: "out",
            rol: "refinador",
            onCommit,
            handleAttributes: attrsHandle(CODEX.colores.crimson),
            selector: null,
          }),
        ],
      }),
    );
  }
}

class SymbolAnchorControl extends elementTools.Control<SymbolAnchorControlOptions> {
  protected override getPosition(view: dia.ElementView): dia.Point {
    return posicionPuerto(cellViewModel(view) as dia.Element, this.options.portId);
  }

  protected override setPosition(view: dia.ElementView, coordinates: dia.Point): void {
    const punto = limitarPuntoPuerto(coordinates);
    fijarPuerto(cellViewModel(view) as dia.Element, this.options.portId, punto);
  }

  protected override resetPosition(view: dia.ElementView): void {
    const anclaje = this.options.rol === "refinable"
      ? anclajeRefinableSimbolo()
      : anclajeRefinadorSimbolo(0, 1);
    fijarPuerto(cellViewModel(view) as dia.Element, this.options.portId, puntoDesdeAnclaje(anclaje));
  }

  protected override onPointerUp(evt: dia.Event): void {
    super.onPointerUp(evt);
    this.persistir();
  }

  protected override onPointerDblClick(evt: dia.Event): void {
    super.onPointerDblClick(evt);
    this.persistir();
  }

  private persistir(): void {
    const element = cellViewModel(this.relatedView) as dia.Element;
    const meta = metadata(element);
    if (meta?.kind !== "enlace" || meta.rolEstructural !== "simbolo") return;
    const posicion = element.position();
    const size = element.size();
    const aparienciaEnlaceIds = meta.aparienciaEnlaceIds?.length ? meta.aparienciaEnlaceIds : [meta.aparienciaEnlaceId];
    this.options.onCommit(
      aparienciaEnlaceIds,
      {
        x: Math.round(posicion.x + size.width / 2),
        y: Math.round(posicion.y + size.height / 2),
      },
      anclajesDesdePuertos(element),
    );
  }
}

function attrsHandle(stroke: string): Partial<Record<string, unknown>> {
  return {
    r: 5,
    fill: CODEX.colores.paper,
    stroke,
    "stroke-width": 2,
    cursor: "grab",
  };
}

function posicionPuerto(element: dia.Element, portId: PuertoAncla): dia.Point {
  const posiciones = element.getPortsPositions("symbolAnchor");
  const port = posiciones[portId];
  if (port) return { x: port.x, y: port.y };
  return portId === "in" ? { x: 15, y: 0 } : { x: 15, y: 30 };
}

function fijarPuerto(element: dia.Element, portId: PuertoAncla, punto: dia.Point): void {
  element.portProp(portId, "args", punto);
  element.portProp(portId, "position/args", punto);
}

function anclajesDesdePuertos(element: dia.Element): AnclajesSimboloEstructural {
  return {
    refinable: limitarAnclajeSimbolo(anclajeDesdePunto(posicionPuerto(element, "in"))),
    refinador: limitarAnclajeSimbolo(anclajeDesdePunto(posicionPuerto(element, "out"))),
  };
}

function limitarPuntoPuerto(punto: dia.Point): dia.Point {
  return {
    x: Math.max(0, Math.min(MITAD_SIMBOLO_ESTRUCTURAL * 2, Math.round(punto.x))),
    y: Math.max(0, Math.min(MITAD_SIMBOLO_ESTRUCTURAL * 2, Math.round(punto.y))),
  };
}

function puntoDesdeAnclaje(anclaje: { dx: number; dy: number }): dia.Point {
  return limitarPuntoPuerto({
    x: MITAD_SIMBOLO_ESTRUCTURAL + anclaje.dx,
    y: MITAD_SIMBOLO_ESTRUCTURAL + anclaje.dy,
  });
}

function anclajeDesdePunto(punto: dia.Point): { dx: number; dy: number } {
  return {
    dx: Math.round(punto.x - MITAD_SIMBOLO_ESTRUCTURAL),
    dy: Math.round(punto.y - MITAD_SIMBOLO_ESTRUCTURAL),
  };
}
