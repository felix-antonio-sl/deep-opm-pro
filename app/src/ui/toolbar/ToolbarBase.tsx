/**
 * ViewContainer ToolbarBase: chrome estable del modelador. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-12.
 *
 * BUG-20260601T164807Z-b5a202: los botones visibles dedicados a abrir la
 * paleta de comandos salen del chrome. La paleta se conserva como entrada
 * de teclado global `Ctrl/Cmd+K`; los comandos no se duplican como botón.
 */
import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import objectDragIcon from "../../../../assets/svg/objectDrag.svg";
import { useToolbarBaseViewModel } from "../../app/viewmodels/toolbarBaseViewModel";
import type { Entidad, Id, TipoEnlace } from "../../modelo/tipos";
import type { JointCanvasAdapter } from "../../render/jointjs/jointCanvasAdapter";
import type { AccionContextualId } from "../../store/acciones-contextuales";
import { primerEnlaceVisualDeEntidad } from "../BarraHerramientasElemento";
import { useCanvasAdapter } from "../CanvasAdapterContext";
import {
  clasificarVariante,
  detallarChip,
  formatearHoraGuardado,
  labelChip,
} from "../ChipPersistencia";
import { ejecutarAccionContextualEntidad } from "../ejecutarAccionContextual";
// L2 ronda 21: la toolbar primaria de modelado pesado se oculta en mobile
// y se compacta en tablet. Decisión por viewport delegada a `layoutResponsive`.
import { useBreakpoint } from "../layoutResponsive";
import { MenuContextualEnlace } from "../MenuContextualEnlace";
import { MenuContextualEstado } from "../MenuContextualEstado";
import { MenuContextualEntidad } from "../MenuContextualEntidad";
import { colors, stroke } from "../tokens";
import "./toolbar.css";
import { labelPersistenciaToolbar, ToolbarActionButton } from "./toolbarPrimitives";
import { dragAtributoNumerico, dragToolbar, toolbarStyle as style } from "./toolbarStyles";

/**
 * Codex v1.1: creadores inline con glifo de geometría OPM y stroke canónico.
 */
function GlyphObjeto(): preact.JSX.Element {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      style={style.glyph}
    >
      <rect
        x={stroke.base / 2}
        y={stroke.base / 2}
        width={12 - stroke.base}
        height={12 - stroke.base}
        fill="none"
        stroke={colors.opm.object}
        strokeWidth={stroke.opm.object}
      />
    </svg>
  );
}

function GlyphProceso(): preact.JSX.Element {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      style={style.glyph}
    >
      <ellipse
        cx={6}
        cy={6}
        rx={6 - stroke.base / 2}
        ry={4 - stroke.base / 2}
        fill="none"
        stroke={colors.opm.process}
        strokeWidth={stroke.opm.process}
      />
    </svg>
  );
}

function GlyphEstado(): preact.JSX.Element {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      style={style.glyph}
    >
      <path
        d="M6 1.5 10.5 6 6 10.5 1.5 6Z"
        fill="none"
        stroke={colors.opm.state}
        strokeWidth={stroke.opm.state}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

const DialogoTraerConectados = lazy(() => import("../DialogoTraerConectados").then((m) => ({ default: m.DialogoTraerConectados })));

/**
 * ViewContainer ToolbarBase: chrome estable. [JOYAS §1-3], [V-0c], IFML H-2/H-5.
 * Referencias semanticas verificadas: opm-extracted layout/header, element-tool-bar, main, opl-container.
 */
interface ToolbarBaseProps {
  children?: preact.ComponentChildren;
  modelarSlot?: preact.ComponentChildren;
  conectarSlot?: preact.ComponentChildren;
  statusSlot?: preact.ComponentChildren;
}

export function ToolbarBase({ children, modelarSlot, conectarSlot, statusSlot }: ToolbarBaseProps) {
  // P0-2 (informe UI/UX 2026-05-07): MenuPrincipal dejó de montarse en
  // ToolbarBase. El command palette se conserva por atajo global, sin botón
  // visible dedicado en este chrome.
  const {
    crearObjeto,
    crearProceso,
    crearAtributoNumerico,
    fijarModoCreacion,
    modelo,
    opdActivoId,
    seleccionId,
    seleccionados,
    modoEnlace,
    nuevaCosaPendiente,
    confirmarNombreNuevaCosa,
    descartarNuevaCosaPendiente,
    seleccionarEntidad,
    seleccionarEnlace,
    copiarEstiloEnlaceAlPortapapeles,
    pegarEstiloEnlaceDesdePortapapeles,
    enlaceEstiloPortapapeles,
    borrarEnlacesEnLote,
    conectarSeleccionAlTodo,
    iniciarAutosalvado,
    modoCreacion,
    readOnly,
    agregarEstadoSmart,
    persistencia,
  } = useToolbarBaseViewModel();
  // Ronda 19 L5: `dirty` ya no se lee directamente aqui; el estado de
  // persistencia inline lo consume desde el viewmodel.
  const [nombreNuevaCosa, setNombreNuevaCosa] = useState("");
  const [menuContextual, setMenuContextual] = useState<null | { enlaceId: Id; x: number; y: number }>(null);
  const [menuEntidad, setMenuEntidad] = useState<null | { aparienciaId: Id; entidadId: Id; x: number; y: number }>(null);
  // Paquete "Estados ciudadanos de primera clase" (2026-05-23): right-click
  // sobre cápsula dispara `opm:menu-contextual-estado`; el handler
  // `seleccion.ts` ya seleccionó el estado. Cerramos los otros menús para
  // mantener la exclusividad UX.
  const [menuEstado, setMenuEstado] = useState<null | { estadoId: Id; entidadId: Id; x: number; y: number }>(null);
  const canvasAdapter = useCanvasAdapter();
  // L2 ronda 21: viewport-aware toolbar. Mobile oculta clusters de modelado
  // pesado (Modelar/Conectar/Validar) y conserva sólo Modelo + Ayuda.
  // Tablet conserva todo pero cabrá mejor por la toolbar overflow existente.
  const breakpoint = useBreakpoint();
  const esMobile = breakpoint === "mobile";

  useEffect(() => iniciarAutosalvado(), [iniciarAutosalvado]);
  // IFML H-3 / Ronda 15 L3: el modal "nombre cosa" lee `nuevaCosaPendiente` del
  // store en vez de un SystemEvent global. Cada vez que el flujo
  // `crearEntidadEnCanvas` la activa, sincronizamos el input local con el
  // nombre sugerido por el modelo.
  useEffect(() => {
    if (!nuevaCosaPendiente) return;
    setNombreNuevaCosa(nuevaCosaPendiente.nombre);
  }, [nuevaCosaPendiente]);
  useEffect(() => {
    const onMenu = (event: Event) => {
      const detail = (event as CustomEvent<{ enlaceId: Id; x: number; y: number }>).detail;
      if (detail?.enlaceId) {
        setMenuContextual({ enlaceId: detail.enlaceId, x: detail.x, y: detail.y });
        setMenuEstado(null);
        setMenuEntidad(null);
      }
    };
    const cerrar = () => setMenuContextual(null);
    window.addEventListener("opm:menu-contextual-enlace", onMenu);
    window.addEventListener("click", cerrar);
    return () => {
      window.removeEventListener("opm:menu-contextual-enlace", onMenu);
      window.removeEventListener("click", cerrar);
    };
  }, []);
  // Paquete "Estados ciudadanos de primera clase" (2026-05-23).
  useEffect(() => {
    const onMenu = (event: Event) => {
      const detail = (event as CustomEvent<{ estadoId: Id; entidadId: Id; x: number; y: number }>).detail;
      if (detail?.estadoId) {
        setMenuEstado({ estadoId: detail.estadoId, entidadId: detail.entidadId, x: detail.x, y: detail.y });
        setMenuContextual(null);
        setMenuEntidad(null);
      }
    };
    const cerrar = () => setMenuEstado(null);
    window.addEventListener("opm:menu-contextual-estado", onMenu);
    window.addEventListener("click", cerrar);
    return () => {
      window.removeEventListener("opm:menu-contextual-estado", onMenu);
      window.removeEventListener("click", cerrar);
    };
  }, []);
  useEffect(() => {
    const onMenuEntidad = (event: MouseEvent) => {
      const meta = metadataEntidadDesdeContextMenu(event, canvasAdapter);
      if (!meta) return;
      event.preventDefault();
      seleccionarEntidad(meta.entidadId);
      setMenuContextual(null);
      setMenuEntidad({ aparienciaId: meta.aparienciaId, entidadId: meta.entidadId, x: event.clientX, y: event.clientY });
    };
    const cerrar = () => setMenuEntidad(null);
    window.addEventListener("contextmenu", onMenuEntidad, { capture: true });
    window.addEventListener("click", cerrar);
    return () => {
      window.removeEventListener("contextmenu", onMenuEntidad, { capture: true });
      window.removeEventListener("click", cerrar);
    };
  }, [canvasAdapter, seleccionarEntidad]);

  const entidadSeleccionada = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const puedeCrearAtributo = !readOnly && entidadSeleccionada?.tipo === "objeto";
  const todoMultiSeleccion = seleccionados.length >= 2 ? seleccionados[seleccionados.length - 1] : null;
  // Codex v1.1 mecanico: Relación queda visible como creador inline; si no
  // hay origen seleccionable, ToolbarCreacion conserva el disabled accesible.
  // Los badges de modo seguirán apareciendo en este cluster cuando el flujo
  // de conexión o inserción esté activo.
  const mostrarClusterConectar = true;
  const entidadMenuContextual = menuEntidad ? modelo.entidades[menuEntidad.entidadId] ?? null : null;
  const enlaceEstiloMenuContextualId = entidadMenuContextual
    ? primerEnlaceVisualDeEntidad(modelo, opdActivoId, entidadMenuContextual.id)
    : null;

  function handleCrearObjeto(event: MouseEvent) {
    if (readOnly) return;
    if (event.shiftKey) {
      fijarModoCreacion(modoCreacion === "objeto" ? null : "objeto");
      return;
    }
    crearObjeto();
  }
  function handleCrearProceso(event: MouseEvent) {
    if (readOnly) return;
    if (event.shiftKey) {
      fijarModoCreacion(modoCreacion === "proceso" ? null : "proceso");
      return;
    }
    crearProceso();
  }
  function handleAgregarEstado() {
    if (!puedeCrearAtributo) return;
    agregarEstadoSmart();
  }
  function handleGuardarNombreNuevaCosa(event: Event) {
    event.preventDefault();
    confirmarNombreNuevaCosa(nombreNuevaCosa);
  }
  function handleDescartarNuevaCosa() {
    descartarNuevaCosaPendiente();
  }
  function handleEstiloEnlace(id: Id) {
    seleccionarEnlace(id);
    setMenuContextual(null);
  }
  function handleCopiarEstiloEnlace(id: Id) {
    copiarEstiloEnlaceAlPortapapeles(id);
    setMenuContextual(null);
  }
  function handlePegarEstiloEnlace(id: Id) {
    pegarEstiloEnlaceDesdePortapapeles(id);
    setMenuContextual(null);
  }
  function handleEliminarEnlace(id: Id) {
    borrarEnlacesEnLote([id]);
    setMenuContextual(null);
  }
  function handleAccionMenuEntidad(accionId: AccionContextualId) {
    ejecutarAccionContextualEntidad(accionId, {
      onEditarAlias: () => enfocarSeccionInspector("inspector-seccion-alias"),
    });
    setMenuEntidad(null);
  }
  function handleConectarMultiContextual(tipo: TipoEnlace) {
    if (!todoMultiSeleccion) return;
    conectarSeleccionAlTodo(todoMultiSeleccion, tipo);
    setMenuContextual(null);
  }

  return (
    <>
      {/* Ronda 25 L1 III.A: sustracción geométrica del chrome global. Se
          elimina la etiqueta visible "Modelo" (sigue como aria-label para
          accesibilidad) y los botones Undo/Redo del cluster: la
          reversibilidad queda comunicada por el tooltip del estado de persistencia
          y los atajos Ctrl+Z / Ctrl+Shift+Z siguen activos via
          `globalShortcutsPort`. Esto reduce densidad visual sin perder
          funcionalidad ni esteerabilidad. */}
      <div role="group" aria-label="Modelo" style={style.cluster} data-slot="cluster-modelo" data-cluster="modelo">
        {/* Ronda Codex v2 L2 (wordmark dup, auditoría rev2 §05): el chip
            "OPFORJA" duplicado se elimina de la toolbar. El único wordmark del
            chrome es ahora "Opforja" (Inria Serif italic) en el header de
            CodexFrame; aquí ya no se repite. */}
        {/* Ronda Codex v1.1: estado de persistencia inline, sin chip/caja. */}
        <ToolbarPersistenceStatus persistencia={persistencia} />
        {statusSlot ?? null}
        {readOnly ? <span style={style.readOnlyBadge} data-testid="toolbar-readonly">solo lectura</span> : null}
      </div>
      {esMobile ? null : (
      <div style={style.actions} data-testid="toolbar-actions-pesadas">
        <span style={style.divider} />
        <div role="group" aria-label="Modelar" style={style.cluster} data-slot="cluster-modelar" data-cluster="modelar">
          <ToolbarActionButton
            glyph={<GlyphObjeto />}
            label="Objeto"
            shortcut="O"
            semanticColor={colors.opm.object}
            active={modoCreacion === "objeto"}
            ariaPressed={modoCreacion === "objeto"}
            className={modoCreacion === "objeto" ? "boton-toolbar-activo" : undefined}
            disabled={readOnly}
            onClick={handleCrearObjeto}
            draggable
            onDragStart={dragToolbar("objeto")}
            testId="toolbar-drag-objeto"
            title={readOnly ? "Vista derivada en solo lectura" : modoCreacion === "objeto" ? "Inserción continua de objetos activa · Shift+clic para salir" : "Crear objeto · arrastra al canvas, clic para insertar o Shift+clic para inserción continua"}
          />
          <ToolbarActionButton
            glyph={<GlyphProceso />}
            label="Proceso"
            shortcut="P"
            semanticColor={colors.opm.process}
            active={modoCreacion === "proceso"}
            ariaPressed={modoCreacion === "proceso"}
            className={modoCreacion === "proceso" ? "boton-toolbar-activo" : undefined}
            disabled={readOnly}
            onClick={handleCrearProceso}
            draggable
            onDragStart={dragToolbar("proceso")}
            testId="toolbar-drag-proceso"
            title={readOnly ? "Vista derivada en solo lectura" : modoCreacion === "proceso" ? "Inserción continua de procesos activa · Shift+clic para salir" : "Crear proceso · arrastra al canvas, clic para insertar o Shift+clic para inserción continua"}
          />
          <ToolbarActionButton
            glyph={<GlyphEstado />}
            label="Estado"
            shortcut="S"
            semanticColor={colors.opm.state}
            disabled={!puedeCrearAtributo}
            onClick={handleAgregarEstado}
            testId="toolbar-crear-estado"
            title={puedeCrearAtributo ? "Agregar estado al objeto seleccionado" : "Selecciona un objeto para agregar un estado"}
            ariaLabel="Agregar estado al objeto seleccionado"
          />
          {/* Corte 3.5 sustracción de chrome: "+ Atributo" aparece solo cuando
              la selección es un objeto que admite atributo. Antes ocupaba
              espacio permanente en estado deshabilitado. */}
          {puedeCrearAtributo ? (
            <button
              style={style.iconTextButton}
              type="button"
              draggable
              onDragStart={dragAtributoNumerico}
              onClick={() => crearAtributoNumerico({ nombre: "Valor [u]", tipoSlot: "float" })}
              title="Crear atributo numérico en el objeto seleccionado"
              data-testid="toolbar-crear-atributo-numerico"
            >
              <img src={objectDragIcon} alt="" style={style.smallIcon} />+ Atributo
            </button>
          ) : null}
          {modelarSlot ?? null}
        </div>
        {mostrarClusterConectar ? (
          <>
            <span style={style.divider} />
            <div role="group" aria-label="Conectar" style={style.cluster} data-slot="cluster-conectar" data-cluster="conectar">
              {conectarSlot ?? children}
            </div>
          </>
        ) : null}
      </div>
      )}
      <ModelessToolbarLayer
        nuevaCosa={nuevaCosaPendiente ? { entidadId: nuevaCosaPendiente.entidadId, nombre: nuevaCosaPendiente.nombre } : null}
        nombreNuevaCosa={nombreNuevaCosa}
        setNombreNuevaCosa={setNombreNuevaCosa}
        onDescartarNuevaCosa={handleDescartarNuevaCosa}
        onSubmitNuevaCosa={handleGuardarNombreNuevaCosa}
        menuContextual={menuContextual}
        setMenuContextual={setMenuContextual}
        menuEntidad={menuEntidad}
        entidadMenuContextual={entidadMenuContextual}
        enlaceEstiloMenuContextualId={enlaceEstiloMenuContextualId}
        hayEstiloEnPortapapeles={!!enlaceEstiloPortapapeles}
        setMenuEntidad={setMenuEntidad}
        menuEstado={menuEstado}
        setMenuEstado={setMenuEstado}
        onEstiloEnlace={handleEstiloEnlace}
        onCopiarEstilo={handleCopiarEstiloEnlace}
        onPegarEstilo={handlePegarEstiloEnlace}
        onEliminarEnlace={handleEliminarEnlace}
        multi={seleccionados.length >= 2}
        onAccionMenuEntidad={handleAccionMenuEntidad}
        {...(todoMultiSeleccion ? { onConectarMultiAlTodo: handleConectarMultiContextual } : {})}
      />
      <Suspense fallback={null}><DialogoTraerConectados /></Suspense>
    </>
  );
}

type PersistenciaToolbar = ReturnType<typeof useToolbarBaseViewModel>["persistencia"];

function ToolbarPersistenceStatus({ persistencia }: { persistencia: PersistenciaToolbar }): preact.JSX.Element {
  const variante = clasificarVariante({
    modeloPersistidoId: persistencia.modeloPersistidoId,
    dirty: persistencia.dirty,
    cargadoDesde: persistencia.cargadoDesde,
    versiones: persistencia.versiones,
    tiempoRelativo: null,
  });
  const opcionesLabel = {
    salvando: persistencia.autosalvadoEnCurso,
    horaGuardado: formatearHoraGuardado(persistencia.ultimoAutosalvado),
  };
  const label = labelChip(variante, opcionesLabel);
  const display = labelPersistenciaToolbar(variante.tipo, label, persistencia.autosalvadoEnCurso);
  const pendiente = persistencia.autosalvadoEnCurso || variante.tipo !== "local-clean";

  return (
    <button
      type="button"
      style={style.inlineStatusButton}
      title={detallarChip(variante, persistencia.modeloNombre, opcionesLabel)}
      onClick={persistencia.abrirGuardarComo}
      data-testid="chip-persistencia"
      data-variante={variante.tipo}
      data-salvando={persistencia.autosalvadoEnCurso ? "true" : "false"}
      aria-label={`Estado de almacenamiento: ${label}`}
    >
      <span aria-hidden="true" style={pendiente ? style.statusDotPending : style.statusDot}>{pendiente ? "●" : "○"}</span>
      <span style={style.statusLabel}>{display}</span>
    </button>
  );
}


function ModelessToolbarLayer(props: {
  nuevaCosa: { entidadId: Id; nombre: string } | null;
  nombreNuevaCosa: string;
  setNombreNuevaCosa: (value: string) => void;
  onDescartarNuevaCosa: () => void;
  onSubmitNuevaCosa: (event: Event) => void;
  menuContextual: { enlaceId: Id; x: number; y: number } | null;
  setMenuContextual: (value: null | { enlaceId: Id; x: number; y: number }) => void;
  menuEntidad: { aparienciaId: Id; entidadId: Id; x: number; y: number } | null;
  entidadMenuContextual: Entidad | null;
  enlaceEstiloMenuContextualId: Id | null;
  hayEstiloEnPortapapeles: boolean;
  setMenuEntidad: (value: null | { aparienciaId: Id; entidadId: Id; x: number; y: number }) => void;
  menuEstado: { estadoId: Id; entidadId: Id; x: number; y: number } | null;
  setMenuEstado: (value: null | { estadoId: Id; entidadId: Id; x: number; y: number }) => void;
  onEstiloEnlace: (id: Id) => void;
  onCopiarEstilo: (id: Id) => void;
  onPegarEstilo: (id: Id) => void;
  onEliminarEnlace: (id: Id) => void;
  onConectarMultiAlTodo?: (tipo: TipoEnlace) => void;
  multi: boolean;
  onAccionMenuEntidad: (accionId: AccionContextualId) => void;
}) {
  return (
    <>
      {props.nuevaCosa ? (
        <form style={style.nombreModal} data-testid="modal-nombre-cosa" onSubmit={props.onSubmitNuevaCosa}>
          <label style={style.nombreField}>
            <span style={style.nombreLabel}>Nombre</span>
            <input autoFocus style={style.nombreInput} value={props.nombreNuevaCosa} onInput={(event) => props.setNombreNuevaCosa(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") props.onDescartarNuevaCosa(); }} />
          </label>
          <button type="submit" style={style.primarySmall}>OK</button>
        </form>
      ) : null}
      {props.menuContextual ? (
        <MenuContextualEnlace enlaceId={props.menuContextual.enlaceId} x={props.menuContextual.x} y={props.menuContextual.y} onCerrar={() => props.setMenuContextual(null)} onEstilo={props.onEstiloEnlace} onCopiarEstilo={props.onCopiarEstilo} onPegarEstilo={props.onPegarEstilo} onEliminar={props.onEliminarEnlace} onConectarMultiAlTodo={props.onConectarMultiAlTodo} />
      ) : null}
      {props.menuEntidad ? (
        <MenuContextualEntidad
          aparienciaId={props.menuEntidad.aparienciaId}
          entidad={props.entidadMenuContextual}
          enlaceEstiloId={props.enlaceEstiloMenuContextualId}
          hayEstiloEnPortapapeles={props.hayEstiloEnPortapapeles}
          inspectorAbierto
          x={props.menuEntidad.x}
          y={props.menuEntidad.y}
          multi={props.multi}
          onCerrar={() => props.setMenuEntidad(null)}
          onAccion={props.onAccionMenuEntidad}
        />
      ) : null}
      {props.menuEstado ? (
        <MenuContextualEstado
          estadoId={props.menuEstado.estadoId}
          entidadId={props.menuEstado.entidadId}
          x={props.menuEstado.x}
          y={props.menuEstado.y}
          onCerrar={() => props.setMenuEstado(null)}
        />
      ) : null}
    </>
  );
}

function enfocarSeccionInspector(testId: string): void {
  window.setTimeout(() => {
    const seccion = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
    const foco = seccion?.querySelector<HTMLElement>("input, textarea, button, select");
    foco?.focus();
    seccion?.scrollIntoView({ block: "nearest" });
  }, 0);
}

function metadataEntidadDesdeContextMenu(event: MouseEvent, adapter: JointCanvasAdapter | null): { aparienciaId: Id; entidadId: Id } | null {
  const target = event.target instanceof Element ? event.target : null;
  const cellEl = target?.closest?.(".joint-cell,[model-id],[data-model-id]");
  const modelId = cellEl?.getAttribute("model-id") ?? cellEl?.getAttribute("data-model-id");
  if (!modelId) return null;
  const meta = adapter?.graph.getCell(modelId)?.prop("opm") as { kind?: string; aparienciaId?: Id; entidadId?: Id } | undefined;
  if (meta?.kind !== "entidad" || !meta.aparienciaId || !meta.entidadId) return null;
  return { aparienciaId: meta.aparienciaId, entidadId: meta.entidadId };
}
