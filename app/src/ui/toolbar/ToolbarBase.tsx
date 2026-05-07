/**
 * ViewContainer ToolbarBase: chrome estable del modelador. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-12.
 */
import { lazy, Suspense } from "preact/compat";
import { useEffect, useMemo, useState } from "preact/hooks";
import lockIcon from "../../../../assets/svg/lock.svg";
import objectDragIcon from "../../../../assets/svg/objectDrag.svg";
import verFileIcon from "../../../../assets/svg/verFile.svg";
import { listarFixtures } from "../../store/runtime";
import { useOpmStore } from "../../store";
import { useConfirmarSiDirty } from "../ConfirmacionContext";
import { DialogoGuardarPlantilla } from "../DialogoGuardarPlantilla";
import { MenuContextualEnlace } from "../MenuContextualEnlace";
import { MenuContextualEntidad } from "../MenuContextualEntidad";
import type { Id, TipoEnlace } from "../../modelo/tipos";
import { dragAtributoNumerico, dragToolbar, toolbarStyle as style } from "./toolbarStyles";

const DialogoPlantillas = lazy(() => import("../DialogoPlantillas").then((m) => ({ default: m.DialogoPlantillas })));
const DialogoTraerConectados = lazy(() => import("../DialogoTraerConectados").then((m) => ({ default: m.DialogoTraerConectados })));

type MenuPrincipalComponent = () => preact.JSX.Element;
type PantallaInicioComponent = () => preact.JSX.Element | null;
type GlobalJointAdapter = { graph?: { getCell?: (id: string) => { prop?: (name: string) => unknown } | undefined } };

/**
 * ViewContainer ToolbarBase: chrome estable. [JOYAS §1-3], [V-0c], IFML H-2/H-5.
 * Referencias semanticas verificadas: opm-extracted layout/header, element-tool-bar, main, opl-container.
 */
interface ToolbarBaseProps {
  children?: preact.ComponentChildren;
}

export function ToolbarBase({ children }: ToolbarBaseProps) {
  const [MenuPrincipalLazy, setMenuPrincipalLazy] = useState<MenuPrincipalComponent | null>(null);
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
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const abrirDialogoVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const puedeDeshacer = useOpmStore((s) => s.puedeDeshacer);
  const puedeRehacer = useOpmStore((s) => s.puedeRehacer);
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const renombrarSeleccionada = useOpmStore((s) => s.renombrarSeleccionada);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const abrirDialogoTraerConectados = useOpmStore((s) => s.abrirDialogoTraerConectados);
  const traerConectadosSeleccionado = useOpmStore((s) => s.traerConectadosSeleccionado);
  const traerEnlacesEntreSeleccionadas = useOpmStore((s) => s.traerEnlacesEntreSeleccionadas);
  const ocultarAparienciaSeleccionada = useOpmStore((s) => s.ocultarAparienciaSeleccionada);
  const copiarEstiloEnlaceAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloEnlaceDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const borrarEnlacesEnLote = useOpmStore((s) => s.borrarEnlacesEnLote);
  const conectarSeleccionAlTodo = useOpmStore((s) => s.conectarSeleccionAlTodo);
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const readOnly = useOpmStore((s) => s.readOnly);
  const iniciarAutosalvado = useOpmStore((s) => s.iniciarAutosalvado);
  const dirty = useOpmStore((s) => s.dirty);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const confirmarSiDirty = useConfirmarSiDirty();
  const [nuevaCosa, setNuevaCosa] = useState<null | { entidadId: Id; nombre: string }>(null);
  const [nombreNuevaCosa, setNombreNuevaCosa] = useState("");
  const [menuContextual, setMenuContextual] = useState<null | { enlaceId: Id; x: number; y: number }>(null);
  const [menuEntidad, setMenuEntidad] = useState<null | { aparienciaId: Id; entidadId: Id; x: number; y: number }>(null);

  useEffect(() => iniciarAutosalvado(), [iniciarAutosalvado]);
  useEffect(() => {
    if (!menuPrincipalAbierto || MenuPrincipalLazy) return;
    void import("../MenuPrincipal").then((modulo) => setMenuPrincipalLazy(() => modulo.MenuPrincipal));
  }, [MenuPrincipalLazy, menuPrincipalAbierto]);
  useEffect(() => {
    if (PantallaInicioLazy) return;
    void import("../PantallaInicio").then((modulo) => setPantallaInicioLazy(() => modulo.PantallaInicio));
  }, [PantallaInicioLazy]);
  useEffect(() => {
    const onNuevaCosa = (event: Event) => {
      const detail = (event as CustomEvent<{ entidadId?: Id; nombre?: string }>).detail;
      const entidadId = detail?.entidadId;
      if (!entidadId) return;
      const entidad = modelo.entidades[entidadId];
      const nombre = detail?.nombre ?? entidad?.nombre ?? "Cosa";
      setNuevaCosa({ entidadId, nombre });
      setNombreNuevaCosa(nombre);
    };
    window.addEventListener("opm:nueva-cosa", onNuevaCosa);
    return () => window.removeEventListener("opm:nueva-cosa", onNuevaCosa);
  }, [modelo.entidades]);
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
  const tituloModelo = modeloPersistidoId ? modelo.nombre : `${modelo.nombre} (No guardado)`;
  const resumenPersistido = modeloPersistidoId ? modelosGuardados.find((item) => item.id === modeloPersistidoId) : undefined;
  const totalVersiones = resumenPersistido?.versiones?.length ?? 0;
  const demos = useMemo(() => listarFixtures(), []);
  const todoMultiSeleccion = seleccionados.length >= 2 ? seleccionados[seleccionados.length - 1] : null;

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
    renombrarSeleccionada(nombreNuevaCosa);
    setNuevaCosa(null);
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
  function handleTraerEntidad() {
    abrirDialogoTraerConectados();
    setMenuEntidad(null);
  }
  function handleTraerEntidadDefault() {
    traerConectadosSeleccionado();
    setMenuEntidad(null);
  }
  function handleTraerEnlacesEntidad() {
    traerEnlacesEntreSeleccionadas();
    setMenuEntidad(null);
  }
  function handleOcultarEntidad() {
    ocultarAparienciaSeleccionada();
    setMenuEntidad(null);
  }
  function handleConectarMultiContextual(tipo: TipoEnlace) {
    if (!todoMultiSeleccion) return;
    conectarSeleccionAlTodo(todoMultiSeleccion, tipo);
    setMenuContextual(null);
  }

  return (
    <>
      <div style={style.menuWrapper}>
        <button type="button" aria-haspopup="menu" aria-expanded={menuPrincipalAbierto} aria-label="Menú principal" title="Menú principal" style={style.iconButton} onClick={handleToggleMenuPrincipal}>☰</button>
        {MenuPrincipalLazy ? <MenuPrincipalLazy /> : null}
      </div>
      <span style={style.title}>{tituloModelo}{dirty && modeloPersistidoId ? " (No guardado)" : ""}</span>
      {resumenPersistido?.archivado ? <span style={style.archiveBadge}>ARCH</span> : null}
      {modeloPersistidoId && totalVersiones > 0 ? (
        <button type="button" style={style.versionButton} onClick={() => abrirDialogoVersiones(modeloPersistidoId)} title={`${totalVersiones} versiones guardadas`}>
          <img src={verFileIcon} alt="" style={style.versionIcon} />{totalVersiones}
        </button>
      ) : null}
      <div style={style.actions}>
        <span style={style.divider} />
        <button style={style.button} type="button" onClick={crearObjeto} draggable onDragStart={dragToolbar("objeto")} data-testid="toolbar-drag-objeto" title="Crear objeto · arrastra al canvas o clic para insertar">Objeto</button>
        <button style={style.button} type="button" onClick={crearProceso} draggable onDragStart={dragToolbar("proceso")} data-testid="toolbar-drag-proceso" title="Crear proceso · arrastra al canvas o clic para insertar">Proceso</button>
        <button style={puedeCrearAtributo ? style.iconTextButton : style.disabledButton} type="button" disabled={!puedeCrearAtributo} draggable={puedeCrearAtributo} onDragStart={dragAtributoNumerico} onClick={() => crearAtributoNumerico({ nombre: "Valor [u]", tipoSlot: "float" })} title={puedeCrearAtributo ? "Crear atributo numérico en el objeto seleccionado" : "Selecciona un objeto"} data-testid="toolbar-crear-atributo-numerico">
          <img src={objectDragIcon} alt="" style={style.smallIcon} />+ Atributo
        </button>
        <button style={modoCreacion === "objeto" ? style.activeButton : style.button} type="button" aria-pressed={modoCreacion === "objeto"} className={modoCreacion === "objeto" ? "boton-toolbar-activo" : undefined} draggable onDragStart={dragToolbar("objeto")} onClick={() => fijarModoCreacion(modoCreacion === "objeto" ? null : "objeto")} title={modoCreacion === "objeto" ? "Modo creación objeto activo · clic para desactivar" : "Activar modo creación objeto · clic en canvas inserta uno tras otro"}>Modo objeto</button>
        <button style={modoCreacion === "proceso" ? style.activeButton : style.button} type="button" aria-pressed={modoCreacion === "proceso"} className={modoCreacion === "proceso" ? "boton-toolbar-activo" : undefined} draggable onDragStart={dragToolbar("proceso")} onClick={() => fijarModoCreacion(modoCreacion === "proceso" ? null : "proceso")} title={modoCreacion === "proceso" ? "Modo creación proceso activo · clic para desactivar" : "Activar modo creación proceso · clic en canvas inserta uno tras otro"}>Modo proceso</button>
        <span style={style.divider} />
        <button style={puedeDeshacer ? style.button : style.disabledButton} type="button" onClick={deshacer} disabled={!puedeDeshacer} title="Deshacer · Ctrl+Z">Deshacer</button>
        <button style={puedeRehacer ? style.button : style.disabledButton} type="button" onClick={rehacer} disabled={!puedeRehacer} title="Rehacer · Ctrl+Shift+Z">Rehacer</button>
        <span style={style.divider} />
        <button style={style.button} type="button" onClick={handleNuevoModelo} title="Nuevo modelo · descarta el actual si pides confirmación">Nuevo</button>
        <select style={style.demoSelect} aria-label="Cargar modelo de ejemplo" value="" onChange={handleSeleccionDemo}>
          <option value="" disabled>Demo</option>
          {demos.map((d) => <option key={d.modelo.nombre} value={d.modelo.nombre} title={d.proposito}>{d.modelo.nombre}</option>)}
        </select>
        <button style={style.button} type="button" onClick={guardarLocal} title="Guardar (Ctrl+S)">{readOnly ? <img src={lockIcon} alt="" style={style.lockIcon} /> : null}Guardar</button>
        {readOnly ? <span style={style.readOnlyBadge} data-testid="indicador-readonly">Solo lectura</span> : null}
        <button style={style.button} type="button" onClick={() => confirmarSiDirty(abrirCargarModelo)} title="Cargar modelo guardado">Cargar</button>
        {children}
      </div>
      <ModelessToolbarLayer
        nuevaCosa={nuevaCosa}
        nombreNuevaCosa={nombreNuevaCosa}
        setNombreNuevaCosa={setNombreNuevaCosa}
        setNuevaCosa={setNuevaCosa}
        onSubmitNuevaCosa={handleGuardarNombreNuevaCosa}
        menuContextual={menuContextual}
        setMenuContextual={setMenuContextual}
        menuEntidad={menuEntidad}
        setMenuEntidad={setMenuEntidad}
        onEstiloEnlace={handleEstiloEnlace}
        onCopiarEstilo={handleCopiarEstiloEnlace}
        onPegarEstilo={handlePegarEstiloEnlace}
        onEliminarEnlace={handleEliminarEnlace}
        multi={seleccionados.length >= 2}
        onTraer={handleTraerEntidad}
        onTraerDefault={handleTraerEntidadDefault}
        onTraerEnlaces={handleTraerEnlacesEntidad}
        onOcultar={handleOcultarEntidad}
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
  setNuevaCosa: (value: null | { entidadId: Id; nombre: string }) => void;
  onSubmitNuevaCosa: (event: Event) => void;
  menuContextual: { enlaceId: Id; x: number; y: number } | null;
  setMenuContextual: (value: null | { enlaceId: Id; x: number; y: number }) => void;
  menuEntidad: { aparienciaId: Id; entidadId: Id; x: number; y: number } | null;
  setMenuEntidad: (value: null | { aparienciaId: Id; entidadId: Id; x: number; y: number }) => void;
  onEstiloEnlace: (id: Id) => void;
  onCopiarEstilo: (id: Id) => void;
  onPegarEstilo: (id: Id) => void;
  onEliminarEnlace: (id: Id) => void;
  onConectarMultiAlTodo?: (tipo: TipoEnlace) => void;
  multi: boolean;
  onTraer: () => void;
  onTraerDefault: () => void;
  onTraerEnlaces: () => void;
  onOcultar: () => void;
}) {
  return (
    <>
      {props.nuevaCosa ? (
        <form style={style.nombreModal} data-testid="modal-nombre-cosa" onSubmit={props.onSubmitNuevaCosa}>
          <label style={style.nombreField}>
            <span style={style.nombreLabel}>Nombre</span>
            <input autoFocus style={style.nombreInput} value={props.nombreNuevaCosa} onInput={(event) => props.setNombreNuevaCosa(event.currentTarget.value)} onKeyDown={(event) => { if (event.key === "Escape") props.setNuevaCosa(null); }} />
          </label>
          <button type="submit" style={style.primarySmall}>OK</button>
        </form>
      ) : null}
      {props.menuContextual ? (
        <MenuContextualEnlace enlaceId={props.menuContextual.enlaceId} x={props.menuContextual.x} y={props.menuContextual.y} onCerrar={() => props.setMenuContextual(null)} onEstilo={props.onEstiloEnlace} onCopiarEstilo={props.onCopiarEstilo} onPegarEstilo={props.onPegarEstilo} onEliminar={props.onEliminarEnlace} onConectarMultiAlTodo={props.onConectarMultiAlTodo} />
      ) : null}
      {props.menuEntidad ? (
        <MenuContextualEntidad aparienciaId={props.menuEntidad.aparienciaId} x={props.menuEntidad.x} y={props.menuEntidad.y} multi={props.multi} onCerrar={() => props.setMenuEntidad(null)} onTraer={props.onTraer} onTraerDefault={props.onTraerDefault} onTraerEnlaces={props.onTraerEnlaces} onOcultar={props.onOcultar} />
      ) : null}
    </>
  );
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
