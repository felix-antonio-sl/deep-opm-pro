// CodexSelectionAnnotation — barra emergente tipográfica de selección.
//
// ui-forja/02-components §5 + README §6.8. Overlay HTML (NO elementTool JointJS,
// V-202: affordance UI, no gramática OPM) posicionado sobre el contenedor del
// paper (`canvas-pane`) leyendo la transformación de coordenadas del adaptador
// del canvas (`paper.localToPaperRect`, vía CanvasAdapterContext).
//
// Anatomía (§5):
//   ※ descomponer · desplegar · alias · inspector
//     ─────────────────────────────────────────────
//     o.06 · objeto · informacional · sistémico
//
//   - marca a la izquierda en crimson: `※` (selección única) o dígito grande
//     (multi-selección);
//   - acciones como palabras separadas por `·` (sin botones); primaria en
//     italic+bold; destructiva en italic crimson;
//   - hairline + metaline mono debajo.
//
// Decisiones (brief §10):
//   - Contenedor del portal: `canvas-pane` (mínimo acoplamiento; no toca
//     App.tsx ni CodexFrame.tsx). Se localiza desde el host del paper.
//   - Acciones: subconjunto de la barra contextual de selección
//     (BarraHerramientasElemento), mapeadas a palabras Codex.
//   - Posición: debajo del bbox; si no cabe abajo, arriba (§5 reglas).

import { createPortal } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { dia } from "jointjs";
import { useBarraHerramientasElementoViewModel } from "../../app/viewmodels/barraHerramientasElementoViewModel";
import {
  leerBboxOverlayCells,
  resolverContextoBarra,
  type ContextoBarraSeleccion,
} from "../BarraHerramientasElemento";
import { useCanvasPaper } from "../CanvasAdapterContext";
import { tokens } from "../tokens";
import { GLIFO_REF, GLIFO_SEP } from "./glifos";

const OFFSET = 10;
const PADDING_VIEWPORT = 8;
const ALTO_ESTIMADO = 46;

export interface AccionAnotacion {
  label: string;
  /** primaria → italic + bold (§5). */
  primary?: boolean;
  /** destructiva → italic crimson (§5). */
  danger?: boolean;
}

interface PosicionAnotacion {
  left: number;
  top: number;
  placement: "arriba" | "abajo";
}

export function CodexSelectionAnnotation() {
  const { modelo, opdActivoId, seleccionId, enlaceSeleccionId, seleccionados } =
    useBarraHerramientasElementoViewModel();
  const paper = useCanvasPaper();
  const [posicion, setPosicion] = useState<PosicionAnotacion | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  const contexto = useMemo(
    () => resolverContextoBarra(modelo, opdActivoId, seleccionId, enlaceSeleccionId, seleccionados),
    [enlaceSeleccionId, modelo, opdActivoId, seleccionados, seleccionId],
  );

  // El portal se ancla al `canvas-pane`, localizado desde el host del paper.
  useEffect(() => {
    setHost(canvasPaneDePaper(paper));
  }, [paper]);

  useEffect(() => {
    if (!paper || !host || !contexto) {
      setPosicion(null);
      return undefined;
    }
    let cancelado = false;
    const actualizar = () => {
      if (cancelado) return;
      const rect = leerBboxOverlayCells(paper, contexto.anchorCellIds);
      if (!rect) {
        setPosicion(null);
        return;
      }
      setPosicion(posicionarAnotacion(rect, host.clientHeight));
    };
    const onFrame = () => requestAnimationFrame(actualizar);
    actualizar();
    const paperEvents = paper as unknown as { on(e: string, cb: () => void): void; off(e: string, cb: () => void): void };
    paperEvents.on("render:done scale translate transform resize", actualizar);
    window.addEventListener("resize", onFrame);
    return () => {
      cancelado = true;
      paperEvents.off("render:done scale translate transform resize", actualizar);
      window.removeEventListener("resize", onFrame);
    };
  }, [contexto, host, paper]);

  if (!contexto || !posicion || !host) return null;

  const { marca, marcaGrande } = marcaDeContexto(contexto);
  const acciones = accionesDeContexto(contexto);

  return createPortal(
    <div
      aria-hidden="true"
      data-testid="codex-selection-annotation"
      data-placement={posicion.placement}
      style={{
        ...style.barra,
        left: `${posicion.left}px`,
        top: `${posicion.top}px`,
      }}
    >
      <div style={style.fila}>
        <span style={marcaGrande ? style.marcaGrande : style.marca}>{marca}</span>
        <span style={style.acciones}>
          {acciones.map((accion, i) => (
            <span key={accion.label}>
              {i > 0 ? <span style={style.sep}>{` ${GLIFO_SEP} `}</span> : null}
              <span style={estiloAccion(accion)}>{accion.label}</span>
            </span>
          ))}
        </span>
      </div>
      <div style={style.hairline} />
      <span style={style.meta}>{metaDeContexto(contexto)}</span>
    </div>,
    host,
  );
}

// ---------------------------------------------------------------------------
// Coordenadas y posicionamiento.
// ---------------------------------------------------------------------------

export function posicionarAnotacion(
  rect: { x: number; y: number; width: number; height: number },
  altoCanvas: number,
): PosicionAnotacion {
  const left = rect.x + rect.width / 2;
  const yAbajo = rect.y + rect.height + OFFSET;
  if (altoCanvas > 0 && yAbajo + ALTO_ESTIMADO > altoCanvas - PADDING_VIEWPORT) {
    return { left, top: Math.max(PADDING_VIEWPORT, rect.y - OFFSET - ALTO_ESTIMADO), placement: "arriba" };
  }
  return { left, top: yAbajo, placement: "abajo" };
}

function canvasPaneDePaper(paper: dia.Paper | null): HTMLElement | null {
  if (!paper) return null;
  const el = (paper as unknown as { el?: Element }).el;
  return el?.closest<HTMLElement>('[data-testid="canvas-pane"]') ?? null;
}

// ---------------------------------------------------------------------------
// Mapeo de contexto de selección → marca / acciones / metaline.
// ---------------------------------------------------------------------------

export function marcaDeContexto(contexto: ContextoBarraSeleccion): { marca: string; marcaGrande: boolean } {
  if (contexto.tipo === "multi") return { marca: String(contexto.cantidad), marcaGrande: true };
  return { marca: GLIFO_REF, marcaGrande: false };
}

export function accionesDeContexto(contexto: ContextoBarraSeleccion): AccionAnotacion[] {
  if (contexto.tipo === "multi") {
    return [
      { label: "eliminar", danger: true },
      { label: "partes" },
      { label: "alinear" },
      { label: "inspector", primary: true },
    ];
  }
  if (contexto.tipo === "enlace") {
    return [
      { label: "tipo", primary: true },
      { label: "estilo" },
      { label: "inspector" },
    ];
  }
  if (contexto.entidad.tipo === "objeto") {
    return [
      { label: "descomponer", primary: true },
      { label: "desplegar" },
      { label: "estado" },
      { label: "alias" },
      { label: "inspector" },
    ];
  }
  return [
    { label: "descomponer", primary: true },
    { label: "desplegar" },
    { label: "alias" },
    { label: "inspector" },
  ];
}

export function metaDeContexto(contexto: ContextoBarraSeleccion): string {
  if (contexto.tipo === "multi") return `${contexto.cantidad} cosas ${GLIFO_SEP} selección múltiple`;
  if (contexto.tipo === "enlace") return `enlace ${GLIFO_SEP} ${contexto.enlace.tipo}`;
  const e = contexto.entidad;
  return [e.nombre, e.tipo, esenciaMeta(e.esencia), afiliacionMeta(e.afiliacion)]
    .join(` ${GLIFO_SEP} `);
}

function esenciaMeta(esencia: string): string {
  return esencia === "fisica" ? "física" : esencia;
}

function afiliacionMeta(afiliacion: string): string {
  return afiliacion === "sistemica" ? "sistémico" : afiliacion;
}

function estiloAccion(accion: AccionAnotacion): preact.JSX.CSSProperties {
  if (accion.danger) return style.accionDanger;
  if (accion.primary) return style.accionPrimary;
  return style.accion;
}

const style = {
  barra: {
    position: "absolute",
    zIndex: 13,
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    maxWidth: "min(540px, 90%)",
    // Overlay tipográfico: no captura puntero para no bloquear el canvas.
    pointerEvents: "none",
    userSelect: "none",
    background: "transparent",
    fontFamily: tokens.typography.serif,
  },
  fila: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    whiteSpace: "nowrap",
  },
  marca: {
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs20}px`,
    fontWeight: tokens.typography.weights.regular,
    lineHeight: 1,
  },
  marcaGrande: {
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs22}px`,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: 1,
  },
  acciones: {
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    lineHeight: tokens.typography.lh.tight,
  },
  accion: {
    color: tokens.colors.inkMid,
    fontStyle: "normal",
    fontWeight: tokens.typography.weights.regular,
  },
  accionPrimary: {
    color: tokens.colors.ink,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.bold,
  },
  accionDanger: {
    color: tokens.colors.crimson,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
  },
  sep: {
    color: tokens.colors.inkFaint,
  },
  hairline: {
    height: 0,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  meta: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    letterSpacing: tokens.typography.ls.meta,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
