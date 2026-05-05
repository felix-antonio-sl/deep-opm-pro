import { useEffect } from "preact/hooks";
import verFileIcon from "../../../assets/svg/verFile.svg";
import { useOpmStore } from "../store";
import type { TipoEnlace } from "../modelo/tipos";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { MenuPrincipal } from "./MenuPrincipal";

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
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const refrescarVistaMapa = useOpmStore((s) => s.refrescarVistaMapa);
  const mapaAutoRefresh = useOpmStore((s) => s.mapaAutoRefresh);
  const toggleMapaAutoRefresh = useOpmStore((s) => s.toggleMapaAutoRefresh);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const toggleAliasVisibles = useOpmStore((s) => s.toggleAliasVisibles);
  const toggleDescripcionesVisibles = useOpmStore((s) => s.toggleDescripcionesVisibles);
  const confirmarSiDirty = useConfirmarSiDirty();

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

  const selectorEnlaceDeshabilitado = !seleccionId && !modoEnlace;
  const tituloModelo = modeloPersistidoId ? modelo.nombre : `${modelo.nombre} (No guardado)`;
  const resumenPersistido = modeloPersistidoId ? modelosGuardados.find((item) => item.id === modeloPersistidoId) : undefined;
  const totalVersiones = resumenPersistido?.versiones?.length ?? 0;

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
        <MenuPrincipal />
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
        <button style={style.button} type="button" onClick={crearObjeto}>Objeto</button>
        <button style={style.button} type="button" onClick={crearProceso}>Proceso</button>
        <button
          style={modoCreacion === "objeto" ? style.activeButton : style.button}
          type="button"
          onClick={() => fijarModoCreacion(modoCreacion === "objeto" ? null : "objeto")}
        >
          Objeto en canvas
        </button>
        <button
          style={modoCreacion === "proceso" ? style.activeButton : style.button}
          type="button"
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
        {modoCreacion ? (
          <button style={style.secondaryButton} type="button" onClick={() => fijarModoCreacion(null)}>Cancelar creación</button>
        ) : null}
        {seleccionados.length >= 2 ? (
          <>
            <span style={style.divider} />
            <span style={style.selectionCount}>{seleccionados.length} seleccionados</span>
            <button style={style.secondaryButton} type="button" onClick={eliminarSeleccion} title="Eliminar selección">Eliminar</button>
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
    </div>
  );
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
    width: "118px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    fontSize: "13px",
    fontWeight: 600,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function esCampoEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable=true]"));
}
