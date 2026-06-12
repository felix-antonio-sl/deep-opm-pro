// CodexSelectionAnnotation — única voz funcional de la selección (Codex rev2).
//
// ui-forja/02-components §5 + 08-jointjs-styling §6.2. Overlay HTML (NO
// elementTool JointJS, V-202: affordance UI, no gramática OPM) posicionado
// sobre el contenedor del paper (`canvas-pane`) leyendo la transformación de
// coordenadas del adaptador del canvas (`leerBboxOverlayCells`, vía
// CanvasAdapterContext).
//
// Ronda Codex v2 · L4 — «una voz»: esta anotación dejó de ser decorativa y
// absorbió las acciones que vivían en `BarraHerramientasElemento` (la caja de
// chips). Para no romper el contrato e2e/unit existente preserva los mismos
// `data-testid` (`barra-herramientas-elemento`, `barra-<accion>`,
// `barra-resumen-*`, `barra-live-region`), `role="toolbar"`, `aria-label`,
// `aria-keyshortcuts`, y los handlers de cada acción. La presentación es
// tipográfica Codex (palabras separadas por `·`, sin botones-caja) en vez de la
// barra blanca flotante; pero la semántica accesible es idéntica.
//
// Anatomía (§5):
//   ※ descomponer · desplegar · estado · alias · inspector
//     ─────────────────────────────────────────────
//     o.06 · objeto · informacional · sistémico
//
// Toggle del Inspector lateral: en el shell Codex la marginalia (Inspector) es
// persistente por defecto; las acciones `inspector`/`mas-opciones` enfocan y
// hacen scroll al pane en vez de colapsar el chrome (territorio App.tsx, no L4).

import { createPortal } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { dia } from "jointjs";
import { useBarraHerramientasElementoViewModel } from "../../app/viewmodels/barraHerramientasElementoViewModel";
import { useZustandEditabilityPort } from "../../app/ports/zustandEditabilityPort";
import {
  accionesParaContextoBarra,
  ariaLabelBarra,
  atajoAria,
  resolverContextoBarra,
  textoLiveBarra,
  textoResumenEnlaceBarra,
  type AccionBarra,
  type AccionBarraId,
  type ContextoBarraSeleccion,
} from "../BarraHerramientasElemento";
import type { Id } from "../../modelo/tipos";
import { useCanvasPaper } from "../CanvasAdapterContext";
import { tokens } from "../tokens";
import { GLIFO_REF, GLIFO_SEP } from "./glifos";

const OFFSET = 10;
const PADDING_VIEWPORT = 8;
const ALTO_ESTIMADO = 46;
const ANCHO_ESTIMADO = 300;

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
  const {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    agregarEstadoSmart,
    descomponer,
    desplegar,
    abrirModalImagen,
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
  } = useBarraHerramientasElementoViewModel();
  const paper = useCanvasPaper();
  const [posicion, setPosicion] = useState<PosicionAnotacion | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  const contexto = useMemo(
    () => resolverContextoBarra(modelo, opdActivoId, seleccionId, enlaceSeleccionId, seleccionados),
    [enlaceSeleccionId, modelo, opdActivoId, seleccionados, seleccionId],
  );

  // El shell Codex monta la marginalia (Inspector) de forma persistente; estas
  // acciones la enfocan en vez de colapsar el chrome (App.tsx, fuera de L4).
  const abrirInspector = () => enfocarSeccionInspector("inspector-pane");
  // Ley silencio-cero (C-1): en solo lectura (modo simulación, vista derivada)
  // la anotación no ofrece acciones de edición — invitarían a gestos que el
  // commit rechazaría.
  const { readOnly } = useZustandEditabilityPort();
  const acciones = useMemo(
    () => accionesParaContextoBarra(contexto, true, readOnly).filter((a) => a.visible),
    [contexto, readOnly],
  );

  const entidad = contexto?.tipo === "entidad" ? contexto.entidad : null;
  const enlace = contexto?.tipo === "enlace" ? contexto.enlace : null;

  // El portal se ancla al `canvas-pane`, localizado desde el host del paper.
  useEffect(() => {
    setHost(canvasPaneDePaper(paper));
  }, [paper]);

  useEffect(() => {
    if (!paper || !host || !contexto || acciones.length === 0) {
      setPosicion(null);
      return undefined;
    }
    let cancelado = false;
    const actualizar = () => {
      if (cancelado) return;
      // Coordenadas en píxeles de cliente leídas de las vistas DOM de las celdas
      // ancla, convertidas a coords relativas al `canvas-pane` (host del portal)
      // restando su bounding rect. Evita razonar sobre el sistema de coordenadas
      // del paper (scroll del viewport + transform de zoom) y se mantiene exacto
      // bajo scroll/zoom.
      const rectCliente = rectClienteDeCeldas(paper, contexto.anchorCellIds);
      if (!rectCliente) {
        setPosicion(null);
        return;
      }
      const h = host.getBoundingClientRect();
      const visible =
        rectCliente.bottom > h.top &&
        rectCliente.top < h.bottom &&
        rectCliente.right > h.left &&
        rectCliente.left < h.right;
      if (!visible) {
        setPosicion(null);
        return;
      }
      const rectEnHost = {
        x: rectCliente.left - h.left,
        y: rectCliente.top - h.top,
        width: rectCliente.width,
        height: rectCliente.height,
      };
      setPosicion(posicionarAnotacion(rectEnHost, host.clientHeight, {
        anchoCanvas: host.clientWidth,
        anchoEstimado: ANCHO_ESTIMADO,
      }));
    };
    const onFrame = () => requestAnimationFrame(actualizar);
    actualizar();
    const paperEvents = paper as unknown as { on(e: string, cb: () => void): void; off(e: string, cb: () => void): void };
    paperEvents.on("render:done scale translate transform resize", actualizar);
    window.addEventListener("resize", onFrame);
    const viewport = viewportDePaper(paper);
    viewport?.addEventListener("scroll", onFrame, { passive: true });
    return () => {
      cancelado = true;
      paperEvents.off("render:done scale translate transform resize", actualizar);
      window.removeEventListener("resize", onFrame);
      viewport?.removeEventListener("scroll", onFrame);
    };
  }, [acciones.length, contexto, host, paper]);

  if (!contexto || !posicion || !host) return null;

  const handlers: Record<AccionBarraId, () => void> = {
    "cambiar-tipo-enlace": () => {
      if (!enlace) return;
      abrirInspector();
      enfocarSeccionInspector("inspector-panel-enlace-propiedades");
    },
    "agregar-estado": () => {
      if (entidad?.tipo === "objeto") agregarEstadoSmart();
    },
    inzoom: () => descomponer(),
    unfold: () => desplegar(),
    "editar-alias": () => {
      if (!entidad) return;
      abrirInspector();
      enfocarSeccionInspector("inspector-seccion-alias");
    },
    "editar-imagen": () => {
      if (entidad?.tipo === "objeto") abrirModalImagen(entidad.id);
    },
    "eliminar-seleccion": () => eliminarSeleccion(),
    "agregar-como-partes": () => {
      if (seleccionados.length < 2) return;
      const todo = seleccionados[seleccionados.length - 1];
      if (todo) conectarSeleccionAlTodo(todo, "agregacion");
    },
    "traer-enlaces": () => traerEnlacesEntreSeleccionadas(),
    "alinear-seleccion": () => alinearSeleccion("izq"),
    "distribuir-seleccion": () => distribuirSeleccion("horizontal"),
    "mas-opciones": () => abrirInspector(),
  };

  const { marca, marcaGrande } = marcaDeContexto(contexto);

  return createPortal(
    <div
      aria-label={ariaLabelBarra(contexto)}
      data-placement={posicion.placement}
      data-testid="barra-herramientas-elemento"
      role="toolbar"
      style={{
        ...style.barra,
        left: `${posicion.left}px`,
        top: `${posicion.top}px`,
      }}
    >
      <span aria-live="polite" data-testid="barra-live-region" style={style.srOnly}>
        {textoLiveBarra(contexto)}
      </span>
      <div style={style.fila}>
        <span style={marcaGrande ? style.marcaGrande : style.marca}>{marca}</span>
        {contexto.tipo === "multi" ? (
          <span data-testid="barra-resumen-multiseleccion" style={style.resumen}>
            {contexto.cantidad} seleccionadas
          </span>
        ) : null}
        {contexto.tipo === "enlace" ? (
          <span data-testid="barra-resumen-enlace" style={style.resumen}>
            {textoResumenEnlaceBarra(contexto.enlace)}
          </span>
        ) : null}
        <span style={style.acciones}>
          {acciones.map((accion, i) => (
            <span key={accion.id}>
              {i > 0 ? <span style={style.sep}>{` ${GLIFO_SEP} `}</span> : null}
              <button
                type="button"
                aria-label={accion.label}
                aria-keyshortcuts={atajoAria(accion.atajo)}
                data-testid={accion.testId}
                disabled={!accion.enabled}
                onClick={handlers[accion.id]}
                style={estiloBotonAccion(accion)}
                title={tituloAccion(accion)}
              >
                {etiquetaAccion(accion)}
              </button>
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
// Etiqueta visible Codex (palabra). Usa el texto corto del catálogo cuando
// existe (p.ej. "Propiedades", "Inspector"), o el label en minúscula como
// palabra editorial Codex.
// ---------------------------------------------------------------------------

function etiquetaAccion(accion: AccionBarra): string {
  if (accion.texto) return accion.texto;
  return ETIQUETAS_CODEX[accion.id] ?? accion.label.toLocaleLowerCase("es");
}

const ETIQUETAS_CODEX: Partial<Record<AccionBarraId, string>> = {
  inzoom: "descomponer",
  unfold: "desplegar",
  "agregar-estado": "estado",
  "editar-alias": "alias",
  "editar-imagen": "imagen",
  "mas-opciones": "inspector",
  "eliminar-seleccion": "eliminar",
};

function tituloAccion(accion: AccionBarra): string {
  return accion.atajo ? `${accion.label} (${accion.atajo})` : accion.label;
}

// ---------------------------------------------------------------------------
// Coordenadas y posicionamiento.
// ---------------------------------------------------------------------------

export function posicionarAnotacion(
  rect: { x: number; y: number; width: number; height: number },
  altoCanvas: number,
  opciones: { anchoCanvas?: number; anchoEstimado?: number } = {},
): PosicionAnotacion {
  const leftBase = rect.x + rect.width / 2;
  const medioAncho = (opciones.anchoEstimado ?? ANCHO_ESTIMADO) / 2;
  const left = opciones.anchoCanvas && opciones.anchoCanvas > 0
    ? Math.min(
        opciones.anchoCanvas - PADDING_VIEWPORT - medioAncho,
        Math.max(PADDING_VIEWPORT + medioAncho, leftBase),
      )
    : leftBase;
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

function viewportDePaper(paper: dia.Paper): HTMLElement | null {
  const el = (paper as unknown as { el?: Element }).el;
  return el?.closest<HTMLElement>('[role="img"][aria-label="OPD activo"]') ?? null;
}

interface RectCliente {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/** Bounding rect (px de cliente) que une las vistas DOM de las celdas ancla. */
function rectClienteDeCeldas(paper: dia.Paper, cellIds: readonly Id[]): RectCliente | null {
  const graph = (paper as unknown as { model?: { getCell(id: string): unknown }; options?: { model?: { getCell(id: string): unknown } } });
  const model = graph.model ?? graph.options?.model;
  if (!model) return null;
  const rects: DOMRect[] = [];
  for (const cellId of cellIds) {
    const cell = model.getCell(cellId);
    if (!cell) continue;
    const view = paper.findViewByModel(cell as Parameters<dia.Paper["findViewByModel"]>[0]);
    const el = (view as unknown as { el?: Element } | undefined)?.el;
    const rect = el?.getBoundingClientRect();
    if (rect && (rect.width > 0 || rect.height > 0)) rects.push(rect);
  }
  if (rects.length === 0) return null;
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

function enfocarSeccionInspector(testId: string): void {
  window.setTimeout(() => {
    const seccion = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
    const foco = seccion?.querySelector<HTMLElement>("input, textarea, button, select");
    foco?.focus();
    seccion?.scrollIntoView({ block: "nearest" });
  }, 0);
}

// ---------------------------------------------------------------------------
// Mapeo de contexto de selección → marca / acciones / metaline.
// (Helpers puros: cubiertos por CodexSelectionAnnotation.test.tsx.)
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

// ---------------------------------------------------------------------------
// Estilo: palabras Codex clicables. Primaria → italic+bold; destructiva →
// italic crimson; resto inkMid. Botón transparente, sin caja (§6.2).
// ---------------------------------------------------------------------------

function estiloBotonAccion(accion: AccionBarra): preact.JSX.CSSProperties {
  const base = { ...style.boton };
  if (!accion.enabled) return { ...base, color: tokens.colors.inkFaint, cursor: "not-allowed" };
  if (accion.destructiva) return { ...base, ...style.botonDanger };
  if (esPrimaria(accion.id)) return { ...base, ...style.botonPrimary };
  return base;
}

function esPrimaria(id: AccionBarraId): boolean {
  return id === "inzoom" || id === "cambiar-tipo-enlace" || id === "mas-opciones";
}

const style = {
  barra: {
    position: "absolute",
    zIndex: 13,
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    maxWidth: "min(620px, 92%)",
    pointerEvents: "auto",
    userSelect: "none",
    background: "transparent",
    fontFamily: tokens.typography.serif,
  },
  fila: {
    display: "flex",
    alignItems: "baseline",
    gap: "10px",
    flexWrap: "wrap",
    whiteSpace: "normal",
    maxWidth: "100%",
    rowGap: "2px",
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
  resumen: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: tokens.typography.lh.tight,
  },
  acciones: {
    display: "inline-flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    maxWidth: "100%",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    lineHeight: tokens.typography.lh.tight,
  },
  boton: {
    appearance: "none",
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs13}px`,
    fontStyle: "normal",
    fontWeight: tokens.typography.weights.regular,
    lineHeight: tokens.typography.lh.tight,
    cursor: "pointer",
  },
  botonPrimary: {
    color: tokens.colors.ink,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.bold,
  },
  botonDanger: {
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
  srOnly: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
