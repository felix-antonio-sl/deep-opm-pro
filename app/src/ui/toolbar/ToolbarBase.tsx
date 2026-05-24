/**
 * ViewContainer ToolbarBase: chrome estable del modelador. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-12.
 *
 * Ronda 27 III.A cierre: el botón `⋯ Más` desaparece del chrome para
 * cumplir la geometría de 5 elementos planos que pide el veredicto
 * jobs-web-ux original (sección III.A). Las acciones globales del Más
 * (alias, descripciones, modo imagen, cuadrícula, biblioteca dock,
 * auto-layout, mapa del sistema, simulación) se absorben como secciones
 * del menú principal `☰`. Las acciones multi-selección (eliminar,
 * agregar como partes, alinear, distribuir) siguen viviendo en la barra
 * contextual flotante sobre la selección, no se duplican.
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
import { ChipPersistencia } from "../ChipPersistencia";
import { ejecutarAccionContextualEntidad } from "../ejecutarAccionContextual";
// L2 ronda 21: la toolbar primaria de modelado pesado se oculta en mobile
// y se compacta en tablet. Decisión por viewport delegada a `layoutResponsive`.
import { useBreakpoint } from "../layoutResponsive";
import { MenuContextualEnlace } from "../MenuContextualEnlace";
import { MenuContextualEstado } from "../MenuContextualEstado";
import { MenuContextualEntidad } from "../MenuContextualEntidad";
import { colors, stroke } from "../tokens";
import "./toolbar.css";
import { dragAtributoNumerico, dragToolbar, toolbarStyle as style } from "./toolbarStyles";

/**
 * Glyph mini ronda 28 L2: cuadrado (Objeto) / elipse (Proceso) 12×12
 * en stroke ink. NO usa fill verde/azul: la paleta semántica del canvas
 * [JOYAS §1] vive sólo en L4. Aquí el botón comunica la geometría OPM
 * (rectángulo vs elipse) sin acoplar al canvas cromático.
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
        stroke={colors.ink}
        strokeWidth={stroke.base}
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
        stroke={colors.ink}
        strokeWidth={stroke.base}
      />
    </svg>
  );
}

const DialogoPlantillas = lazy(() => import("../DialogoPlantillas").then((m) => ({ default: m.DialogoPlantillas })));
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
  // P0-2 (informe UI/UX 2026-05-07): MenuPrincipal se monta UNA sola vez en
  // App.tsx. Antes ToolbarBase tambien tenia su propia instancia lazy y se
  // duplicaba en el DOM (`role="menu"` aparecia dos veces, rompiendo
  // accesibilidad y smokes). El boton ☰ aqui solo abre/cierra via store;
  // el render lo hace App.tsx. Bug P0 introducido por hotfix `4f7dc66`.
  //
  // Ronda 23 L3 #7: el viejo overlay `PantallaInicio` lazy-loaded desde aquí
  // fue reemplazado por el banner inline que vive dentro del canvas-pane
  // y se monta directamente desde App.tsx (ver `usePrecargaBienvenida`).
  const {
    abrirMenuPrincipal,
    cerrarMenuPrincipal,
    crearObjeto,
    crearProceso,
    crearAtributoNumerico,
    fijarModoCreacion,
    menuPrincipalAbierto,
    abrirDialogoComandos,
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
  } = useToolbarBaseViewModel();
  // Ronda 19 L5: `dirty` ya no se lee aqui; ChipPersistencia lo consume.
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
  const puedeCrearAtributo = entidadSeleccionada?.tipo === "objeto";
  const todoMultiSeleccion = seleccionados.length >= 2 ? seleccionados[seleccionados.length - 1] : null;
  // Ronda 24 L4 #6 sustracción de chrome: el cluster Conectar antes ocupaba
  // espacio permanente con su botón disabled cuando no había nada que
  // conectar. Ahora aparece solo cuando hay al menos una entidad
  // seleccionada (origen disponible para conectar) o cuando hay un modo
  // activo (`modoEnlace` para completar destino, `modoCreacion` sticky para
  // mostrar el badge "Insertando…"). Si se ocultara solo por modoEnlace
  // residual sin selección, el usuario quedaría sin botón Cancelar visible
  // al deseleccionar durante el flujo conectar.
  const hayEntidadSeleccionada = seleccionados.some((id) => !!modelo.entidades[id]);
  const mostrarClusterConectar = hayEntidadSeleccionada || modoEnlace !== null || modoCreacion !== null;
  const entidadMenuContextual = menuEntidad ? modelo.entidades[menuEntidad.entidadId] ?? null : null;
  const enlaceEstiloMenuContextualId = entidadMenuContextual
    ? primerEnlaceVisualDeEntidad(modelo, opdActivoId, entidadMenuContextual.id)
    : null;

  function handleToggleMenuPrincipal() {
    if (menuPrincipalAbierto) cerrarMenuPrincipal();
    else abrirMenuPrincipal();
  }
  function handleCrearObjeto(event: MouseEvent) {
    if (event.shiftKey) {
      fijarModoCreacion(modoCreacion === "objeto" ? null : "objeto");
      return;
    }
    crearObjeto();
  }
  function handleCrearProceso(event: MouseEvent) {
    if (event.shiftKey) {
      fijarModoCreacion(modoCreacion === "proceso" ? null : "proceso");
      return;
    }
    crearProceso();
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
          reversibilidad queda comunicada por el tooltip del ChipPersistencia
          y los atajos Ctrl+Z / Ctrl+Shift+Z siguen activos via
          `globalShortcutsPort`. Esto reduce densidad visual sin perder
          funcionalidad ni esteerabilidad. */}
      <div role="group" aria-label="Modelo" style={style.cluster} data-slot="cluster-modelo" data-cluster="modelo">
        {/* Ronda 28 L2: marca OPFORJA en esquina superior izquierda como
            kbd uppercase con tracking 0.12em. En mobile colapsa a glyph
            "O" para no comprimir el button-strip principal. */}
        <span
          aria-label="OPFORJA"
          data-testid="toolbar-marca"
          style={esMobile ? style.marcaCompacta : style.marca}
        >
          {esMobile ? "O" : "OPFORJA"}
        </span>
        <div style={style.menuWrapper}>
          <button type="button" aria-haspopup="menu" aria-expanded={menuPrincipalAbierto} aria-label="Menú principal" title="Menú principal" style={style.iconButton} onClick={handleToggleMenuPrincipal}>☰</button>
          {/* P0-2: MenuPrincipal vive ahora en App.tsx para evitar
              duplicacion en el DOM. El boton aqui solo gatilla el store. */}
        </div>
        {/* Ronda 19 L5: slot estable para chip de persistencia en cluster Modelo. */}
        <ChipPersistencia />
        {statusSlot ?? null}
      </div>
      {esMobile ? null : (
      <div style={style.actions} data-testid="toolbar-actions-pesadas">
        <span style={style.divider} />
        <div role="group" aria-label="Modelar" style={style.cluster} data-slot="cluster-modelar" data-cluster="modelar">
          <button
            style={{ ...(modoCreacion === "objeto" ? style.objectActiveButton : style.objectButton), display: "inline-flex", alignItems: "center", gap: "8px" }}
            type="button"
            aria-pressed={modoCreacion === "objeto"}
            className={modoCreacion === "objeto" ? "boton-toolbar-activo" : undefined}
            onClick={handleCrearObjeto}
            draggable
            onDragStart={dragToolbar("objeto")}
            data-testid="toolbar-drag-objeto"
            title={modoCreacion === "objeto" ? "Inserción continua de objetos activa · Shift+clic para salir" : "Crear objeto · arrastra al canvas, clic para insertar o Shift+clic para inserción continua"}
          >
            <GlyphObjeto />
            <span>Objeto</span>
          </button>
          <button
            style={{ ...(modoCreacion === "proceso" ? style.processActiveButton : style.processButton), display: "inline-flex", alignItems: "center", gap: "8px" }}
            type="button"
            aria-pressed={modoCreacion === "proceso"}
            className={modoCreacion === "proceso" ? "boton-toolbar-activo" : undefined}
            onClick={handleCrearProceso}
            draggable
            onDragStart={dragToolbar("proceso")}
            data-testid="toolbar-drag-proceso"
            title={modoCreacion === "proceso" ? "Inserción continua de procesos activa · Shift+clic para salir" : "Crear proceso · arrastra al canvas, clic para insertar o Shift+clic para inserción continua"}
          >
            <GlyphProceso />
            <span>Proceso</span>
          </button>
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
        <span style={style.divider} />
        <div role="group" aria-label="Ayuda" style={style.cluster} data-slot="cluster-ayuda" data-cluster="ayuda">
          {/* Corte 3.5 sustracción de chrome: el botón mostraba solo el
              símbolo `⌕` (lupa). Ahora exhibe label "Buscar" para que su
              propósito sea legible sin tooltip. */}
          {/* Ronda 27 III.A cierre: el botón `⋯ Más` desaparece del chrome.
              Sus acciones globales se absorben como secciones del menú
              principal `☰` (Vista, Herramientas). Las multi-selección
              siguen en BarraHerramientasElemento. Chrome final: 5
              elementos planos = ☰ · ChipPersistencia · Objeto · Proceso ·
              ⌕ Buscar. */}
          <button
            type="button"
            style={style.iconTextButton}
            onClick={abrirDialogoComandos}
            title="Buscar comandos · Ctrl+K"
            data-testid="toolbar-command-palette"
            aria-label="Buscar comandos"
          >
            <span aria-hidden="true">Buscar</span>
            <kbd style={style.kbd} aria-hidden="true">⌘ K</kbd>
          </button>
        </div>
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
      <Suspense fallback={null}><DialogoTraerConectados /><DialogoPlantillas /></Suspense>
    </>
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
