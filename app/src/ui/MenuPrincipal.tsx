import modelWizardIcon from "../../../assets/svg/toolbar/modelWizard.svg";
import { useOpmStore } from "../store";
import { useConfirmarSiDirty } from "./ConfirmacionContext";

export function MenuPrincipal() {
  const abierto = useOpmStore((s) => s.menuPrincipalAbierto);
  const cerrar = useOpmStore((s) => s.cerrarMenuPrincipal);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const abrirPestanaNueva = useOpmStore((s) => s.abrirPestanaNueva);
  const guardarLocal = useOpmStore((s) => s.guardarLocal);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);
  const abrirCargarModelo = useOpmStore((s) => s.abrirCargarModelo);
  const abrirBusquedaCosas = useOpmStore((s) => s.abrirBusquedaCosas);
  const abrirBusquedaGlobal = useOpmStore((s) => s.abrirDialogoBuscarGlobal);
  const abrirArchivados = useOpmStore((s) => s.abrirDialogoArchivados);
  const abrirVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);
  const cargarDemo = useOpmStore((s) => s.cargarDemo);
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);
  const abrirTablaEnlaces = useOpmStore((s) => s.abrirTablaEnlaces);
  const abrirCheatsheetAtajos = useOpmStore((s) => s.abrirCheatsheetAtajos);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const modelo = useOpmStore((s) => s.modelo);
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);
  const confirmarSiDirty = useConfirmarSiDirty();
  const iniciarAsistente = useOpmStore((s) => s.iniciarAsistente);

  if (!abierto) return null;

  const ejecutar = (accion: () => void) => {
    cerrar();
    accion();
  };

  return (
    <div role="menu" aria-label="Menú principal" style={style.menu}>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(nuevoModelo)}>
        Nuevo
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(abrirPestanaNueva)}>
        Nuevo modelo en pestana
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(iniciarAsistente)}>
        Nuevo modelo por asistente
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(guardarLocal)}>
        Guardar
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(abrirGuardarComo)}>
        Guardar como
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(() => confirmarSiDirty(abrirCargarModelo))}>
        Cargar
      </button>
      <div aria-hidden="true" style={style.divider} />
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(abrirBusquedaCosas)}>
        Buscar cosas (Ctrl+F)
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(abrirBusquedaGlobal)}>
        Buscar global (Ctrl+Shift+F)
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(abrirArchivados)}>
        Archivados
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(toggleMostrarArchivados)}>
        {mostrarArchivados ? "Ocultar archivados" : "Mostrar archivados"}
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(toggleMostrarVersiones)}>
        {mostrarVersiones ? "Ocultar glifos de versiones" : "Mostrar glifos de versiones"}
      </button>
      {modeloPersistidoId ? (
        <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(() => abrirVersiones(modeloPersistidoId))}>
          Versiones del modelo
        </button>
      ) : null}
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(() => abrirVistaMapa())}>
        Mapa del sistema
      </button>
      {vistaMapaActiva ? (
        <>
          <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(() => solicitarExportMapa("png"))}>
            Exportar mapa como PNG
          </button>
          <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(() => solicitarExportMapa("svg"))}>
            Exportar mapa como SVG
          </button>
          <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(toggleMapaPanelEstadisticas)}>
            Estadísticas del modelo
          </button>
        </>
      ) : null}
      <button
        type="button"
        role="menuitem"
        style={style.item}
        onClick={() => ejecutar(() => {
          const json = exportarJson();
          void globalThis.navigator?.clipboard?.writeText(json);
        })}
      >
        Exportar JSON
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(() => confirmarSiDirty(cargarDemo))}>
        Demo
      </button>
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(abrirTablaEnlaces)}>
        Tabla de enlaces
      </button>
      {seleccionId && modelo.entidades[seleccionId]?.tipo === "objeto" ? (
        <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(() => abrirModalUrls(seleccionId))}>
          URLs del objeto
        </button>
      ) : null}
      <button type="button" role="menuitem" style={style.item} onClick={() => ejecutar(abrirCheatsheetAtajos)}>
        Atajos de teclado...
      </button>
      <div aria-hidden="true" style={style.footer}>
        <img src={modelWizardIcon} alt="" style={style.icon} />
        <span>Workspace local</span>
      </div>
    </div>
  );
}

function solicitarExportMapa(formato: "png" | "svg"): void {
  window.dispatchEvent(new CustomEvent("deep-opm-pro:exportar-mapa", { detail: { formato } }));
}

const style = {
  menu: {
    position: "absolute",
    top: "40px",
    left: 0,
    zIndex: 900,
    width: "210px",
    padding: "6px",
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    background: "#ffffff",
    boxShadow: "0 14px 32px rgba(16, 24, 40, 0.18)",
    display: "grid",
    gap: "2px",
  },
  item: {
    width: "100%",
    minHeight: "34px",
    padding: "0 10px",
    border: "1px solid transparent",
    borderRadius: "4px",
    background: "transparent",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
    padding: "8px 10px 4px",
    borderTop: "1px solid #e4eaf1",
    color: "#667085",
    fontSize: "12px",
    fontWeight: 700,
  },
  divider: {
    height: "1px",
    margin: "2px 0",
    background: "#e4eaf1",
  },
  icon: {
    width: "18px",
    height: "18px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
