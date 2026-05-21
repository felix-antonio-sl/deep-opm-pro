import type { dia } from "jointjs";
import { useEffect, useMemo, useState } from "preact/hooks";
import { useBarraHerramientasElementoViewModel } from "../app/viewmodels/barraHerramientasElementoViewModel";
import type { Enlace, Entidad, Id, Modelo } from "../modelo/tipos";
import { leerBBoxCell, useBboxTracker, type OverlayBBox } from "../render/jointjs/overlayCanvas/useBboxTracker";
import {
  accionesContextualesEntidad,
  accionesParaSuperficie,
  type AccionContextual,
  type AccionContextualId,
} from "../store/acciones-contextuales";
import { useCanvasPaper } from "./CanvasAdapterContext";
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
  wide?: boolean;
  /**
   * Ronda24 L5 #9: cuando true, el botón muestra ícono + texto corto visible
   * lado a lado (no sólo tooltip). Requiere ancho extra; se asigna a las
   * acciones contextuales primarias de entidad para mejorar legibilidad sin
   * esperar hover.
   */
  compactaIconoTexto?: boolean;
  icon?: preact.JSX.Element;
  texto?: string;
  atajo?: string;
}

type AccionBarraId =
  | "cambiar-tipo-enlace"
  | "copiar-estilo"
  | "pegar-estilo"
  | "agregar-estado"
  | "inzoom"
  | "unfold"
  | "editar-alias"
  | "editar-imagen"
  | "eliminar-seleccion"
  | "agregar-como-partes"
  | "traer-enlaces"
  | "alinear-seleccion"
  | "distribuir-seleccion"
  | "mas-opciones";

const ORDEN_ACCIONES_BARRA: readonly AccionBarraId[] = [
  "inzoom",
  "unfold",
  "agregar-estado",
  "editar-imagen",
  "editar-alias",
  "mas-opciones",
];

const ORDEN_ACCIONES_BARRA_ENLACE: readonly AccionBarraId[] = [
  "cambiar-tipo-enlace",
  "copiar-estilo",
  "pegar-estilo",
  "mas-opciones",
];

const ORDEN_ACCIONES_BARRA_MULTI: readonly AccionBarraId[] = [
  "eliminar-seleccion",
  "agregar-como-partes",
  "traer-enlaces",
  "alinear-seleccion",
  "distribuir-seleccion",
  "mas-opciones",
];

const ACCIONES_BARRA_IDS = new Set<AccionContextualId>(ORDEN_ACCIONES_BARRA);
for (const id of ORDEN_ACCIONES_BARRA_ENLACE) ACCIONES_BARRA_IDS.add(id);
for (const id of ORDEN_ACCIONES_BARRA_MULTI) ACCIONES_BARRA_IDS.add(id);

const ICONOS_ACCION_BARRA: Partial<Record<AccionBarraId, preact.JSX.Element>> = {
  "agregar-estado": ICONO_AGREGAR_ESTADO,
  inzoom: ICONO_INZOOM,
  unfold: ICONO_UNFOLD,
  "editar-alias": ICONO_EDITAR_ALIAS,
};

const ALTO_BARRA = 44;
const ANCHO_BOTON = 34;
const ANCHO_BOTON_TEXTO = 76;
// Ronda24 L5 #9: botón icono+texto-corto visible (Descomp., Desplegar, Alias).
// Calibrado para que el texto más largo ("Desplegar") + ícono + gap caiba sin
// ellipsis a 11px Arial bold.
const ANCHO_BOTON_ICONO_TEXTO = 92;
const GAP_BOTONES = 4;
const GAP_ICONO_TEXTO = 4;
const PADDING_BARRA = 6;
const OFFSET_ANCHOR = 8;
const PADDING_VIEWPORT = 8;
const ANCHO_RESUMEN_MULTI = 116;
const ANCHO_RESUMEN_ENLACE = 116;

// Ronda24 L5 #9: textos visibles cortos para las acciones contextuales
// primarias de entidad. El catálogo central conserva `label` largo (usado en
// aria-label y title) y la mini-toolbar agrega aquí el texto compacto que
// renderiza junto al ícono. No afecta menu contextual ni command palette.
const TEXTOS_VISIBLES_CONTEXTUALES: Partial<Record<AccionBarraId, string>> = {
  inzoom: "Descomp.",
  unfold: "Desplegar",
  "editar-alias": "Alias",
};

export function BarraHerramientasElemento({ inspectorAbierto, onToggleInspector, onAbrirInspector }: Props) {
  const {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    enlaceEstiloPortapapeles,
    agregarEstadoSmart,
    descomponer,
    desplegar,
    abrirModalImagen,
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    alinearSeleccion,
    distribuirSeleccion,
  } = useBarraHerramientasElementoViewModel();
  const [posicion, setPosicion] = useState<PosicionBarra | null>(null);
  const paper = useCanvasPaper();

  const contextoSeleccion = useMemo(
    () => resolverContextoBarra(modelo, opdActivoId, seleccionId, enlaceSeleccionId, seleccionados),
    [enlaceSeleccionId, modelo, opdActivoId, seleccionId, seleccionados],
  );
  const entidad = contextoSeleccion?.tipo === "entidad" ? contextoSeleccion.entidad : null;
  const enlace = contextoSeleccion?.tipo === "enlace" ? contextoSeleccion.enlace : null;
  const acciones = useMemo(
    () => accionesParaContextoBarra(contextoSeleccion, !!enlaceEstiloPortapapeles, inspectorAbierto),
    [enlaceEstiloPortapapeles, contextoSeleccion, inspectorAbierto],
  );
  const accionesVisibles = useMemo(() => acciones.filter((accion) => accion.visible), [acciones]);
  const anchoBarraAcciones = useMemo(
    () => anchoEstimadoControlesBarra(
      accionesVisibles,
      contextoSeleccion?.tipo === "multi",
      contextoSeleccion?.tipo === "enlace",
    ),
    [accionesVisibles, contextoSeleccion?.tipo],
  );
  const primaryCellId = contextoSeleccion?.anchorCellIds[0] ?? null;
  const primaryBBox = useBboxTracker(paper, primaryCellId);

  useEffect(() => {
    if (!paper || !contextoSeleccion || !primaryBBox || accionesVisibles.length === 0) {
      setPosicion(null);
      return;
    }
    let cancelado = false;
    const actualizarPosicion = () => {
      if (cancelado) return;
      const bbox = leerBboxOverlayCells(paper, contextoSeleccion.anchorCellIds);
      const viewport = viewportDePaper(paper);
      if (!bbox || !viewport || !rectVisibleEnViewport(bbox, viewport)) {
        setPosicion(null);
        return;
      }
      const base = rectOverlayAViewport(bbox, viewport);
      setPosicion(posicionarBarraConColisiones(base, {
        width: viewport.clientWidth,
        height: viewport.clientHeight,
      }, anchoBarraAcciones));
    };
    const onFrame = () => requestAnimationFrame(actualizarPosicion);
    actualizarPosicion();
    window.addEventListener("resize", onFrame);
    const viewport = viewportDePaper(paper);
    viewport?.addEventListener("scroll", onFrame, { passive: true });
    return () => {
      cancelado = true;
      window.removeEventListener("resize", onFrame);
      viewport?.removeEventListener("scroll", onFrame);
    };
  }, [accionesVisibles.length, anchoBarraAcciones, contextoSeleccion, modelo, opdActivoId, paper, primaryBBox]);

  if (!contextoSeleccion || !posicion) return null;

  const handleAgregarEstado = () => {
    if (!entidad) return;
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
    if (!entidad) return;
    onAbrirInspector();
    enfocarSeccionInspector("inspector-seccion-alias");
  };
  const handleEditarImagen = () => {
    if (!entidad) return;
    if (entidad.tipo !== "objeto") return;
    abrirModalImagen(entidad.id);
  };
  const handleMasOpciones = () => {
    onToggleInspector();
  };
  const handleCambiarTipoEnlace = () => {
    if (!enlace) return;
    onAbrirInspector();
    enfocarSeccionInspector("inspector-enlace-tab-propiedades");
  };
  const handleCopiarEstilo = () => {
    if (!enlace) return;
    copiarEstiloEnlaceAlPortapapeles(enlace.id);
  };
  const handlePegarEstilo = () => {
    if (!enlace) return;
    pegarEstiloEnlaceDesdePortapapeles(enlace.id);
  };
  const handleEliminarSeleccion = () => {
    eliminarSeleccion();
  };
  const handleAgregarComoPartes = () => {
    if (seleccionados.length < 2) return;
    const todo = seleccionados[seleccionados.length - 1];
    if (todo) conectarSeleccionAlTodo(todo, "agregacion");
  };
  const handleTraerEnlaces = () => {
    traerEnlacesEntreSeleccionadas();
  };
  const handleAlinearSeleccion = () => {
    alinearSeleccion("izq");
  };
  const handleDistribuirSeleccion = () => {
    distribuirSeleccion("horizontal");
  };

  const handlers: Record<AccionBarraId, () => void> = {
    "cambiar-tipo-enlace": handleCambiarTipoEnlace,
    "copiar-estilo": handleCopiarEstilo,
    "pegar-estilo": handlePegarEstilo,
    "agregar-estado": handleAgregarEstado,
    inzoom: handleInzoom,
    unfold: handleUnfold,
    "editar-alias": handleEditarAlias,
    "editar-imagen": handleEditarImagen,
    "eliminar-seleccion": handleEliminarSeleccion,
    "agregar-como-partes": handleAgregarComoPartes,
    "traer-enlaces": handleTraerEnlaces,
    "alinear-seleccion": handleAlinearSeleccion,
    "distribuir-seleccion": handleDistribuirSeleccion,
    "mas-opciones": handleMasOpciones,
  };

  return (
    <div
      aria-label={ariaLabelBarra(contextoSeleccion)}
      data-placement={posicion.placement}
      data-testid="barra-herramientas-elemento"
      role="toolbar"
      style={{
        ...styles.barra,
        left: `${posicion.x}px`,
        top: `${posicion.y}px`,
      }}
    >
      <span aria-live="polite" data-testid="barra-live-region" style={styles.srOnly}>
        {textoLiveBarra(contextoSeleccion)}
      </span>
      {contextoSeleccion.tipo === "multi" ? (
        <span data-testid="barra-resumen-multiseleccion" style={styles.resumenMulti}>
          {contextoSeleccion.cantidad} seleccionadas
        </span>
      ) : null}
      {contextoSeleccion.tipo === "enlace" ? (
        <span data-testid="barra-resumen-enlace" style={styles.resumenEnlace}>
          {textoResumenEnlaceBarra(contextoSeleccion.enlace)}
        </span>
      ) : null}
      {accionesVisibles.map((accion) => (
        <button
          key={accion.id}
          type="button"
          aria-label={accion.label}
          aria-keyshortcuts={atajoAria(accion.atajo)}
          aria-pressed={accion.id === "mas-opciones" ? inspectorAbierto : undefined}
          data-testid={accion.testId}
          disabled={!accion.enabled}
          onClick={handlers[accion.id]}
          style={estiloBotonAccion(accion)}
          title={tituloAccionBarra(accion)}
        >
          {accion.icon ? accion.icon : null}
          {accion.icon && accion.texto ? (
            <span aria-hidden="true" style={styles.botonTexto}>{accion.texto}</span>
          ) : null}
          {!accion.icon && accion.texto ? (
            <span aria-hidden="true">{accion.texto}</span>
          ) : null}
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

export type ContextoBarraSeleccion =
  | {
      tipo: "entidad";
      entidad: Entidad;
      nombre: string;
      anchorCellIds: readonly Id[];
      enlaceEstiloId: Id | null;
    }
  | {
      tipo: "enlace";
      enlace: Enlace;
      nombre: string;
      anchorCellIds: readonly Id[];
      enlaceEstiloId: Id;
    }
  | {
      tipo: "multi";
      cantidad: number;
      nombre: string;
      anchorCellIds: readonly Id[];
      enlaceEstiloId: null;
    };

export function resolverContextoBarra(
  modelo: Modelo,
  opdActivoId: Id,
  seleccionId: Id | null,
  enlaceSeleccionId: Id | null,
  seleccionados: readonly Id[],
): ContextoBarraSeleccion | null {
  if (seleccionados.length >= 2) {
    const anchorCellIds = seleccionados.flatMap((id) => {
      const cellId = cellIdActivoDeSeleccion(modelo, opdActivoId, id);
      return cellId ? [cellId] : [];
    });
    if (anchorCellIds.length === 0) return null;
    return {
      tipo: "multi",
      cantidad: seleccionados.length,
      nombre: `${seleccionados.length} seleccionadas`,
      anchorCellIds,
      enlaceEstiloId: null,
    };
  }
  const entidad = entidadSeleccionUnica(modelo, seleccionId, enlaceSeleccionId, seleccionados);
  if (entidad) {
    const apariencia = aparienciaActivaDeEntidad(modelo, opdActivoId, entidad.id);
    if (!apariencia) return null;
    return {
      tipo: "entidad",
      entidad,
      nombre: entidad.nombre,
      anchorCellIds: [apariencia.id],
      enlaceEstiloId: primerEnlaceVisualDeEntidad(modelo, opdActivoId, entidad.id),
    };
  }
  const enlace = enlaceSeleccionUnico(modelo, enlaceSeleccionId, seleccionados);
  if (!enlace) return null;
  const apariencia = aparienciaActivaDeEnlace(modelo, opdActivoId, enlace.id);
  if (!apariencia) return null;
  return {
    tipo: "enlace",
    enlace,
    nombre: `enlace ${enlace.tipo}`,
    anchorCellIds: [apariencia.id],
    enlaceEstiloId: enlace.id,
  };
}

export function cellIdActivoDeSeleccion(modelo: Modelo, opdActivoId: Id, id: Id): Id | null {
  if (modelo.entidades[id]) return aparienciaActivaDeEntidad(modelo, opdActivoId, id)?.id ?? null;
  if (modelo.enlaces[id]) return aparienciaActivaDeEnlace(modelo, opdActivoId, id)?.id ?? null;
  return null;
}

export function enlaceSeleccionUnico(
  modelo: Modelo,
  enlaceSeleccionId: Id | null,
  seleccionados: readonly Id[],
): Enlace | null {
  if (!enlaceSeleccionId) return null;
  if (seleccionados.length !== 1 || seleccionados[0] !== enlaceSeleccionId) return null;
  return modelo.enlaces[enlaceSeleccionId] ?? null;
}

export function aparienciaActivaDeEntidad(modelo: Modelo, opdActivoId: Id, entidadId: Id) {
  const opd = modelo.opds[opdActivoId];
  if (!opd) return null;
  return Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === entidadId) ?? null;
}

export function aparienciaActivaDeEnlace(modelo: Modelo, opdActivoId: Id, enlaceId: Id) {
  const opd = modelo.opds[opdActivoId];
  if (!opd) return null;
  return Object.values(opd.enlaces).find((apariencia) => apariencia.enlaceId === enlaceId) ?? null;
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
  const acciones = accionesContextualesEntidad({
    entidad,
    enlaceEstiloId,
    hayEstiloEnPortapapeles,
    inspectorAbierto,
    multi: false,
  });
  return accionesBarraOrdenadas(acciones, ORDEN_ACCIONES_BARRA);
}

export function accionesBarraEnlace(
  enlace: Enlace | null,
  hayEstiloEnPortapapeles: boolean,
  inspectorAbierto: boolean,
): AccionBarra[] {
  const acciones = accionesContextualesEntidad({
    entidad: null,
    enlace,
    enlaceEstiloId: enlace?.id ?? null,
    hayEstiloEnPortapapeles,
    inspectorAbierto,
    multi: false,
  });
  return accionesBarraOrdenadas(acciones, ORDEN_ACCIONES_BARRA_ENLACE);
}

function accionesParaContextoBarra(
  contexto: ContextoBarraSeleccion | null,
  hayEstiloEnPortapapeles: boolean,
  inspectorAbierto: boolean,
): AccionBarra[] {
  if (!contexto) return [];
  if (contexto.tipo === "enlace") return accionesBarraEnlace(contexto.enlace, hayEstiloEnPortapapeles, inspectorAbierto);
  if (contexto.tipo === "multi") return accionesBarraMulti(contexto.cantidad, inspectorAbierto);
  return accionesPilotoBarra(contexto.entidad, contexto.enlaceEstiloId, hayEstiloEnPortapapeles, inspectorAbierto);
}

export function accionesBarraMulti(cantidad: number, inspectorAbierto: boolean): AccionBarra[] {
  if (cantidad < 2) return [];
  const acciones = accionesContextualesEntidad({
    entidad: null,
    enlace: null,
    enlaceEstiloId: null,
    hayEstiloEnPortapapeles: false,
    inspectorAbierto,
    multi: cantidad >= 2,
    seleccionadosCount: cantidad,
  });
  return accionesBarraOrdenadas(acciones, ORDEN_ACCIONES_BARRA_MULTI);
}

function accionesBarraOrdenadas(
  acciones: readonly AccionContextual[],
  orden: readonly AccionBarraId[],
): AccionBarra[] {
  const porId = new Map(
    accionesParaSuperficie(acciones, "barra-flotante")
      .filter(esAccionBarra)
      .map((accion) => [accion.id, accion] as const),
  );
  return orden.flatMap((id) => {
    const accion = porId.get(id);
    return accion ? [decorarAccionBarra(accion)] : [];
  });
}

function esAccionBarra(accion: AccionContextual): accion is AccionContextual & { id: AccionBarraId } {
  return ACCIONES_BARRA_IDS.has(accion.id);
}

function decorarAccionBarra(accion: AccionContextual & { id: AccionBarraId }): AccionBarra {
  const icon = ICONOS_ACCION_BARRA[accion.id];
  // Ronda24 L5 #9: texto compacto visible para acciones contextuales con ícono.
  // El override solo aplica si el catálogo no trajo un `texto` propio y la
  // acción está en `TEXTOS_VISIBLES_CONTEXTUALES`.
  const textoOverride = !accion.texto ? TEXTOS_VISIBLES_CONTEXTUALES[accion.id] : undefined;
  const textoFinal = accion.texto ?? textoOverride;
  const compactaIconoTexto = !!icon && !!textoOverride;
  return {
    id: accion.id,
    label: accion.label,
    testId: accion.testId,
    enabled: accion.enabled,
    visible: accion.visible,
    ...(accion.atajo ? { atajo: accion.atajo } : {}),
    wide: accion.id === "cambiar-tipo-enlace" ||
      accion.id === "copiar-estilo" ||
      accion.id === "pegar-estilo" ||
      accion.id === "mas-opciones" ||
      accion.id === "eliminar-seleccion" ||
      accion.id === "agregar-como-partes" ||
      accion.id === "traer-enlaces" ||
      accion.id === "alinear-seleccion" ||
      accion.id === "distribuir-seleccion",
    ...(compactaIconoTexto ? { compactaIconoTexto: true } : {}),
    ...(icon ? { icon } : {}),
    ...(textoFinal ? { texto: textoFinal } : {}),
  };
}

export function ariaLabelBarra(contexto: ContextoBarraSeleccion): string {
  if (contexto.tipo === "multi") return `Acciones sobre selección múltiple: ${contexto.cantidad} cosas`;
  return `Acciones sobre ${contexto.nombre}`;
}

export function textoLiveBarra(contexto: ContextoBarraSeleccion): string {
  if (contexto.tipo === "multi") return `Selección múltiple: ${contexto.cantidad} cosas`;
  if (contexto.tipo === "enlace") return `Enlace seleccionado: ${contexto.enlace.tipo}`;
  return `Cosa seleccionada: ${contexto.nombre}`;
}

export function textoResumenEnlaceBarra(enlace: Enlace): string {
  return `Enlace: ${labelTipoEnlaceBarra(enlace.tipo)}`;
}

function labelTipoEnlaceBarra(tipo: Enlace["tipo"]): string {
  const labels: Record<Enlace["tipo"], string> = {
    agregacion: "Agregación",
    exhibicion: "Exhibición",
    generalizacion: "Generalización",
    clasificacion: "Clasificación",
    etiquetado: "Etiquetado",
    etiquetadoBidireccional: "Etiquetado",
    agente: "Agente",
    instrumento: "Instrumento",
    consumo: "Consumo",
    resultado: "Resultado",
    efecto: "Efecto",
    invocacion: "Invocación",
    excepcionSobretiempo: "Excepción sobretiempo",
    excepcionSubtiempo: "Excepción subtiempo",
    excepcionSubSobretiempo: "Excepción sub/sobretiempo",
  };
  return labels[tipo];
}

export function atajoAria(atajo: string | undefined): string | undefined {
  if (!atajo) return undefined;
  return atajo
    .replaceAll("Ctrl", "Control")
    .replaceAll("⌘", "Meta")
    .replaceAll("⇧", "Shift")
    .replaceAll("⌥", "Alt")
    .replaceAll("⌫", "Delete");
}

function tituloAccionBarra(accion: AccionBarra): string {
  return accion.atajo ? `${accion.label} (${accion.atajo})` : accion.label;
}

export function anchoEstimadoBarra(cantidadBotones: number): number {
  if (cantidadBotones <= 0) return 0;
  return PADDING_BARRA * 2 + cantidadBotones * ANCHO_BOTON + (cantidadBotones - 1) * GAP_BOTONES;
}

export function anchoEstimadoAccionesBarra(acciones: readonly AccionBarra[]): number {
  if (acciones.length <= 0) return 0;
  const botones = acciones.reduce((total, accion) => total + anchoBotonAccion(accion), 0);
  return PADDING_BARRA * 2 + botones + (acciones.length - 1) * GAP_BOTONES;
}

function anchoBotonAccion(accion: AccionBarra): number {
  if (accion.compactaIconoTexto) return ANCHO_BOTON_ICONO_TEXTO;
  if (accion.wide) return ANCHO_BOTON_TEXTO;
  return ANCHO_BOTON;
}

export function anchoEstimadoControlesBarra(
  acciones: readonly AccionBarra[],
  conResumenMulti: boolean,
  conResumenEnlace = false,
): number {
  const anchoAcciones = anchoEstimadoAccionesBarra(acciones);
  if (acciones.length === 0) return anchoAcciones;
  if (conResumenMulti) return anchoAcciones + ANCHO_RESUMEN_MULTI + GAP_BOTONES;
  if (conResumenEnlace) return anchoAcciones + ANCHO_RESUMEN_ENLACE + GAP_BOTONES;
  return anchoAcciones;
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

export function leerBboxOverlayCells(paper: dia.Paper, cellIds: readonly Id[]): OverlayBBox | null {
  return unirBboxesOverlay(cellIds.flatMap((cellId) => {
    const bbox = leerBBoxCell(paper, cellId);
    return bbox ? [bbox] : [];
  }));
}

export function unirBboxesOverlay(rects: readonly OverlayBBox[]): OverlayBBox | null {
  if (rects.length === 0) return null;
  const x = Math.min(...rects.map((rect) => rect.x));
  const y = Math.min(...rects.map((rect) => rect.y));
  const right = Math.max(...rects.map((rect) => rect.x + rect.width));
  const bottom = Math.max(...rects.map((rect) => rect.y + rect.height));
  return { x, y, width: right - x, height: bottom - y };
}

export function rectOverlayAViewport(rect: OverlayBBox, viewport: Pick<HTMLElement, "scrollLeft" | "scrollTop">): AnchorRect {
  const left = rect.x - viewport.scrollLeft;
  const top = rect.y - viewport.scrollTop;
  return {
    left,
    top,
    right: left + rect.width,
    bottom: top + rect.height,
    width: rect.width,
    height: rect.height,
  };
}

export function rectVisibleEnViewport(rect: OverlayBBox, viewport: Pick<HTMLElement, "scrollLeft" | "scrollTop" | "clientWidth" | "clientHeight">): boolean {
  const left = rect.x;
  const top = rect.y;
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  const visibleLeft = viewport.scrollLeft;
  const visibleTop = viewport.scrollTop;
  const visibleRight = visibleLeft + viewport.clientWidth;
  const visibleBottom = visibleTop + viewport.clientHeight;
  return right > visibleLeft && left < visibleRight && bottom > visibleTop && top < visibleBottom;
}

function viewportDePaper(paper: dia.Paper): HTMLElement | null {
  const el = (paper as unknown as { el?: Element }).el;
  return el?.closest<HTMLElement>('[role="img"][aria-label="OPD activo"]') ?? null;
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
  resumenMulti: {
    width: `${ANCHO_RESUMEN_MULTI}px`,
    minWidth: `${ANCHO_RESUMEN_MULTI}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.textoPrimario,
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1,
    whiteSpace: "nowrap",
  },
  resumenEnlace: {
    width: `${ANCHO_RESUMEN_ENLACE}px`,
    minWidth: `${ANCHO_RESUMEN_ENLACE}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.textoPrimario,
    fontFamily: "Arial, sans-serif",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1,
    whiteSpace: "nowrap",
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
  // Ronda24 L5 #9: texto visible junto al ícono en acciones compactas. Sin
  // ellipsis: el ancho está pre-calculado para que el label más largo
  // ("Desplegar") quepa completo.
  botonTexto: {
    fontFamily: "Arial, sans-serif",
    fontSize: "11px",
    fontWeight: 600,
    lineHeight: 1,
    whiteSpace: "nowrap",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function estiloBotonAccion(accion: AccionBarra): preact.JSX.CSSProperties {
  const base = accion.enabled ? styles.boton : styles.botonDeshabilitado;
  if (accion.compactaIconoTexto) {
    return {
      ...base,
      width: `${ANCHO_BOTON_ICONO_TEXTO}px`,
      minWidth: `${ANCHO_BOTON_ICONO_TEXTO}px`,
      gap: `${GAP_ICONO_TEXTO}px`,
    };
  }
  if (accion.wide) return { ...base, width: `${ANCHO_BOTON_TEXTO}px`, minWidth: `${ANCHO_BOTON_TEXTO}px` };
  return base;
}
