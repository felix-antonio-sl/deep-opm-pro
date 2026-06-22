import type { dia } from "jointjs";
import type { TipoBoceto, Boceto } from "../../../modelo/tipos";
import type { OpmJointMetadata } from "../proyeccion";
import { cellViewModel, paperOff, posicionCanvasDesdeEvento } from "./helpers";

/**
 * Handler del modo pizarra / bosquejo (D7.2). WIRING (sin unit test, sigue el
 * patrón de rubberBand/seleccion — la interacción de dibujo no la cubre el gate
 * del repo: política sin browser-automation; verificación visual del operador).
 *
 * Comportamiento:
 *  - blank:pointerdown con `modoPizarra` y `herramientaPizarra` activa ⇒ crea un
 *    boceto de esa herramienta en el punto (CLICK-TO-PLACE). Toma PRECEDENCIA
 *    sobre el rubber-band: el rubber-band solo dispara con Shift+drag, así que
 *    aquí ignoramos el evento si trae Shift (deja el rubber-band intacto) y, en
 *    cambio, colocamos el boceto en click simple.
 *  - element/link:pointerdown sobre una celda de boceto ⇒ `seleccionarBoceto`.
 *
 * Las coordenadas de paper se convierten a coordenadas de modelo con el mismo
 * helper que los demás handlers (`posicionCanvasDesdeEvento`).
 */

export interface CablearPizarraArgs {
  paper: dia.Paper;
  modoPizarraRef: { current: boolean };
  herramientaPizarraRef: { current: TipoBoceto | null };
  agregarBocetoRef: { current: (boceto: Omit<Boceto, "id">) => void };
  seleccionarBocetoRef: { current: (id: string | null) => void };
}

// Caja por defecto del boceto colocado por click (forma/texto/nota).
const CAJA_DEFAULT = { w: 140, h: 70 };
// Longitud por defecto de la flecha colocada por click (sin drag de dos puntos).
const FLECHA_DEFAULT_DX = 120;

function metadataBoceto(cell: dia.Cell): Extract<OpmJointMetadata, { kind: "boceto" }> | null {
  const value = cell.prop("opm") as OpmJointMetadata | undefined;
  return value?.kind === "boceto" ? value : null;
}

function shift(evt: dia.Event): boolean {
  return (evt as unknown as MouseEvent).shiftKey === true;
}

export function cablearPizarra(args: CablearPizarraArgs): () => void {
  const colocarBoceto = (evt: dia.Event): void => {
    const tipo = args.herramientaPizarraRef.current;
    if (!args.modoPizarraRef.current || !tipo) return;
    const posicion = posicionCanvasDesdeEvento(args.paper, evt);
    const x = Math.round(posicion.x);
    const y = Math.round(posicion.y);
    args.agregarBocetoRef.current(bocetoDesdeHerramienta(tipo, x, y));
  };

  const onBlankPointerdown = (evt: dia.Event): void => {
    if (!args.modoPizarraRef.current || !args.herramientaPizarraRef.current) return;
    // Deja el rubber-band (Shift+drag) intacto: solo colocamos en click simple.
    if (shift(evt)) return;
    colocarBoceto(evt);
  };

  const onElementPointerdown = (elementView: dia.ElementView, evt: dia.Event): void => {
    if (!args.modoPizarraRef.current) return;
    const meta = metadataBoceto(cellViewModel(elementView));
    if (!meta) return;
    evt.stopPropagation();
    args.seleccionarBocetoRef.current(meta.bocetoId);
  };

  const onLinkPointerdown = (linkView: dia.LinkView, evt: dia.Event): void => {
    if (!args.modoPizarraRef.current) return;
    const meta = metadataBoceto(cellViewModel(linkView));
    if (!meta) return;
    evt.stopPropagation();
    args.seleccionarBocetoRef.current(meta.bocetoId);
  };

  args.paper.on("blank:pointerdown", onBlankPointerdown);
  args.paper.on("element:pointerdown", onElementPointerdown);
  args.paper.on("link:pointerdown", onLinkPointerdown);

  return () => {
    paperOff(args.paper, "blank:pointerdown", onBlankPointerdown as (...a: never[]) => void);
    paperOff(args.paper, "element:pointerdown", onElementPointerdown as (...a: never[]) => void);
    paperOff(args.paper, "link:pointerdown", onLinkPointerdown as (...a: never[]) => void);
  };
}

function bocetoDesdeHerramienta(tipo: TipoBoceto, x: number, y: number): Omit<Boceto, "id"> {
  if (tipo === "flecha") {
    return { tipo, puntos: [{ x, y }, { x: x + FLECHA_DEFAULT_DX, y }] };
  }
  return { tipo, x, y, w: CAJA_DEFAULT.w, h: CAJA_DEFAULT.h, texto: "" };
}
