// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import modelWizardIcon from "../../../assets/svg/toolbar/modelWizard.svg";
import templateIcon from "../../../assets/svg/template.svg";
import { useState } from "preact/hooks";
import { useMenuPrincipalViewModel } from "../app/viewmodels/menuPrincipalViewModel";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";

/**
 * Entradas de menú para plantillas privadas: [Met §8.8], [JOYAS §1],
 * [V-52]/[V-123]. Reusa assets/svg/template.svg canónico.
 */
export function MenuPrincipal() {
  const confirmarSiDirty = useConfirmarSiDirty();
  const {
    abierto,
    cerrar,
    nuevoModelo,
    abrirPestanaNueva,
    guardarLocal,
    abrirGuardarComo,
    abrirCargarModelo,
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
    abrirVersiones,
    modeloPersistidoId,
    abrirDialogoConfiguracion,
    mostrarArchivados,
    mostrarVersiones,
    toggleMostrarArchivados,
    toggleMostrarVersiones,
    cargarFixtureDemo,
    vistaMapaActiva,
    toggleVistaMapa,
    toggleMapaPanelEstadisticas,
    gridConfig,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirTablaEnlaces,
    abrirDialogoPlantillas,
    abrirDialogoGuardarPlantilla,
    abrirDialogoImportarExportarJson,
    abrirCheatsheetAtajos,
    objetoSeleccionadoId,
    abrirModalUrls,
    iniciarAsistente,
    demos,
    copiarJsonAlPortapapeles,
  } = useMenuPrincipalViewModel();
  const [mostrarSubmenuDemos, setMostrarSubmenuDemos] = useState(false);

  const ejecutar = (accion: () => void) => {
    cerrar();
    accion();
  };

  return (
    <>
    {abierto ? <div role="menu" aria-label="Menú principal" style={style.menu}>
      <div aria-hidden="true" style={style.menuTitle}>Mi modelo</div>

      <MenuSection title="Modelo">
        <MenuItem label="Guardar" shortcut="Ctrl+S" onClick={() => ejecutar(guardarLocal)} />
        <MenuItem label="Cargar otro..." shortcut="Ctrl+O" onClick={() => ejecutar(() => confirmarSiDirty(abrirCargarModelo))} />
        <MenuItem label="Nuevo" shortcut="Ctrl+N" onClick={() => ejecutar(() => confirmarSiDirty(nuevoModelo))} />
        <MenuItem label="Abrir como pestaña" shortcut="Ctrl+T" onClick={() => ejecutar(abrirPestanaNueva)} />
        <MenuItem label="Renombrar..." onClick={() => ejecutar(abrirDialogoConfiguracion)} />
        <MenuItem label="Guardar como" onClick={() => ejecutar(abrirGuardarComo)} />
        <MenuItem label="Asistente guiado" onClick={() => ejecutar(iniciarAsistente)} />
      </MenuSection>

      <MenuSection title="Buscar">
        <MenuItem label="Buscar en el modelo" shortcut="Ctrl+F" onClick={() => ejecutar(abrirBusquedaCosas)} />
        <MenuItem label="Buscar en todo el workspace" shortcut="Ctrl+Shift+F" onClick={() => ejecutar(abrirBusquedaGlobal)} />
      </MenuSection>

      <MenuSection title="Vista">
        <MenuItem label="Mapa del sistema" shortcut={vistaMapaActiva ? "Activo" : undefined} onClick={() => ejecutar(toggleVistaMapa)} />
        <MenuItem label="Simulación conceptual" onClick={() => ejecutar(iniciarModoSimulacion)} />
        <MenuItem label={gridConfig.activa ? "Ocultar cuadrícula del canvas" : "Mostrar cuadrícula del canvas"} onClick={() => ejecutar(toggleGrid)} />
        <MenuItem label="Auto-layout" onClick={() => ejecutar(aplicarLayoutSugerido)} />
        {vistaMapaActiva ? (
          <>
            <MenuItem label="Exportar mapa como PNG" onClick={() => ejecutar(() => solicitarExportMapa("png"))} />
            <MenuItem label="Exportar mapa como SVG" onClick={() => ejecutar(() => solicitarExportMapa("svg"))} />
            <MenuItem label="Estadísticas del modelo" onClick={() => ejecutar(toggleMapaPanelEstadisticas)} />
          </>
        ) : null}
      </MenuSection>

      <MenuSection title="Más">
        <MenuItem label="Guardar como plantilla..." icon={templateIcon} onClick={() => ejecutar(abrirDialogoGuardarPlantilla)} />
        <MenuItem label="Plantillas..." icon={templateIcon} onClick={() => ejecutar(abrirDialogoPlantillas)} />
        <MenuItem label="Configuración..." onClick={() => ejecutar(abrirDialogoConfiguracion)} />
        <MenuItem label="Cargar archivados..." onClick={() => ejecutar(() => confirmarSiDirty(() => abrirCargarModelo({ mostrarArchivados: true })))} />
        <MenuItem label={mostrarArchivados ? "Ocultar archivados" : "Mostrar archivados"} onClick={() => ejecutar(toggleMostrarArchivados)} />
        <MenuItem label={mostrarVersiones ? "Ocultar glifos de versiones" : "Mostrar glifos de versiones"} onClick={() => ejecutar(toggleMostrarVersiones)} />
        {modeloPersistidoId ? (
          <MenuItem label="Versiones del modelo" onClick={() => ejecutar(() => abrirVersiones(modeloPersistidoId))} />
        ) : null}
        <MenuItem label="Exportar JSON" onClick={() => ejecutar(copiarJsonAlPortapapeles)} />
        <MenuItem label="Importar/Exportar JSON..." onClick={() => ejecutar(abrirDialogoImportarExportarJson)} />
        <div
          role="none"
          style={style.submenuWrapper}
          onMouseEnter={() => setMostrarSubmenuDemos(true)}
          onMouseLeave={() => setMostrarSubmenuDemos(false)}
        >
          <MenuItem label="Ejemplos" shortcut="›" expanded={mostrarSubmenuDemos} />
          {mostrarSubmenuDemos ? (
            <div role="menu" aria-label="Ejemplos" style={style.submenu}>
              {demos.map((d) => (
                <button
                  key={d.modelo.nombre}
                  type="button"
                  role="menuitem"
                  style={style.submenuItem}
                  title={d.proposito}
                  onClick={() => ejecutar(() => confirmarSiDirty(() => cargarFixtureDemo(d.modelo.nombre)))}
                >
                  {d.modelo.nombre}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <MenuItem label="Tabla de enlaces" onClick={() => ejecutar(abrirTablaEnlaces)} />
        {objetoSeleccionadoId ? (
          <MenuItem label="URLs del objeto" onClick={() => ejecutar(() => abrirModalUrls(objetoSeleccionadoId))} />
        ) : null}
        <MenuItem label="Atajos de teclado..." onClick={() => ejecutar(abrirCheatsheetAtajos)} />
      </MenuSection>
      <div aria-hidden="true" style={style.footer}>
        <img src={modelWizardIcon} alt="" style={style.icon} />
        <span>Workspace local</span>
      </div>
    </div> : null}
    </>
  );
}

interface MenuSectionProps {
  title: string;
  children: preact.ComponentChildren;
}

function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <section role="none" style={style.section}>
      <div aria-hidden="true" style={style.sectionTitle}>{title}</div>
      <div role="none" style={style.sectionBody}>{children}</div>
    </section>
  );
}

interface MenuItemProps {
  label: string;
  shortcut?: string | undefined;
  icon?: string | undefined;
  disabled?: boolean;
  expanded?: boolean | undefined;
  onClick?: () => void;
}

function MenuItem({ label, shortcut, icon, disabled = false, expanded, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-label={label}
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      aria-expanded={expanded}
      style={disabled ? style.itemDisabled : style.item}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <span style={style.itemContent}>
        {icon ? <img src={icon} alt="" style={style.itemIcon} /> : null}
        <span style={style.itemLabel}>{label}</span>
      </span>
      {shortcut ? <span aria-hidden="true" style={style.shortcut}>{shortcut}</span> : null}
    </button>
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
    width: "292px",
    maxHeight: "calc(100vh - 56px)",
    overflowY: "auto",
    padding: "8px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menuPrincipal,
    display: "grid",
    gap: "8px",
  },
  menuTitle: {
    padding: "2px 8px 0",
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 800,
  },
  section: {
    display: "grid",
    gap: "4px",
    paddingTop: "6px",
    borderTop: `1px solid ${tokens.colors.bordeChrome}`,
  },
  sectionTitle: {
    padding: "0 8px",
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  sectionBody: {
    display: "grid",
    gap: "1px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  itemContent: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  itemLabel: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemIcon: {
    width: "18px",
    height: "18px",
    flexShrink: 0,
  },
  shortcut: {
    flexShrink: 0,
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    fontWeight: 800,
  },
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
  submenuWrapper: {
    position: "relative",
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
  icon: {
    width: "18px",
    height: "18px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
