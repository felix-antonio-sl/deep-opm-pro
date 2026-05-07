// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import modelWizardIcon from "../../../assets/svg/toolbar/modelWizard.svg";
import templateIcon from "../../../assets/svg/template.svg";
import { useEffect, useMemo, useState } from "preact/hooks";
import { listarFixtures } from "../store/runtime";
import { useOpmStore } from "../store";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

/**
 * Entradas de menú para plantillas privadas: [Met §8.8], [JOYAS §1],
 * [V-52]/[V-123]. Reusa assets/svg/template.svg canónico.
 */
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
  const dialogoRenombrarModeloAbierto = useOpmStore((s) => s.dialogoRenombrarModeloAbierto);
  const abrirRenombrarModelo = useOpmStore((s) => s.abrirRenombrarModelo);
  const cerrarRenombrarModelo = useOpmStore((s) => s.cerrarRenombrarModelo);
  const renombrarModeloActual = useOpmStore((s) => s.renombrarModeloActual);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);
  const cargarFixtureDemo = useOpmStore((s) => s.cargarFixtureDemo);
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const abrirVistaMapa = useOpmStore((s) => s.abrirVistaMapa);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const toggleMapaPanelEstadisticas = useOpmStore((s) => s.toggleMapaPanelEstadisticas);
  const abrirTablaEnlaces = useOpmStore((s) => s.abrirTablaEnlaces);
  const abrirDialogoPlantillas = useOpmStore((s) => s.abrirDialogoPlantillas);
  const abrirDialogoGuardarPlantilla = useOpmStore((s) => s.abrirDialogoGuardarPlantilla);
  const abrirCheatsheetAtajos = useOpmStore((s) => s.abrirCheatsheetAtajos);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const modelo = useOpmStore((s) => s.modelo);
  const abrirModalUrls = useOpmStore((s) => s.abrirModalUrls);
  const confirmarSiDirty = useConfirmarSiDirty();
  const iniciarAsistente = useOpmStore((s) => s.iniciarAsistente);
  const cargarEjemploOrganizacional = useOpmStore((s) => s.cargarEjemploOrganizacional);
  const [nombreRenombrar, setNombreRenombrar] = useState(modelo.nombre);
  const [mostrarSubmenuDemos, setMostrarSubmenuDemos] = useState(false);
  const demos = useMemo(() => listarFixtures(), []);

  useEffect(() => {
    if (dialogoRenombrarModeloAbierto) setNombreRenombrar(modelo.nombre);
  }, [dialogoRenombrarModeloAbierto, modelo.nombre]);

  const ejecutar = (accion: () => void) => {
    cerrar();
    accion();
  };

  return (
    <>
    {abierto ? <div role="menu" aria-label="Menú principal" style={style.menu}>
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
      <button type="button" role="menuitem" style={style.itemWithIcon} onClick={() => ejecutar(abrirDialogoGuardarPlantilla)}>
        <img src={templateIcon} alt="" style={style.itemIcon} />
        <span>Guardar como plantilla...</span>
      </button>
      <button type="button" role="menuitem" style={style.itemWithIcon} onClick={() => ejecutar(abrirDialogoPlantillas)}>
        <img src={templateIcon} alt="" style={style.itemIcon} />
        <span>Plantillas...</span>
      </button>
      <button type="button" role="menuitem" style={modeloPersistidoId ? style.item : style.itemDisabled} disabled={!modeloPersistidoId} onClick={() => ejecutar(abrirRenombrarModelo)}>
        Renombrar...
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
      <div
        role="menuitem"
        style={{ ...style.item, position: "relative" }}
        onMouseEnter={() => setMostrarSubmenuDemos(true)}
        onMouseLeave={() => setMostrarSubmenuDemos(false)}
      >
        Ejemplos ▸
        {mostrarSubmenuDemos ? (
          <div style={style.submenu}>
            {demos.map((d) => (
              <button
                key={d.modelo.nombre}
                type="button"
                style={style.submenuItem}
                title={d.proposito}
                onClick={() => ejecutar(() => confirmarSiDirty(() => cargarFixtureDemo(d.modelo.nombre)))}
              >
                {d.modelo.nombre}
              </button>
            ))}
            <div style={style.submenuDivider} />
            <button
              type="button"
              style={style.submenuItem}
              onClick={() => ejecutar(() => confirmarSiDirty(cargarEjemploOrganizacional))}
            >
              Ejemplo organizacional
            </button>
          </div>
        ) : null}
      </div>
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
    </div> : null}
    <Dialogo
      open={dialogoRenombrarModeloAbierto}
      title="Renombrar modelo"
      onCancel={cerrarRenombrarModelo}
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrarRenombrarModelo}>Cancelar</button>
          <button type="button" style={nombreRenombrar.trim() ? style.primaryButton : style.disabledButton} disabled={!nombreRenombrar.trim()} onClick={() => renombrarModeloActual(nombreRenombrar)}>Renombrar</button>
        </>
      )}
    >
      <label style={style.label}>
        <span>Nombre del modelo</span>
        <input
          aria-label="Nombre del modelo"
          style={style.input}
          value={nombreRenombrar}
          onInput={(event) => setNombreRenombrar(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && nombreRenombrar.trim()) renombrarModeloActual(nombreRenombrar);
          }}
          autoFocus
        />
      </label>
    </Dialogo>
    </>
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
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menuPrincipal,
    display: "grid",
    gap: "2px",
  },
  item: {
    width: "100%",
    minHeight: "34px",
    padding: "0 10px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.sm,
    background: "transparent",
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
  },
  itemDisabled: {
    width: "100%",
    minHeight: "34px",
    padding: "0 10px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.sm,
    background: "transparent",
    color: tokens.colors.textoDeshabilitado,
    cursor: "not-allowed",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
  },
  itemWithIcon: {
    width: "100%",
    minHeight: "34px",
    padding: "0 10px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.sm,
    background: "transparent",
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  itemIcon: {
    width: "18px",
    height: "18px",
    flexShrink: 0,
  },
  label: {
    display: "grid",
    gap: "6px",
    minWidth: "min(420px, calc(100vw - 80px))",
    color: tokens.colors.textoSecundario,
    fontSize: "13px",
    fontWeight: 700,
  },
  input: {
    height: "34px",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    padding: "0 10px",
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
  },
  primaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  disabledButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoDeshabilitado, color: tokens.colors.textoDeshabilitado, fontSize: "13px", fontWeight: 700 },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
    padding: "8px 10px 4px",
    borderTop: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 700,
  },
  divider: {
    height: "1px",
    margin: "2px 0",
    background: tokens.colors.bordeChrome,
  },
  submenu: {
    position: "absolute",
    top: 0,
    left: "100%",
    zIndex: 901,
    minWidth: "200px",
    padding: "4px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menuLigero,
  },
  submenuItem: {
    display: "block",
    width: "100%",
    padding: "6px 12px",
    border: "none",
    borderRadius: tokens.radii.sm,
    background: "transparent",
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  submenuDivider: {
    height: "1px",
    margin: "3px 8px",
    background: tokens.colors.bordeChrome,
  },
  icon: {
    width: "18px",
    height: "18px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
