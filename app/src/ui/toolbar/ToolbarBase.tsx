/**
 * ViewContainer ToolbarBase: chrome estable del modelador. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-12.
 */
import { lazy, Suspense } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";
import lockIcon from "../../../../assets/svg/lock.svg";
import objectDragIcon from "../../../../assets/svg/objectDrag.svg";
import verFileIcon from "../../../../assets/svg/verFile.svg";
import { normalizarGridConfig } from "../../canvas/grid";
import type { Entidad, Id, TipoEnlace } from "../../modelo/tipos";
import { listarFixtures } from "../../store/runtime";
import { useOpmStore } from "../../store";
import type { AccionContextualId } from "../../store/acciones-contextuales";
import { primerEnlaceVisualDeEntidad } from "../BarraHerramientasElemento";
import { ChipPersistencia } from "../ChipPersistencia";
import { useConfirmarSiDirty } from "../ConfirmacionContext";
import { DialogoGuardarPlantilla } from "../DialogoGuardarPlantilla";
import { ejecutarAccionContextualEntidad } from "../ejecutarAccionContextual";
// L2 ronda 21: la toolbar primaria de modelado pesado se oculta en mobile
// y se compacta en tablet. Decisión por viewport delegada a `layoutResponsive`.
import { useBreakpoint } from "../layoutResponsive";
import { MenuContextualEnlace } from "../MenuContextualEnlace";
import { MenuContextualEntidad } from "../MenuContextualEntidad";
import { ModalConfiguracionGrid } from "../ModalConfiguracionGrid";
import { ToolbarMas, type ToolbarMasItem } from "./ToolbarMas";
import { dragAtributoNumerico, dragToolbar, etiquetaModoGlobal, siguienteModoGlobal, toolbarStyle as style } from "./toolbarStyles";

const DialogoPlantillas = lazy(() => import("../DialogoPlantillas").then((m) => ({ default: m.DialogoPlantillas })));
const DialogoTraerConectados = lazy(() => import("../DialogoTraerConectados").then((m) => ({ default: m.DialogoTraerConectados })));

type PantallaInicioComponent = () => preact.JSX.Element | null;
type GlobalJointAdapter = { graph?: { getCell?: (id: string) => { prop?: (name: string) => unknown } | undefined } };

/**
 * ViewContainer ToolbarBase: chrome estable. [JOYAS §1-3], [V-0c], IFML H-2/H-5.
 * Referencias semanticas verificadas: opm-extracted layout/header, element-tool-bar, main, opl-container.
 */
interface ToolbarBaseProps {
  children?: preact.ComponentChildren;
  modelarSlot?: preact.ComponentChildren;
  conectarSlot?: preact.ComponentChildren;
  validarSlot?: preact.ComponentChildren;
  statusSlot?: preact.ComponentChildren;
}

export function ToolbarBase({ children, modelarSlot, conectarSlot, validarSlot, statusSlot }: ToolbarBaseProps) {
  // P0-2 (informe UI/UX 2026-05-07): MenuPrincipal se monta UNA sola vez en
  // App.tsx. Antes ToolbarBase tambien tenia su propia instancia lazy y se
  // duplicaba en el DOM (`role="menu"` aparecia dos veces, rompiendo
  // accesibilidad y smokes). El boton ☰ aqui solo abre/cierra via store;
  // el render lo hace App.tsx. Bug P0 introducido por hotfix `4f7dc66`.
  const [PantallaInicioLazy, setPantallaInicioLazy] = useState<PantallaInicioComponent | null>(null);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const abrirMenuPrincipal = useOpmStore((s) => s.abrirMenuPrincipal);
  const cerrarMenuPrincipal = useOpmStore((s) => s.cerrarMenuPrincipal);
  const crearObjeto = useOpmStore((s) => s.crearObjetoDemo);
  const crearProceso = useOpmStore((s) => s.crearProcesoDemo);
  const crearAtributoNumerico = useOpmStore((s) => s.crearAtributoEnObjetoSeleccionado);
  const fijarModoCreacion = useOpmStore((s) => s.fijarModoCreacion);
  const cargarFixtureDemo = useOpmStore((s) => s.cargarFixtureDemo);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const abrirCargarModelo = useOpmStore((s) => s.abrirCargarModelo);
  const deshacer = useOpmStore((s) => s.deshacer);
  const rehacer = useOpmStore((s) => s.rehacer);
  const menuPrincipalAbierto = useOpmStore((s) => s.menuPrincipalAbierto);
  const abrirDialogoComandos = useOpmStore((s) => s.abrirDialogoComandos);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const abrirDialogoVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const puedeDeshacer = useOpmStore((s) => s.puedeDeshacer);
  const puedeRehacer = useOpmStore((s) => s.puedeRehacer);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const renombrarSeleccionada = useOpmStore((s) => s.renombrarSeleccionada);
  const nuevaCosaPendiente = useOpmStore((s) => s.nuevaCosaPendiente);
  const confirmarNombreNuevaCosa = useOpmStore((s) => s.confirmarNombreNuevaCosa);
  const descartarNuevaCosaPendiente = useOpmStore((s) => s.descartarNuevaCosaPendiente);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const copiarEstiloEnlaceAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloEnlaceDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const borrarEnlacesEnLote = useOpmStore((s) => s.borrarEnlacesEnLote);
  const eliminarSeleccion = useOpmStore((s) => s.eliminarSeleccion);
  const conectarSeleccionAlTodo = useOpmStore((s) => s.conectarSeleccionAlTodo);
  const traerEnlacesEntreSeleccionadas = useOpmStore((s) => s.traerEnlacesEntreSeleccionadas);
  const readOnly = useOpmStore((s) => s.readOnly);
  const iniciarAutosalvado = useOpmStore((s) => s.iniciarAutosalvado);
  // Ronda 19 L5: `dirty` ya no se lee aqui; ChipPersistencia lo consume.
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const confirmarSiDirty = useConfirmarSiDirty();
  const abrirDialogoPlantillas = useOpmStore((s) => s.abrirDialogoPlantillas);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const toggleAliasVisibles = useOpmStore((s) => s.toggleAliasVisibles);
  const toggleDescripcionesVisibles = useOpmStore((s) => s.toggleDescripcionesVisibles);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  const fijarModoImagenGlobal = useOpmStore((s) => s.fijarModoImagenGlobal);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const gridConfig = useOpmStore((s) => normalizarGridConfig(s.gridConfig ?? s.indice.preferenciasUi?.gridConfig));
  const toggleGrid = useOpmStore((s) => s.toggleGrid);
  const fijarGridConfig = useOpmStore((s) => s.fijarGridConfig);
  const aplicarLayoutSugerido = useOpmStore((s) => s.aplicarLayoutSugerido);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const cerrarVistaMapa = useOpmStore((s) => s.cerrarVistaMapa);
  // L2 r17: botón Simulación entra al modo (BarraSimulacion reemplaza Toolbar).
  const iniciarModoSimulacion = useOpmStore((s) => s.iniciarModoSimulacion);
  const alinearSeleccion = useOpmStore((s) => s.alinearSeleccion);
  const distribuirSeleccion = useOpmStore((s) => s.distribuirSeleccion);
  const alinearSeleccionEnlaces = useOpmStore((s) => s.alinearSeleccionEnlaces);
  const [gridModalAbierto, setGridModalAbierto] = useState(false);
  const [nombreNuevaCosa, setNombreNuevaCosa] = useState("");
  const [menuContextual, setMenuContextual] = useState<null | { enlaceId: Id; x: number; y: number }>(null);
  const [menuEntidad, setMenuEntidad] = useState<null | { aparienciaId: Id; entidadId: Id; x: number; y: number }>(null);
  // L2 ronda 21: viewport-aware toolbar. Mobile oculta clusters de modelado
  // pesado (Modelar/Conectar/Vista/Validar) y conserva sólo Modelo + Ayuda.
  // Tablet conserva todo pero cabrá mejor por la toolbar overflow existente.
  const breakpoint = useBreakpoint();
  const esMobile = breakpoint === "mobile";

  useEffect(() => iniciarAutosalvado(), [iniciarAutosalvado]);
  useEffect(() => {
    if (PantallaInicioLazy) return;
    void import("../PantallaInicio").then((modulo) => setPantallaInicioLazy(() => modulo.PantallaInicio));
  }, [PantallaInicioLazy]);
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
      const meta = metadataEntidadDesdeContextMenu(event);
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
  }, [seleccionarEntidad]);

  const entidadSeleccionada = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const puedeCrearAtributo = entidadSeleccionada?.tipo === "objeto";
  // Ronda 19 L5: el sufijo "(No guardado)" se reemplaza por <ChipPersistencia />
  // que comunica el estado de almacenamiento de forma estructurada (variante,
  // versiones, tiempo desde último save). El título queda limpio.
  const tituloModelo = modelo.nombre;
  const resumenPersistido = modeloPersistidoId ? modelosGuardados.find((item) => item.id === modeloPersistidoId) : undefined;
  const totalVersiones = resumenPersistido?.versiones?.length ?? 0;
  const demos = useMemo(() => listarFixtures(), []);
  const todoMultiSeleccion = seleccionados.length >= 2 ? seleccionados[seleccionados.length - 1] : null;
  const puedeEditarImagen = entidadSeleccionada?.tipo === "objeto";
  const hayMultiSeleccion = seleccionados.length >= 2;
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
    onConfigGrid: () => setGridModalAbierto(true),
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
  function handleNuevoModelo() {
    confirmarSiDirty(nuevoModelo);
  }
  function handleSeleccionDemo(event: Event) {
    const nombre = (event.currentTarget as HTMLSelectElement).value;
    if (nombre) confirmarSiDirty(() => cargarFixtureDemo(nombre));
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
      <div role="group" aria-label="Modelo" style={style.cluster} data-slot="cluster-modelo" data-cluster="modelo">
        <span style={style.clusterLabel}>Modelo</span>
        <div style={style.menuWrapper}>
          <button type="button" aria-haspopup="menu" aria-expanded={menuPrincipalAbierto} aria-label="Menú principal" title="Menú principal" style={style.iconButton} onClick={handleToggleMenuPrincipal}>☰</button>
          {/* P0-2: MenuPrincipal vive ahora en App.tsx para evitar
              duplicacion en el DOM. El boton aqui solo gatilla el store. */}
        </div>
        <span style={style.title}>{tituloModelo}</span>
        {/* Ronda 19 L5: slot estable para chip de persistencia en cluster Modelo. */}
        <ChipPersistencia />
        {resumenPersistido?.archivado ? <span style={style.archiveBadge}>ARCH</span> : null}
        {modeloPersistidoId && totalVersiones > 0 ? (
          <button type="button" style={style.versionButton} onClick={() => abrirDialogoVersiones(modeloPersistidoId)} title={`${totalVersiones} versiones guardadas`}>
            <img src={verFileIcon} alt="" style={style.versionIcon} />{totalVersiones}
          </button>
        ) : null}
        <button style={puedeDeshacer ? style.button : style.disabledButton} type="button" onClick={deshacer} disabled={!puedeDeshacer} aria-label="Deshacer" title="Deshacer · Ctrl+Z">↶</button>
        <button style={puedeRehacer ? style.button : style.disabledButton} type="button" onClick={rehacer} disabled={!puedeRehacer} aria-label="Rehacer" title="Rehacer · Ctrl+Shift+Z">↷</button>
        {/* L2 ronda 21: en mobile sólo mantenemos chip + menú + undo/redo. Las
            acciones Nuevo/Demo/Guardar/Cargar quedan accesibles desde
            MenuPrincipal (botón ☰) y reducen overflow horizontal. */}
        {esMobile ? null : (
          <>
            <button style={style.button} type="button" onClick={handleNuevoModelo} title="Nuevo modelo · descarta el actual si pides confirmación">Nuevo</button>
            <select style={style.demoSelect} aria-label="Cargar modelo de ejemplo" value="" onChange={handleSeleccionDemo}>
              <option value="" disabled>Demo</option>
              {demos.map((d) => <option key={d.modelo.nombre} value={d.modelo.nombre} title={d.proposito}>{d.modelo.nombre}</option>)}
            </select>
            <button style={style.button} type="button" onClick={guardarLocal} title="Guardar (Ctrl+S)">{readOnly ? <img src={lockIcon} alt="" style={style.lockIcon} /> : null}Guardar</button>
            {readOnly ? <span style={style.readOnlyBadge} data-testid="indicador-readonly">Solo lectura</span> : null}
            <button style={style.button} type="button" onClick={() => confirmarSiDirty(abrirCargarModelo)} title="Cargar modelo guardado">Cargar</button>
          </>
        )}
      </div>
      {esMobile ? null : (
      <div style={style.actions} data-testid="toolbar-actions-pesadas">
        <span style={style.divider} />
        <div role="group" aria-label="Modelar" style={style.cluster} data-slot="cluster-modelar" data-cluster="modelar">
          <span style={style.clusterLabel}>Modelar</span>
          <button style={style.button} type="button" onClick={crearObjeto} draggable onDragStart={dragToolbar("objeto")} data-testid="toolbar-drag-objeto" title="Crear objeto · arrastra al canvas o clic para insertar">Objeto</button>
          <button style={style.button} type="button" onClick={crearProceso} draggable onDragStart={dragToolbar("proceso")} data-testid="toolbar-drag-proceso" title="Crear proceso · arrastra al canvas o clic para insertar">Proceso</button>
          <button style={puedeCrearAtributo ? style.iconTextButton : style.disabledButton} type="button" disabled={!puedeCrearAtributo} draggable={puedeCrearAtributo} onDragStart={dragAtributoNumerico} onClick={() => crearAtributoNumerico({ nombre: "Valor [u]", tipoSlot: "float" })} title={puedeCrearAtributo ? "Crear atributo numérico en el objeto seleccionado" : "Selecciona un objeto"} data-testid="toolbar-crear-atributo-numerico">
            <img src={objectDragIcon} alt="" style={style.smallIcon} />+ Atributo
          </button>
          {/* Crear varios objetos/procesos: en banda con drag soportado.
              Decisión P3: 8+ smokes hacen `dragTo(canvas)` directamente sobre los
              testIds, y el menú ⋯ Más no soporta drag desde sus items. Mantener
              en cluster Modelar preserva la API de smokes y la affordance de
              arrastre originaria. */}
          <button style={modoCreacion === "objeto" ? style.activeButton : style.button} type="button" aria-pressed={modoCreacion === "objeto"} className={modoCreacion === "objeto" ? "boton-toolbar-activo" : undefined} draggable onDragStart={dragToolbar("objeto")} onClick={() => fijarModoCreacion(modoCreacion === "objeto" ? null : "objeto")} title={modoCreacion === "objeto" ? "Creación continua de objetos activa · clic para desactivar" : "Crear objetos en serie · cada clic en canvas inserta un objeto"} data-testid="toolbar-modo-creacion-objeto">Crear varios objetos</button>
          <button style={modoCreacion === "proceso" ? style.activeButton : style.button} type="button" aria-pressed={modoCreacion === "proceso"} className={modoCreacion === "proceso" ? "boton-toolbar-activo" : undefined} draggable onDragStart={dragToolbar("proceso")} onClick={() => fijarModoCreacion(modoCreacion === "proceso" ? null : "proceso")} title={modoCreacion === "proceso" ? "Creación continua de procesos activa · clic para desactivar" : "Crear procesos en serie · cada clic en canvas inserta un proceso"} data-testid="toolbar-modo-creacion-proceso">Crear varios procesos</button>
          {modelarSlot ?? null}
        </div>
        <span style={style.divider} />
        <div role="group" aria-label="Conectar" style={style.cluster} data-slot="cluster-conectar" data-cluster="conectar">
          <span style={style.clusterLabel}>Conectar</span>
          {conectarSlot ?? children}
        </div>
        <span style={style.divider} />
        <div role="group" aria-label="Vista" style={style.cluster} data-slot="cluster-vista" data-cluster="vista">
          <span style={style.clusterLabel}>Vista</span>
          <button style={gridConfig.activa ? style.activeButton : style.button} type="button" onClick={toggleGrid} aria-pressed={gridConfig.activa} data-testid="toggle-grid" title={gridConfig.activa ? "Grid activa · clic para ocultar" : "Mostrar grid del canvas"}>Grid</button>
          {/* Ronda 18 P3: `Config grid` se mantiene en banda. Decisión documentada
              en commit: 3 smokes (08, 11) hacen `getByTestId("config-grid").click()`
              directamente sin abrir el menú ⋯ Más, así que el en-banda es
              load-bearing. El menú "Más" lo espeja con `toolbar-mas-config-grid`. */}
          <button style={style.secondaryButton} type="button" onClick={() => setGridModalAbierto(true)} data-testid="config-grid" title="Configurar paso, color y snap del grid">Config grid</button>
          {/* Ronda 15 L4: layout sugerido como accion explicita. No persiste */}
          {/* automaticamente al cargar; cada clic crea una entrada undo atomica. */}
          <button style={style.button} type="button" onClick={aplicarLayoutSugerido} data-testid="toolbar-aplicar-layout" title="Auto-layout · reorganiza apariencias del OPD activo en niveles top-down. Undoable con Ctrl+Z.">Auto-layout</button>
          {/* L3 ronda 20: toggle del dock biblioteca. El testid del overlay legacy
              (`abrir-biblioteca-cosa`) vive en cluster Conectar via ToolbarCreacion;
              este toggle es nuevo (`toggle-biblioteca-dock`) y abre el panel
              acoplable bajo el árbol OPD. Atajo Ctrl+B. */}
          <ToggleBibliotecaDock />
        </div>
        <span style={style.divider} />
        <div role="group" aria-label="Validar" style={style.cluster} data-slot="cluster-validar" data-cluster="validar">
          <span style={style.clusterLabel}>Validar</span>
          <button style={vistaMapaActiva ? style.activeButton : style.button} type="button" onClick={vistaMapaActiva ? cerrarVistaMapa : abrirVistaMapa} aria-pressed={vistaMapaActiva} title={vistaMapaActiva ? "Cerrar mapa" : "Abrir mapa"}>Mapa</button>
          <button
            style={style.button}
            type="button"
            onClick={iniciarModoSimulacion}
            title="Entrar a modo simulación conceptual"
            data-testid="toolbar-simulacion"
          >
            Simulación
          </button>
          {validarSlot ?? null}
          {statusSlot ?? null}
        </div>
        <span style={style.divider} />
        <div role="group" aria-label="Ayuda" style={style.cluster} data-slot="cluster-ayuda" data-cluster="ayuda">
          <span style={style.clusterLabel}>Ayuda</span>
          <button
            type="button"
            style={style.iconTextButton}
            onClick={abrirDialogoComandos}
            title="Buscar comandos · Ctrl+K"
            data-testid="toolbar-command-palette"
          >
            ⌕
          </button>
          <ToolbarMas items={masItems} />
        </div>
      </div>
      )}
      <ModalConfiguracionGrid abierto={gridModalAbierto} config={gridConfig} onCerrar={() => setGridModalAbierto(false)} onGuardar={fijarGridConfig} />
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
      <DialogoGuardarPlantilla />
      {PantallaInicioLazy ? <PantallaInicioLazy /> : null}
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
  onAbrirPlantillas: () => void;
  onToggleAlias: () => void;
  onToggleDescripciones: () => void;
  onSiguienteModoImagen: () => void;
  onEditarImagen: () => void;
  onConfigGrid: () => void;
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
    label: p.uiAliasVisibles ? "Ocultar alias" : "Mostrar alias",
    activo: p.uiAliasVisibles,
    title: p.uiAliasVisibles ? "Ocultar alias bajo el nombre" : "Mostrar alias bajo el nombre",
    onClick: p.onToggleAlias,
  });
  items.push({
    kind: "accion",
    id: "desc-visibles",
    label: p.uiDescripcionesVisibles ? "Ocultar descripciones" : "Mostrar descripciones",
    activo: p.uiDescripcionesVisibles,
    title: p.uiDescripcionesVisibles ? "Ocultar descripciones bajo el nombre" : "Mostrar descripciones bajo el nombre",
    onClick: p.onToggleDescripciones,
  });
  items.push({
    kind: "accion",
    id: "modo-imagen-global",
    label: `Imagen global: ${etiquetaModoGlobal(p.uiModoImagenGlobal)}`,
    activo: p.uiModoImagenGlobal !== null,
    title: `Modo imagen global · ciclo Respeta → Img+Txt → Img → Texto. Actual: ${etiquetaModoGlobal(p.uiModoImagenGlobal)}`,
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
  items.push({ kind: "separador", id: "sep-plantillas", label: "Plantillas y vista" });
  items.push({
    kind: "accion",
    id: "abrir-plantillas",
    label: "Plantillas…",
    title: "Abrir biblioteca de plantillas",
    onClick: p.onAbrirPlantillas,
    testId: "toolbar-mas-plantillas",
  });
  items.push({
    kind: "accion",
    id: "config-grid",
    label: "Configurar grid…",
    title: "Configurar paso, color y snap del grid",
    onClick: p.onConfigGrid,
    testId: "toolbar-mas-config-grid",
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

  // ToolbarMapaSistema mantiene sus controles secundarios (Auto-refresh,
  // Estadisticas) en banda porque ese archivo queda fuera del scope L2.

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

function metadataEntidadDesdeContextMenu(event: MouseEvent): { aparienciaId: Id; entidadId: Id } | null {
  const target = event.target instanceof Element ? event.target : null;
  const cellEl = target?.closest?.(".joint-cell,[model-id],[data-model-id]");
  const modelId = cellEl?.getAttribute("model-id") ?? cellEl?.getAttribute("data-model-id");
  if (!modelId) return null;
  const adapter = (globalThis as typeof globalThis & { __opmJointAdapter?: GlobalJointAdapter }).__opmJointAdapter;
  const meta = adapter?.graph?.getCell?.(modelId)?.prop?.("opm") as { kind?: string; aparienciaId?: Id; entidadId?: Id } | undefined;
  if (meta?.kind !== "entidad" || !meta.aparienciaId || !meta.entidadId) return null;
  return { aparienciaId: meta.aparienciaId, entidadId: meta.entidadId };
}

/**
 * L3 ronda 20: toggle del dock biblioteca dentro del cluster Vista.
 * Subscriptor delgado para evitar re-renders innecesarios del resto de
 * ToolbarBase. Atajo Ctrl+B (registrado en App.tsx). El testid del
 * overlay legacy `abrir-biblioteca-cosa` vive en ToolbarCreacion.
 */
function ToggleBibliotecaDock() {
  const abierto = useOpmStore((s) => s.bibliotecaDockAbierto);
  const toggle = useOpmStore((s) => s.toggleBibliotecaDock);
  return (
    <button
      type="button"
      style={abierto ? style.activeButton : style.button}
      onClick={toggle}
      aria-pressed={abierto}
      data-testid="toggle-biblioteca-dock"
      title={abierto ? "Cerrar biblioteca dock (Ctrl+B)" : "Abrir biblioteca dock acoplada al árbol (Ctrl+B)"}
    >
      Biblioteca dock
    </button>
  );
}
