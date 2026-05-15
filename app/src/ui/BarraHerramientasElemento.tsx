import type { dia } from "jointjs";
import { useEffect, useMemo, useState } from "preact/hooks";
import type { Entidad, Id, Modelo } from "../modelo/tipos";
import { useOpmStore } from "../store";
import {
  accionesContextualesEntidad,
  type AccionContextual,
  type AccionContextualId,
} from "../store/acciones-contextuales";
import { colors } from "./tokens";

/**
 * [V-1] [JOYAS §2] Barra flotante CN-SOT/CN-MOT para una cosa seleccionada.
 * Contrato ronda 13 L4: steipete §T2.5 pilota 6 acciones OPCloud destiladas
 * desde opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts.
 * IFML: ViewComponent BarraHerramientasElemento; Event -> Action nombrada -> resultado.
 */

const ICONO_AGREGAR_ESTADO = (
  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <rect x="8" y="6" width="9" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 10 L7 10 M5 8 L5 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const ICONO_INZOOM = (
  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <rect x="3" y="3" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <rect x="7" y="7" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
// Unfold canonico: caja padre arriba con triangulo de despliegue (agregacion)
// emanando hacia abajo, indicando refinadores fuera del contorno.
const ICONO_UNFOLD = (
  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <rect x="6" y="2" width="8" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 9 L10 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M7 17 L13 17 L10 12 Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);
const ICONO_EDITAR_ALIAS = (
  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
    <path d="M3 16 L4 13 L13 4 L16 7 L7 16 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M11 6 L14 9" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

interface Props {
  inspectorAbierto: boolean;
  onToggleInspector: () => void;
  onAbrirInspector: () => void;
}

interface AnchorRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface PosicionBarra {
  x: number;
  y: number;
  placement: "arriba" | "abajo";
}

interface ViewportBarra {
  width: number;
  height: number;
  padding?: number;
}

interface AccionBarra {
  id: AccionBarraId;
  label: string;
  testId: string;
  visible: boolean;
  enabled: boolean;
  icon?: preact.JSX.Element;
  texto?: string;
}

type AccionBarraId =
  | "copiar-estilo"
  | "pegar-estilo"
  | "agregar-estado"
  | "inzoom"
  | "unfold"
  | "editar-alias"
  | "editar-imagen"
  | "mas-opciones";

const ACCIONES_BARRA_IDS = new Set<AccionContextualId>([
  "copiar-estilo",
  "pegar-estilo",
  "agregar-estado",
  "inzoom",
  "unfold",
  "editar-alias",
  "editar-imagen",
  "mas-opciones",
]);

const ICONOS_ACCION_BARRA: Partial<Record<AccionBarraId, preact.JSX.Element>> = {
  "agregar-estado": ICONO_AGREGAR_ESTADO,
  inzoom: ICONO_INZOOM,
  unfold: ICONO_UNFOLD,
  "editar-alias": ICONO_EDITAR_ALIAS,
};

const ALTO_BARRA = 44;
const ANCHO_BOTON = 34;
const GAP_BOTONES = 4;
const PADDING_BARRA = 6;
const OFFSET_ANCHOR = 8;
const PADDING_VIEWPORT = 8;

export function BarraHerramientasElemento({ inspectorAbierto, onToggleInspector, onAbrirInspector }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const copiarEstiloEnlace = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloEnlace = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const agregarEstadoSmart = useOpmStore((s) => s.agregarEstadoSmart);
  const descomponer = useOpmStore((s) => s.descomponerSeleccionada);
  const desplegar = useOpmStore((s) => s.desplegarSeleccionada);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const [posicion, setPosicion] = useState<PosicionBarra | null>(null);

  const entidad = entidadSeleccionUnica(modelo, seleccionId, enlaceSeleccionId, seleccionados);
  const apariencia = entidad ? aparienciaActivaDeEntidad(modelo, opdActivoId, entidad.id) : null;
  const enlaceEstiloId = entidad ? primerEnlaceVisualDeEntidad(modelo, opdActivoId, entidad.id) : null;
  const acciones = useMemo(
    () => accionesPilotoBarra(entidad, enlaceEstiloId, !!enlaceEstiloPortapapeles, inspectorAbierto),
    [enlaceEstiloPortapapeles, enlaceEstiloId, entidad, inspectorAbierto],
  );
  const accionesVisibles = acciones.filter((accion) => accion.visible);

  useEffect(() => {
    if (!apariencia || accionesVisibles.length === 0) {
      setPosicion(null);
      return;
    }
    let cancelado = false;
    const actualizarPosicion = () => {
      if (cancelado) return;
      const bbox = bboxAparienciaJoint(apariencia.id);
      const contenedor = contenedorCanvas();
      if (!bbox || !contenedor) {
        setPosicion(null);
        return;
      }
      const base = rectRelativoAContenedor(bbox, contenedor);
      setPosicion(posicionarBarraConColisiones(base, {
        width: contenedor.width,
        height: contenedor.height,
      }, anchoEstimadoBarra(accionesVisibles.length)));
    };
    const onFrame = () => requestAnimationFrame(actualizarPosicion);
    actualizarPosicion();
    window.addEventListener("resize", onFrame);
    window.addEventListener("scroll", onFrame, true);
    const pane = document.querySelector<HTMLElement>('[data-testid="canvas-pane"]');
    pane?.addEventListener("wheel", onFrame, { passive: true });
    return () => {
      cancelado = true;
      window.removeEventListener("resize", onFrame);
      window.removeEventListener("scroll", onFrame, true);
      pane?.removeEventListener("wheel", onFrame);
    };
  }, [accionesVisibles.length, apariencia, modelo, opdActivoId]);

  if (!entidad || !posicion) return null;

  const handleCopiarEstilo = () => {
    if (!enlaceEstiloId) return;
    copiarEstiloEnlace(enlaceEstiloId);
  };
  const handlePegarEstilo = () => {
    if (!enlaceEstiloId) return;
    pegarEstiloEnlace(enlaceEstiloId);
  };
  const handleAgregarEstado = () => {
    if (entidad.tipo !== "objeto") return;
    agregarEstadoSmart();
  };
  const handleInzoom = () => {
    descomponer();
  };
  const handleUnfold = () => {
    desplegar();
  };
  const handleEditarAlias = () => {
    if (entidad.tipo !== "objeto") return;
    onAbrirInspector();
    enfocarSeccionInspector("inspector-seccion-alias");
  };
  const handleEditarImagen = () => {
    if (entidad.tipo !== "objeto") return;
    abrirModalImagen(entidad.id);
  };
  const handleMasOpciones = () => {
    onToggleInspector();
  };

  const handlers: Record<AccionBarraId, () => void> = {
    "copiar-estilo": handleCopiarEstilo,
    "pegar-estilo": handlePegarEstilo,
    "agregar-estado": handleAgregarEstado,
    inzoom: handleInzoom,
    unfold: handleUnfold,
    "editar-alias": handleEditarAlias,
    "editar-imagen": handleEditarImagen,
    "mas-opciones": handleMasOpciones,
  };

  return (
    <div
      aria-label={`Barra de acciones de ${entidad.nombre}`}
      data-placement={posicion.placement}
      data-testid="barra-herramientas-elemento"
      style={{
        ...styles.barra,
        left: `${posicion.x}px`,
        top: `${posicion.y}px`,
      }}
    >
      {accionesVisibles.map((accion) => (
        <button
          key={accion.id}
          type="button"
          aria-label={accion.label}
          aria-pressed={accion.id === "mas-opciones" ? inspectorAbierto : undefined}
          data-testid={accion.testId}
          disabled={!accion.enabled}
          onClick={handlers[accion.id]}
          style={accion.enabled ? styles.boton : styles.botonDeshabilitado}
          title={accion.label}
        >
          {accion.icon ? accion.icon : <span aria-hidden="true">{accion.texto}</span>}
        </button>
      ))}
    </div>
  );
}

export function entidadSeleccionUnica(
  modelo: Modelo,
  seleccionId: Id | null,
  enlaceSeleccionId: Id | null,
  seleccionados: readonly Id[],
): Entidad | null {
  if (enlaceSeleccionId) return null;
  if (!seleccionId) return null;
  if (seleccionados.length !== 1 || seleccionados[0] !== seleccionId) return null;
  return modelo.entidades[seleccionId] ?? null;
}

export function aparienciaActivaDeEntidad(modelo: Modelo, opdActivoId: Id, entidadId: Id) {
  const opd = modelo.opds[opdActivoId];
  if (!opd) return null;
  return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId) ?? null;
}

export function endpointPerteneceAEntidad(modelo: Modelo, entidadId: Id, extremo: { kind: string; id: Id }): boolean {
  if (extremo.kind === "entidad") return extremo.id === entidadId;
  if (extremo.kind === "estado") return modelo.estados[extremo.id]?.entidadId === entidadId;
  return false;
}

export function primerEnlaceVisualDeEntidad(modelo: Modelo, opdActivoId: Id, entidadId: Id): Id | null {
  const opd = modelo.opds[opdActivoId];
  if (!opd) return null;
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    if (
      endpointPerteneceAEntidad(modelo, entidadId, enlace.origenId) ||
      endpointPerteneceAEntidad(modelo, entidadId, enlace.destinoId)
    ) return enlace.id;
  }
  return null;
}

export function accionesPilotoBarra(
  entidad: Entidad | null,
  enlaceEstiloId: Id | null,
  hayEstiloEnPortapapeles: boolean,
  inspectorAbierto: boolean,
): AccionBarra[] {
  return accionesContextualesEntidad({
    entidad,
    enlaceEstiloId,
    hayEstiloEnPortapapeles,
    inspectorAbierto,
    multi: false,
  })
    .filter(esAccionBarra)
    .map(decorarAccionBarra);
}

function esAccionBarra(accion: AccionContextual): accion is AccionContextual & { id: AccionBarraId } {
  return ACCIONES_BARRA_IDS.has(accion.id);
}

function decorarAccionBarra(accion: AccionContextual & { id: AccionBarraId }): AccionBarra {
  const icon = ICONOS_ACCION_BARRA[accion.id];
  return {
    id: accion.id,
    label: accion.label,
    testId: accion.testId,
    enabled: accion.enabled,
    visible: accion.visible,
    ...(icon ? { icon } : {}),
    ...(accion.texto ? { texto: accion.texto } : {}),
  };
}

export function anchoEstimadoBarra(cantidadBotones: number): number {
  if (cantidadBotones <= 0) return 0;
  return PADDING_BARRA * 2 + cantidadBotones * ANCHO_BOTON + (cantidadBotones - 1) * GAP_BOTONES;
}

export function posicionarBarraConColisiones(
  bbox: AnchorRect,
  viewport: ViewportBarra,
  anchoBarra = anchoEstimadoBarra(7),
): PosicionBarra {
  const padding = viewport.padding ?? PADDING_VIEWPORT;
  const xIdeal = bbox.left + bbox.width / 2 - anchoBarra / 2;
  const maxX = Math.max(padding, viewport.width - anchoBarra - padding);
  const x = limitar(xIdeal, padding, maxX);
  const yArriba = bbox.top - ALTO_BARRA - OFFSET_ANCHOR;
  if (yArriba >= padding) return { x, y: yArriba, placement: "arriba" };
  const yAbajo = bbox.bottom + OFFSET_ANCHOR;
  const maxY = Math.max(padding, viewport.height - ALTO_BARRA - padding);
  return { x, y: limitar(yAbajo, padding, maxY), placement: "abajo" };
}

export function rectRelativoAContenedor(rect: AnchorRect, contenedor: AnchorRect): AnchorRect {
  const left = rect.left - contenedor.left;
  const top = rect.top - contenedor.top;
  return {
    left,
    top,
    right: left + rect.width,
    bottom: top + rect.height,
    width: rect.width,
    height: rect.height,
  };
}

export function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(Math.max(valor, minimo), maximo);
}

function bboxAparienciaJoint(aparienciaId: Id): AnchorRect | null {
  const adapter = (globalThis as { __opmJointAdapter?: { graph: dia.Graph; paper: dia.Paper } }).__opmJointAdapter;
  const cell = adapter?.graph.getCell(aparienciaId);
  if (!adapter || !cell) return null;
  const view = adapter.paper.findViewByModel(cell);
  const el = (view as unknown as { el?: Element } | undefined)?.el;
  return el?.getBoundingClientRect() ?? null;
}

function contenedorCanvas(): AnchorRect | null {
  return document.querySelector('[data-testid="canvas-pane"]')?.getBoundingClientRect() ?? null;
}

function enfocarSeccionInspector(testId: string): void {
  window.setTimeout(() => {
    const seccion = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
    const foco = seccion?.querySelector<HTMLElement>("input, textarea, button, select");
    foco?.focus();
    seccion?.scrollIntoView({ block: "nearest" });
  }, 0);
}

const styles = {
  barra: {
    position: "absolute",
    zIndex: 12,
    display: "flex",
    alignItems: "center",
    gap: `${GAP_BOTONES}px`,
    height: `${ALTO_BARRA}px`,
    padding: `${PADDING_BARRA}px`,
    border: `1px solid color-mix(in srgb, ${colors.chromeNeutral} 28%, white)`,
    borderRadius: "6px",
    background: "white",
    boxShadow: "0 12px 30px rgb(15 23 42 / 0.16)",
    pointerEvents: "auto",
  },
  boton: {
    width: `${ANCHO_BOTON}px`,
    height: `${ANCHO_BOTON}px`,
    minWidth: `${ANCHO_BOTON}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid color-mix(in srgb, ${colors.chromeNeutral} 30%, white)`,
    borderRadius: "4px",
    background: "white",
    color: colors.acentoSecundario,
    fontFamily: "Arial, sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: 1,
    cursor: "pointer",
  },
  botonDeshabilitado: {
    width: `${ANCHO_BOTON}px`,
    height: `${ANCHO_BOTON}px`,
    minWidth: `${ANCHO_BOTON}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid color-mix(in srgb, ${colors.chromeNeutral} 16%, white)`,
    borderRadius: "4px",
    background: "color-mix(in srgb, white 86%, transparent)",
    color: "color-mix(in srgb, currentColor 45%, white)",
    fontFamily: "Arial, sans-serif",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: 1,
    cursor: "not-allowed",
    opacity: 0.52,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
