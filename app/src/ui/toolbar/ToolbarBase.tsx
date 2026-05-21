/**
 * ViewContainer ToolbarBase: chrome estable del modelador. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-12.
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
import { MenuContextualEntidad } from "../MenuContextualEntidad";
import { ToolbarMas, type ToolbarMasItem } from "./ToolbarMas";
import { dragAtributoNumerico, dragToolbar, etiquetaModoGlobal, siguienteModoGlobal, toolbarStyle as style } from "./toolbarStyles";

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
  mapaSlot?: preact.ComponentChildren;
  statusSlot?: preact.ComponentChildren;
}

export function ToolbarBase({ children, modelarSlot, conectarSlot, mapaSlot, statusSlot }: ToolbarBaseProps) {
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
    eliminarSeleccion,
    conectarSeleccionAlTodo,
    traerEnlacesEntreSeleccionadas,
    iniciarAutosalvado,
    modoCreacion,
    abrirDialogoPlantillas,
    uiAliasVisibles,
    uiDescripcionesVisibles,
    toggleAliasVisibles,
    toggleDescripcionesVisibles,
    uiModoImagenGlobal,
    fijarModoImagenGlobal,
    abrirModalImagen,
    gridConfig,
    toggleGrid,
    abrirDialogoConfiguracion,
    aplicarLayoutSugerido,
    bibliotecaDockAbierto,
    toggleBibliotecaDock,
    vistaMapaActiva,
    toggleVistaMapa,
    iniciarModoSimulacion,
    alinearSeleccion,
    distribuirSeleccion,
    alinearSeleccionEnlaces,
  } = useToolbarBaseViewModel();
  // Ronda 19 L5: `dirty` ya no se lee aqui; ChipPersistencia lo consume.
  const [nombreNuevaCosa, setNombreNuevaCosa] = useState("");
  const [menuContextual, setMenuContextual] = useState<null | { enlaceId: Id; x: number; y: number }>(null);
  const [menuEntidad, setMenuEntidad] = useState<null | { aparienciaId: Id; entidadId: Id; x: number; y: number }>(null);
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
      if (detail?.enlaceId) setMenuContextual({ enlaceId: detail.enlaceId, x: detail.x, y: detail.y });
    };
    const cerrar = () => setMenuContextual(null);
    window.addEventListener("opm:menu-contextual-enlace", onMenu);
    window.addEventListener("click", cerrar);
    return () => {
      window.removeEventListener("opm:menu-contextual-enlace", onMenu);
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
  const puedeEditarImagen = entidadSeleccionada?.tipo === "objeto";
  const hayMultiSeleccion = seleccionados.length >= 2;
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
  const masItems = construirItemsMenuMas({
    puedeEditarImagen,
    hayMultiSeleccion,
    uiAliasVisibles,
    uiDescripcionesVisibles,
    uiModoImagenGlobal,
    onAbrirPlantillas: abrirDialogoPlantillas,
    onToggleAlias: toggleAliasVisibles,
    onToggleDescripciones: toggleDescripcionesVisibles,
    onSiguienteModoImagen: () => fijarModoImagenGlobal(siguienteModoGlobal(uiModoImagenGlobal)),
    onEditarImagen: () => { if (seleccionId) abrirModalImagen(seleccionId); },
    gridActiva: gridConfig.activa,
    bibliotecaDockAbierto,
    onToggleGrid: toggleGrid,
    onConfigGrid: abrirDialogoConfiguracion,
    onAplicarLayout: aplicarLayoutSugerido,
    onToggleBibliotecaDock: toggleBibliotecaDock,
    vistaMapaActiva,
    onToggleMapa: toggleVistaMapa,
    onIniciarSimulacion: iniciarModoSimulacion,
    onEliminarSeleccion: eliminarSeleccion,
    onConectarSeleccionComoPartes: () => { if (todoMultiSeleccion) conectarSeleccionAlTodo(todoMultiSeleccion, "agregacion"); },
    onTraerEnlacesEntreSeleccionadas: traerEnlacesEntreSeleccionadas,
    onAlinearCosa: alinearSeleccion,
    onDistribuirCosa: distribuirSeleccion,
    onAlinearEnlaces: alinearSeleccionEnlaces,
  });

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
          <button style={modoCreacion === "objeto" ? style.objectActiveButton : style.objectButton} type="button" aria-pressed={modoCreacion === "objeto"} className={modoCreacion === "objeto" ? "boton-toolbar-activo" : undefined} onClick={handleCrearObjeto} draggable onDragStart={dragToolbar("objeto")} data-testid="toolbar-drag-objeto" title={modoCreacion === "objeto" ? "Inserción continua de objetos activa · Shift+clic para salir" : "Crear objeto · arrastra al canvas, clic para insertar o Shift+clic para inserción continua"}>Objeto</button>
          <button style={modoCreacion === "proceso" ? style.processActiveButton : style.processButton} type="button" aria-pressed={modoCreacion === "proceso"} className={modoCreacion === "proceso" ? "boton-toolbar-activo" : undefined} onClick={handleCrearProceso} draggable onDragStart={dragToolbar("proceso")} data-testid="toolbar-drag-proceso" title={modoCreacion === "proceso" ? "Inserción continua de procesos activa · Shift+clic para salir" : "Crear proceso · arrastra al canvas, clic para insertar o Shift+clic para inserción continua"}>Proceso</button>
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
        {mapaSlot ? (
          <>
            <div role="group" aria-label="Mapa del sistema" style={style.cluster} data-slot="cluster-mapa-sistema" data-cluster="mapa">
              {mapaSlot}
            </div>
            <span style={style.divider} />
          </>
        ) : null}
        <div role="group" aria-label="Ayuda" style={style.cluster} data-slot="cluster-ayuda" data-cluster="ayuda">
          {/* Corte 3.5 sustracción de chrome: el botón mostraba solo el
              símbolo `⌕` (lupa). Ahora exhibe label "Buscar" para que su
              propósito sea legible sin tooltip. */}
          <button
            type="button"
            style={style.iconTextButton}
            onClick={abrirDialogoComandos}
            title="Buscar comandos · Ctrl+K"
            data-testid="toolbar-command-palette"
            aria-label="Buscar comandos"
          >
            ⌕ Buscar
          </button>
          <ToolbarMas items={masItems} />
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

type ParametrosItemsMas = {
  puedeEditarImagen: boolean;
  hayMultiSeleccion: boolean;
  uiAliasVisibles: boolean;
  uiDescripcionesVisibles: boolean;
  uiModoImagenGlobal: import("../../modelo/tipos").ModoImagenEntidad | null;
  gridActiva: boolean;
  bibliotecaDockAbierto: boolean;
  vistaMapaActiva: boolean;
  onAbrirPlantillas: () => void;
  onToggleAlias: () => void;
  onToggleDescripciones: () => void;
  onSiguienteModoImagen: () => void;
  onEditarImagen: () => void;
  onToggleGrid: () => void;
  onConfigGrid: () => void;
  onAplicarLayout: () => void;
  onToggleBibliotecaDock: () => void;
  onToggleMapa: () => void;
  onIniciarSimulacion: () => void;
  onEliminarSeleccion: () => void;
  onConectarSeleccionComoPartes: () => void;
  onTraerEnlacesEntreSeleccionadas: () => void;
  onAlinearCosa: (eje: "izq" | "centro" | "der" | "sup" | "medio" | "inf") => void;
  onDistribuirCosa: (orientacion: "horizontal" | "vertical") => void;
  onAlinearEnlaces: (direccion: "izquierda" | "derecha" | "arriba" | "abajo") => void;
};

function construirItemsMenuMas(p: ParametrosItemsMas): ToolbarMasItem[] {
  const items: ToolbarMasItem[] = [];

  // Apariencia y display: alias, descripciones, imagen, modo imagen global.
  items.push({ kind: "separador", id: "sep-display", label: "Apariencia" });
  items.push({
    kind: "accion",
    id: "alias-visibles",
    label: p.uiAliasVisibles ? "Alias visibles" : "Alias ocultos",
    activo: p.uiAliasVisibles,
    title: p.uiAliasVisibles ? "Ocultar alias bajo el nombre" : "Mostrar alias bajo el nombre",
    onClick: p.onToggleAlias,
  });
  items.push({
    kind: "accion",
    id: "desc-visibles",
    label: p.uiDescripcionesVisibles ? "Descripciones visibles" : "Descripciones ocultas",
    activo: p.uiDescripcionesVisibles,
    title: p.uiDescripcionesVisibles ? "Ocultar descripciones bajo el nombre" : "Mostrar descripciones bajo el nombre",
    onClick: p.onToggleDescripciones,
  });
  items.push({
    kind: "accion",
    id: "modo-imagen-global",
    label: `Imagen: ${etiquetaModoGlobal(p.uiModoImagenGlobal)}`,
    activo: p.uiModoImagenGlobal !== null,
    title: `Modo imagen · ciclo por cosa → imagen + nombre → solo imagen → solo nombre. Actual: ${etiquetaModoGlobal(p.uiModoImagenGlobal)}`,
    onClick: p.onSiguienteModoImagen,
    testId: "toolbar-mas-modo-imagen-global",
  });
  items.push({
    kind: "accion",
    id: "editar-imagen",
    label: "Editar imagen del objeto…",
    title: p.puedeEditarImagen ? "Editar imagen del objeto seleccionado" : "Selecciona un objeto",
    disabled: !p.puedeEditarImagen,
    onClick: p.onEditarImagen,
    testId: "toolbar-mas-editar-imagen",
  });

  // Plantillas como acción accesoria (mantener invocable desde el menú).
  items.push({ kind: "separador", id: "sep-plantillas", label: "Plantillas" });
  items.push({
    kind: "accion",
    id: "abrir-plantillas",
    label: "Plantillas…",
    title: "Abrir biblioteca de plantillas",
    onClick: p.onAbrirPlantillas,
    testId: "toolbar-mas-plantillas",
  });
  items.push({ kind: "separador", id: "sep-vista", label: "Vista" });
  items.push({
    kind: "accion",
    id: "toggle-grid",
    label: p.gridActiva ? "Cuadrícula visible" : "Cuadrícula oculta",
    activo: p.gridActiva,
    title: p.gridActiva ? "Cuadrícula activa · clic para ocultar" : "Mostrar cuadrícula del canvas",
    onClick: p.onToggleGrid,
    testId: "toolbar-mas-toggle-grid",
  });
  items.push({
    kind: "accion",
    id: "config-grid",
    label: "Configuración…",
    title: "Renombrar modelo y ajustar cuadrícula",
    onClick: p.onConfigGrid,
    testId: "toolbar-mas-config-grid",
  });
  items.push({
    kind: "accion",
    id: "auto-layout",
    label: "Auto-layout",
    title: "Reorganiza apariencias del OPD activo en niveles top-down. Undoable con Ctrl+Z.",
    onClick: p.onAplicarLayout,
    testId: "toolbar-mas-auto-layout",
  });
  items.push({
    kind: "accion",
    id: "biblioteca-dock",
    label: "Biblioteca dock",
    activo: p.bibliotecaDockAbierto,
    title: p.bibliotecaDockAbierto ? "Cerrar biblioteca dock (Ctrl+B)" : "Abrir biblioteca dock acoplada al árbol (Ctrl+B)",
    onClick: p.onToggleBibliotecaDock,
    testId: "toolbar-mas-biblioteca-dock",
  });
  items.push({
    kind: "accion",
    id: "mapa-sistema",
    label: "Mapa del sistema",
    activo: p.vistaMapaActiva,
    title: p.vistaMapaActiva ? "Volver al canvas de edición" : "Abrir mapa del sistema",
    onClick: p.onToggleMapa,
    testId: "toolbar-mas-mapa",
  });
  items.push({
    kind: "accion",
    id: "simulacion",
    label: "Simulación conceptual",
    title: "Entrar a modo simulación conceptual",
    onClick: p.onIniciarSimulacion,
    testId: "toolbar-mas-simulacion",
  });

  // Alineación y distribución (visible cuando hay multi-seleccion).
  if (p.hayMultiSeleccion) {
    items.push({ kind: "separador", id: "sep-multiseleccion", label: "Selección múltiple" });
    items.push({
      kind: "accion",
      id: "eliminar-seleccion",
      label: "Eliminar selección",
      title: "Eliminar selección · Delete",
      onClick: p.onEliminarSeleccion,
      testId: "toolbar-mas-eliminar-seleccion",
    });
    items.push({
      kind: "accion",
      id: "agregar-como-partes",
      label: "Agregar como partes",
      title: "Crea enlaces de agregación desde las cosas seleccionadas hacia la última seleccionada",
      onClick: p.onConectarSeleccionComoPartes,
      testId: "toolbar-mas-agregar-como-partes",
    });
    items.push({
      kind: "accion",
      id: "traer-enlaces",
      label: "Traer enlaces entre seleccionadas",
      title: "Traer enlaces existentes entre las cosas seleccionadas",
      onClick: p.onTraerEnlacesEntreSeleccionadas,
      testId: "toolbar-mas-traer-enlaces",
    });
    items.push({ kind: "separador", id: "sep-alinear", label: "Alinear cosas" });
    items.push({ kind: "accion", id: "alinear-izq", label: "Alinear izquierda", onClick: () => p.onAlinearCosa("izq"), testId: "toolbar-mas-alinear-izq" });
    items.push({ kind: "accion", id: "alinear-centro", label: "Alinear centro horizontal", onClick: () => p.onAlinearCosa("centro"), testId: "toolbar-mas-alinear-centro" });
    items.push({ kind: "accion", id: "alinear-der", label: "Alinear derecha", onClick: () => p.onAlinearCosa("der"), testId: "toolbar-mas-alinear-der" });
    items.push({ kind: "accion", id: "alinear-sup", label: "Alinear arriba", onClick: () => p.onAlinearCosa("sup"), testId: "toolbar-mas-alinear-sup" });
    items.push({ kind: "accion", id: "alinear-medio", label: "Alinear medio vertical", onClick: () => p.onAlinearCosa("medio"), testId: "toolbar-mas-alinear-medio" });
    items.push({ kind: "accion", id: "alinear-inf", label: "Alinear abajo", onClick: () => p.onAlinearCosa("inf"), testId: "toolbar-mas-alinear-inf" });
    items.push({ kind: "separador", id: "sep-distribuir", label: "Distribuir y enlaces" });
    items.push({ kind: "accion", id: "distribuir-h", label: "Distribuir horizontal", onClick: () => p.onDistribuirCosa("horizontal"), testId: "toolbar-mas-distribuir-h" });
    items.push({ kind: "accion", id: "distribuir-v", label: "Distribuir vertical", onClick: () => p.onDistribuirCosa("vertical"), testId: "toolbar-mas-distribuir-v" });
    items.push({ kind: "accion", id: "alinear-enl-izq", label: "Alinear enlaces a izquierda", onClick: () => p.onAlinearEnlaces("izquierda"), testId: "toolbar-mas-alinear-enl-izq" });
    items.push({ kind: "accion", id: "alinear-enl-der", label: "Alinear enlaces a derecha", onClick: () => p.onAlinearEnlaces("derecha"), testId: "toolbar-mas-alinear-enl-der" });
    items.push({ kind: "accion", id: "alinear-enl-arr", label: "Alinear enlaces arriba", onClick: () => p.onAlinearEnlaces("arriba"), testId: "toolbar-mas-alinear-enl-arr" });
    items.push({ kind: "accion", id: "alinear-enl-aba", label: "Alinear enlaces abajo", onClick: () => p.onAlinearEnlaces("abajo"), testId: "toolbar-mas-alinear-enl-aba" });
  }

  // Suprime separadores ociosos (no aporta accion despues).
  return purgarSeparadoresVacios(items);
}

function purgarSeparadoresVacios(items: ToolbarMasItem[]): ToolbarMasItem[] {
  const limpio: ToolbarMasItem[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (!item) continue;
    if (item.kind === "separador") {
      const siguiente = items[i + 1];
      if (!siguiente || siguiente.kind === "separador") continue;
    }
    limpio.push(item);
  }
  return limpio;
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
