import { useEffect, useMemo, useState } from "preact/hooks";
import verFileIcon from "../../../assets/svg/verFile.svg";
import { normalizarGridConfig } from "../canvas/grid";
import { useOpmStore } from "../store";
import type { Id, ModoImagenEntidad, TipoEnlace, TipoEntidad } from "../modelo/tipos";
import { BibliotecaCosa } from "./BibliotecaCosa";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { MenuContextualEnlace } from "./MenuContextualEnlace";
import { MenuTipoEnlace } from "./MenuTipoEnlace";
import { ModalConfiguracionGrid } from "./ModalConfiguracionGrid";

type MenuPrincipalComponent = () => preact.JSX.Element;
type PantallaInicioComponent = () => preact.JSX.Element | null;

export const TIPOS_ENLACE: Array<{ tipo: TipoEnlace; label: string }> = [
  { tipo: "agregacion", label: "Agregación" },
  { tipo: "exhibicion", label: "Exhibición" },
  { tipo: "generalizacion", label: "Generalización" },
  { tipo: "clasificacion", label: "Clasificación" },
  { tipo: "agente", label: "Agente" },
  { tipo: "instrumento", label: "Instrumento" },
  { tipo: "consumo", label: "Consumo" },
  { tipo: "resultado", label: "Resultado" },
  { tipo: "efecto", label: "Efecto" },
  { tipo: "invocacion", label: "Invocación" },
];

export function Toolbar() {
  const [MenuPrincipalLazy, setMenuPrincipalLazy] = useState<MenuPrincipalComponent | null>(null);
  const [PantallaInicioLazy, setPantallaInicioLazy] = useState<PantallaInicioComponent | null>(null);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const abrirMenuPrincipal = useOpmStore((s) => s.abrirMenuPrincipal);
  const cerrarMenuPrincipal = useOpmStore((s) => s.cerrarMenuPrincipal);
  const crearObjeto = useOpmStore((s) => s.crearObjetoDemo);
  const crearProceso = useOpmStore((s) => s.crearProcesoDemo);
  const fijarModoCreacion = useOpmStore((s) => s.fijarModoCreacion);
  const cargarDemo = useOpmStore((s) => s.cargarDemo);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const abrirCargarModelo = useOpmStore((s) => s.abrirCargarModelo);
  const deshacer = useOpmStore((s) => s.deshacer);
  const rehacer = useOpmStore((s) => s.rehacer);
  const elegirTipoEnlace = useOpmStore((s) => s.elegirTipoEnlace);
  const cancelarEnlace = useOpmStore((s) => s.cancelarEnlace);
  const limpiarMensaje = useOpmStore((s) => s.limpiarMensaje);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const mensaje = useOpmStore((s) => s.mensaje);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const eliminarSeleccion = useOpmStore((s) => s.eliminarSeleccion);
  const alinearSeleccionEnlaces = useOpmStore((s) => s.alinearSeleccionEnlaces);
  const dirty = useOpmStore((s) => s.dirty);
  const menuPrincipalAbierto = useOpmStore((s) => s.menuPrincipalAbierto);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const abrirDialogoVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const puedeDeshacer = useOpmStore((s) => s.puedeDeshacer);
  const puedeRehacer = useOpmStore((s) => s.puedeRehacer);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);
  const renombrarSeleccionada = useOpmStore((s) => s.renombrarSeleccionada);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const conectarSeleccionAlTodo = useOpmStore((s) => s.conectarSeleccionAlTodo);
  const copiarEstiloEnlaceAlPortapapeles = useOpmStore((s) => s.copiarEstiloEnlaceAlPortapapeles);
  const pegarEstiloEnlaceDesdePortapapeles = useOpmStore((s) => s.pegarEstiloEnlaceDesdePortapapeles);
  const borrarEnlacesEnLote = useOpmStore((s) => s.borrarEnlacesEnLote);
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const iniciarAutosalvado = useOpmStore((s) => s.iniciarAutosalvado);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const refrescarVistaMapa = useOpmStore((s) => s.refrescarVistaMapa);
  const mapaAutoRefresh = useOpmStore((s) => s.mapaAutoRefresh);
  const toggleMapaAutoRefresh = useOpmStore((s) => s.toggleMapaAutoRefresh);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);
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
  const alinearSeleccion = useOpmStore((s) => s.alinearSeleccion);
  const distribuirSeleccion = useOpmStore((s) => s.distribuirSeleccion);
  const confirmarSiDirty = useConfirmarSiDirty();
  const [gridModalAbierto, setGridModalAbierto] = useState(false);
  const [bibliotecaAbierta, setBibliotecaAbierta] = useState(false);
  const [menuTiposAbierto, setMenuTiposAbierto] = useState(false);
  const [direccionTipoEnlace, setDireccionTipoEnlace] = useState<"saliente" | "entrante">("saliente");
  const [nuevaCosa, setNuevaCosa] = useState<null | { entidadId: Id; nombre: string }>(null);
  const [nombreNuevaCosa, setNombreNuevaCosa] = useState("");
  const [menuContextual, setMenuContextual] = useState<null | { enlaceId: Id; x: number; y: number }>(null);

  useEffect(() => {
    iniciarAutosalvado();
  }, [iniciarAutosalvado]);

  useEffect(() => {
    if (!menuPrincipalAbierto || MenuPrincipalLazy) return;
    void import("./MenuPrincipal").then((modulo) => setMenuPrincipalLazy(() => modulo.MenuPrincipal));
  }, [MenuPrincipalLazy, menuPrincipalAbierto]);

  useEffect(() => {
    if (PantallaInicioLazy) return;
    void import("./PantallaInicio").then((modulo) => setPantallaInicioLazy(() => modulo.PantallaInicio));
  }, [PantallaInicioLazy]);

  useEffect(() => {
    const manejarAtajo = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      const key = event.key.toLowerCase();
      if (key === "s") {
        event.preventDefault();
        guardarLocal();
        return;
      }
      if (esCampoEditable(event.target)) return;
      if (key === "z" && event.shiftKey) {
        event.preventDefault();
        rehacer();
        return;
      }
      if (key === "z") {
        event.preventDefault();
        deshacer();
        return;
      }
      if (key === "y") {
        event.preventDefault();
        rehacer();
      }
    };
    window.addEventListener("keydown", manejarAtajo);
    return () => window.removeEventListener("keydown", manejarAtajo);
  }, [deshacer, guardarLocal, rehacer]);

  useEffect(() => {
    if (!mensaje || modoEnlace || modoCreacion) return undefined;
    const timeout = window.setTimeout(limpiarMensaje, 4_500);
    return () => window.clearTimeout(timeout);
  }, [limpiarMensaje, mensaje, modoCreacion, modoEnlace]);

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
      if (!detail?.enlaceId) return;
      setMenuContextual({ enlaceId: detail.enlaceId, x: detail.x, y: detail.y });
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
    const manejarAtajoEstilo = (event: KeyboardEvent) => {
      if (!event.ctrlKey || !event.altKey) return;
      if (esCampoEditable(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === "c" && enlaceSeleccionId) {
        event.preventDefault();
        copiarEstiloEnlaceAlPortapapeles(enlaceSeleccionId);
      }
      if (key === "v" && enlaceSeleccionId) {
        event.preventDefault();
        pegarEstiloEnlaceDesdePortapapeles(enlaceSeleccionId);
      }
    };
    window.addEventListener("keydown", manejarAtajoEstilo);
    return () => window.removeEventListener("keydown", manejarAtajoEstilo);
  }, [copiarEstiloEnlaceAlPortapapeles, enlaceSeleccionId, pegarEstiloEnlaceDesdePortapapeles]);

  const selectorEnlaceDeshabilitado = !seleccionId && !modoEnlace;
  const entidadSeleccionada = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const puedeEditarImagen = entidadSeleccionada?.tipo === "objeto";
  const tituloModelo = modeloPersistidoId ? modelo.nombre : `${modelo.nombre} (No guardado)`;
  const resumenPersistido = modeloPersistidoId ? modelosGuardados.find((item) => item.id === modeloPersistidoId) : undefined;
  const totalVersiones = resumenPersistido?.versiones?.length ?? 0;
  const origenMenuTipo = useMemo(() => seleccionId ?? seleccionados.find((id) => !!modelo.entidades[id]) ?? null, [modelo.entidades, seleccionId, seleccionados]);
  const destinoMenuTipo = useMemo(() => seleccionados.find((id) => id !== origenMenuTipo && !!modelo.entidades[id]) ?? null, [modelo.entidades, origenMenuTipo, seleccionados]);
  const todoMultiSeleccion = seleccionados.length >= 2 ? seleccionados[seleccionados.length - 1] : null;

  return (
    <div style={style.bar}>
      <div style={style.menuWrapper}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuPrincipalAbierto}
          aria-label="Menú principal"
          title="Menú principal"
          style={style.iconButton}
          onClick={() => (menuPrincipalAbierto ? cerrarMenuPrincipal() : abrirMenuPrincipal())}
        >
          ☰
        </button>
        {MenuPrincipalLazy ? <MenuPrincipalLazy /> : null}
      </div>
      <span style={style.title}>{tituloModelo}{dirty && modeloPersistidoId ? " (No guardado)" : ""}</span>
      {resumenPersistido?.archivado ? <span style={style.archiveBadge}>ARCH</span> : null}
      {modeloPersistidoId && totalVersiones > 0 ? (
        <button
          type="button"
          style={style.versionButton}
          onClick={() => abrirDialogoVersiones(modeloPersistidoId)}
          title={`${totalVersiones} versiones guardadas`}
        >
          <img src={verFileIcon} alt="" style={style.versionIcon} />
          {totalVersiones}
        </button>
      ) : null}
      <div style={style.actions}>
        <span style={style.divider} />
        <button style={style.button} type="button" onClick={crearObjeto} draggable onDragStart={dragToolbar("objeto")} data-testid="toolbar-drag-objeto">Objeto</button>
        <button style={style.button} type="button" onClick={crearProceso} draggable onDragStart={dragToolbar("proceso")} data-testid="toolbar-drag-proceso">Proceso</button>
        <button
          style={modoCreacion === "objeto" ? style.activeButton : style.button}
          type="button"
          draggable
          onDragStart={dragToolbar("objeto")}
          onClick={() => fijarModoCreacion(modoCreacion === "objeto" ? null : "objeto")}
        >
          Objeto en canvas
        </button>
        <button
          style={modoCreacion === "proceso" ? style.activeButton : style.button}
          type="button"
          draggable
          onDragStart={dragToolbar("proceso")}
          onClick={() => fijarModoCreacion(modoCreacion === "proceso" ? null : "proceso")}
        >
          Proceso en canvas
        </button>
        <span style={style.divider} />
        <button style={puedeDeshacer ? style.button : style.disabledButton} type="button" onClick={deshacer} disabled={!puedeDeshacer}>Deshacer</button>
        <button style={puedeRehacer ? style.button : style.disabledButton} type="button" onClick={rehacer} disabled={!puedeRehacer}>Rehacer</button>
        <span style={style.divider} />
        <button style={style.button} type="button" onClick={() => confirmarSiDirty(nuevoModelo)}>Nuevo</button>
        <button style={style.button} type="button" onClick={() => confirmarSiDirty(cargarDemo)}>Demo</button>
        <button style={style.button} type="button" onClick={guardarLocal} title="Guardar (Ctrl+S)">Guardar</button>
        <button style={style.button} type="button" onClick={() => confirmarSiDirty(abrirCargarModelo)}>Cargar</button>
        <span style={style.divider} />
        <label style={style.linkPicker}>
          <span style={style.linkPickerLabel}>Enlace</span>
          <select
            aria-label="Tipo de enlace"
            title={selectorEnlaceDeshabilitado ? "Selecciona una entidad origen" : undefined}
            disabled={selectorEnlaceDeshabilitado}
            style={selectorEnlaceDeshabilitado ? style.disabledSelect : modoEnlace ? style.activeSelect : style.select}
            value={modoEnlace?.tipo ?? ""}
            onChange={(event) => {
              const tipo = (event.currentTarget as HTMLSelectElement).value;
              if (tipo) elegirTipoEnlace(tipo as TipoEnlace);
              else cancelarEnlace();
            }}
          >
            <option value="">Tipo...</option>
            {TIPOS_ENLACE.map((item) => (
              <option key={item.tipo} value={item.tipo}>{item.label}</option>
            ))}
          </select>
        </label>
        {modoEnlace ? (
          <button style={style.secondaryButton} type="button" onClick={cancelarEnlace}>Cancelar</button>
        ) : null}
        <button
          style={menuTiposAbierto ? style.activeButton : style.button}
          type="button"
          onClick={() => setMenuTiposAbierto((actual) => !actual)}
          data-testid="abrir-menu-tipo-enlace"
        >
          Tipos válidos
        </button>
        <button
          style={bibliotecaAbierta ? style.activeButton : style.button}
          type="button"
          onClick={() => setBibliotecaAbierta((actual) => !actual)}
          data-testid="abrir-biblioteca-cosa"
        >
          Biblioteca
        </button>
        {modoCreacion ? (
          <button style={style.secondaryButton} type="button" onClick={() => fijarModoCreacion(null)}>Cancelar creación</button>
        ) : null}
        {seleccionados.length >= 2 ? (
          <>
            <span style={style.divider} />
            <span style={style.selectionCount}>{seleccionados.length} seleccionados</span>
            <button style={style.secondaryButton} type="button" onClick={eliminarSeleccion} title="Eliminar selección">Eliminar</button>
            {todoMultiSeleccion ? (
              <button
                style={style.secondaryButton}
                type="button"
                onClick={() => conectarSeleccionAlTodo(todoMultiSeleccion, "agregacion")}
                title="Usa el último seleccionado como todo"
                data-testid="conectar-multi-al-todo"
              >
                Agregar al todo
              </button>
            ) : null}
            <select
              aria-label="Alinear cosas seleccionadas"
              style={style.compactSelect}
              defaultValue=""
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (value) alinearSeleccion(value as "izq" | "centro" | "der" | "sup" | "medio" | "inf");
                event.currentTarget.value = "";
              }}
              data-testid="alinear-cosas"
            >
              <option value="">Alinear cosas...</option>
              <option value="izq">Izquierda</option>
              <option value="centro">Centro</option>
              <option value="der">Derecha</option>
              <option value="sup">Arriba</option>
              <option value="medio">Medio</option>
              <option value="inf">Abajo</option>
            </select>
            <select
              aria-label="Distribuir cosas seleccionadas"
              style={style.compactSelect}
              defaultValue=""
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (value) distribuirSeleccion(value as "horizontal" | "vertical");
                event.currentTarget.value = "";
              }}
              data-testid="distribuir-cosas"
            >
              <option value="">Distribuir...</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
            <select
              aria-label="Alinear enlaces seleccionados"
              style={style.compactSelect}
              defaultValue=""
              onChange={(event) => {
                const value = event.currentTarget.value;
                if (value) alinearSeleccionEnlaces(value as "izquierda" | "derecha" | "arriba" | "abajo");
                event.currentTarget.value = "";
              }}
            >
              <option value="">Alinear...</option>
              <option value="izquierda">Izquierda</option>
              <option value="derecha">Derecha</option>
              <option value="arriba">Arriba</option>
              <option value="abajo">Abajo</option>
            </select>
          </>
        ) : null}
        {mensaje ? <span style={style.status}>{mensaje}</span> : null}
        <span style={style.divider} />
        <button
          style={gridConfig.activa ? style.activeButton : style.button}
          type="button"
          onClick={toggleGrid}
          aria-pressed={gridConfig.activa}
          data-testid="toggle-grid"
        >
          Grid
        </button>
        <button style={style.secondaryButton} type="button" onClick={() => setGridModalAbierto(true)} data-testid="config-grid">
          Config grid
        </button>
        <span style={style.divider} />
        <button
          style={uiAliasVisibles ? style.activeButton : style.button}
          type="button"
          onClick={toggleAliasVisibles}
          aria-pressed={uiAliasVisibles}
        >
          Alias
        </button>
        <button
          style={uiDescripcionesVisibles ? style.activeButton : style.button}
          type="button"
          onClick={toggleDescripcionesVisibles}
          aria-pressed={uiDescripcionesVisibles}
        >
          Desc
        </button>
        <button
          style={puedeEditarImagen ? style.button : style.disabledButton}
          type="button"
          disabled={!puedeEditarImagen}
          onClick={() => seleccionId && abrirModalImagen(seleccionId)}
          title={puedeEditarImagen ? "Editar imagen del objeto seleccionado" : "Selecciona un objeto"}
        >
          📷
        </button>
        <button
          style={uiModoImagenGlobal ? style.activeButton : style.button}
          type="button"
          onClick={() => fijarModoImagenGlobal(siguienteModoGlobal(uiModoImagenGlobal))}
          aria-pressed={uiModoImagenGlobal !== null}
          data-testid="toolbar-modo-imagen-global"
          title={`Modo imagen global: ${etiquetaModoGlobal(uiModoImagenGlobal)}`}
        >
          {etiquetaModoGlobal(uiModoImagenGlobal)}
        </button>
        {vistaMapaActiva ? (
          <>
            <span style={style.divider} />
            <button
              style={style.button}
              type="button"
              onClick={refrescarVistaMapa}
              data-testid="refrescar-mapa"
            >
              Refrescar mapa
            </button>
            <button
              style={mapaAutoRefresh ? style.activeButton : style.button}
              type="button"
              onClick={toggleMapaAutoRefresh}
              aria-pressed={mapaAutoRefresh}
            >
              Auto-refresh
            </button>
            <button style={style.button} type="button" onClick={toggleMapaPanelEstadisticas}>
              Estadísticas
            </button>
          </>
        ) : null}
        {autosalvado.activo ? (
          <span
            style={autosalvado.salvando ? style.autosaveSaving : style.autosaveIdle}
            title={autosalvado.ultimo
              ? `Autosalvado activo · Último: ${new Date(autosalvado.ultimo).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`
              : "Autosalvado activo"}
          >
            {autosalvado.salvando ? "●" : "○"} Auto
          </span>
        ) : null}
      </div>
      <ModalConfiguracionGrid
        abierto={gridModalAbierto}
        config={gridConfig}
        onCerrar={() => setGridModalAbierto(false)}
        onGuardar={fijarGridConfig}
      />
      {bibliotecaAbierta ? (
        <BibliotecaCosa
          modelo={modelo}
          opdActivoId={opdActivoId}
          onCerrar={() => setBibliotecaAbierta(false)}
          onNavegarOpd={cambiarOpdActivo}
        />
      ) : null}
      {menuTiposAbierto ? (
        <MenuTipoEnlace
          modelo={modelo}
          origenId={origenMenuTipo}
          destinoId={destinoMenuTipo}
          direccion={direccionTipoEnlace}
          onDireccion={setDireccionTipoEnlace}
          onElegir={(tipo, origenId, destinoId) => {
            crearEnlaceEntreEntidades(origenId, destinoId, tipo);
            setMenuTiposAbierto(false);
          }}
        />
      ) : null}
      {nuevaCosa ? (
        <form
          style={style.nombreModal}
          data-testid="modal-nombre-cosa"
          onSubmit={(event) => {
            event.preventDefault();
            renombrarSeleccionada(nombreNuevaCosa);
            setNuevaCosa(null);
          }}
        >
          <label style={style.nombreField}>
            <span style={style.nombreLabel}>Nombre</span>
            <input
              autoFocus
              style={style.nombreInput}
              value={nombreNuevaCosa}
              onInput={(event) => setNombreNuevaCosa(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setNuevaCosa(null);
              }}
            />
          </label>
          <button type="submit" style={style.primarySmall}>OK</button>
        </form>
      ) : null}
      {menuContextual ? (
        <MenuContextualEnlace
          enlaceId={menuContextual.enlaceId}
          x={menuContextual.x}
          y={menuContextual.y}
          onCerrar={() => setMenuContextual(null)}
          onEstilo={(id) => {
            seleccionarEnlace(id);
            setMenuContextual(null);
          }}
          onCopiarEstilo={(id) => {
            copiarEstiloEnlaceAlPortapapeles(id);
            setMenuContextual(null);
          }}
          onPegarEstilo={(id) => {
            pegarEstiloEnlaceDesdePortapapeles(id);
            setMenuContextual(null);
          }}
          onEliminar={(id) => {
            borrarEnlacesEnLote([id]);
            setMenuContextual(null);
          }}
        />
      ) : null}
      {PantallaInicioLazy ? <PantallaInicioLazy /> : null}
    </div>
  );
}

function dragToolbar(tipo: TipoEntidad) {
  return (event: DragEvent) => {
    event.dataTransfer?.setData("application/x-opm-tipo", tipo);
    event.dataTransfer?.setData("text/plain", tipo);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
  };
}

const style = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "7px 12px",
    background: "#ffffff",
    borderBottom: "1px solid #d9e0ea",
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: 0,
    flex: "1 1 auto",
    overflowX: "auto",
  },
  menuWrapper: {
    position: "relative",
    flex: "0 0 auto",
  },
  iconButton: {
    width: "34px",
    height: "34px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1,
  },
  button: {
    height: "34px",
    minWidth: "76px",
    padding: "0 14px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  activeButton: {
    height: "34px",
    minWidth: "76px",
    padding: "0 14px",
    border: "1px solid #3BC3FF",
    borderRadius: "4px",
    background: "#eaf8ff",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  disabledButton: {
    height: "34px",
    minWidth: "76px",
    padding: "0 14px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    cursor: "default",
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  title: {
    flex: "0 0 auto",
    maxWidth: "210px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  archiveBadge: {
    display: "inline-flex",
    alignItems: "center",
    height: "20px",
    padding: "0 6px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    color: "#586D8C",
    background: "#ffffff",
    fontSize: "10px",
    fontWeight: 800,
    lineHeight: 1,
    flex: "0 0 auto",
  },
  versionButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    height: "24px",
    padding: "0 7px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
    flex: "0 0 auto",
  },
  versionIcon: {
    width: "14px",
    height: "14px",
  },
  secondaryButton: {
    height: "34px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    background: "#ffffff",
    color: "#475467",
    cursor: "pointer",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  linkPicker: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "34px",
    flex: "0 0 auto",
  },
  linkPickerLabel: {
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  select: {
    height: "34px",
    width: "148px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 600,
  },
  activeSelect: {
    height: "34px",
    width: "148px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#e8eef5",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 700,
  },
  disabledSelect: {
    height: "34px",
    width: "148px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "not-allowed",
  },
  divider: {
    width: "1px",
    height: "24px",
    flex: "0 0 auto",
    background: "#d9e0ea",
  },
  status: {
    color: "#475467",
    fontSize: "13px",
    whiteSpace: "nowrap",
  },
  autosaveIdle: {
    color: "#98a2b3",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    cursor: "default",
  },
  autosaveSaving: {
    color: "#586D8C",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    cursor: "default",
  },
  selectionCount: {
    color: "#344054",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  compactSelect: {
    height: "34px",
    width: "136px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 600,
  },
  nombreModal: {
    position: "fixed",
    zIndex: 42,
    top: "58px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "end",
    gap: "8px",
    padding: "10px",
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.16)",
  },
  nombreField: {
    display: "grid",
    gap: "4px",
  },
  nombreLabel: {
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  nombreInput: {
    width: "220px",
    height: "32px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    padding: "0 8px",
    outlineColor: "#586D8C",
    fontSize: "13px",
  },
  primarySmall: {
    height: "32px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#586D8C",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function esCampoEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable=true]"));
}

function siguienteModoGlobal(modo: ModoImagenEntidad | null): ModoImagenEntidad | null {
  if (modo === null) return "imagen-texto";
  if (modo === "imagen-texto") return "imagen";
  if (modo === "imagen") return "texto";
  return null;
}

function etiquetaModoGlobal(modo: ModoImagenEntidad | null): string {
  if (modo === "imagen-texto") return "Img+Txt";
  if (modo === "imagen") return "Img";
  if (modo === "texto") return "Texto";
  return "Respeta";
}
