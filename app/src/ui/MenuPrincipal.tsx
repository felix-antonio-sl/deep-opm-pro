// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import modelWizardIcon from "../../../assets/svg/toolbar/modelWizard.svg";
import templateIcon from "../../../assets/svg/template.svg";
import { useMenuPrincipalViewModel } from "../app/viewmodels/menuPrincipalViewModel";
import { descargarOpdActualSvg } from "../render/jointjs/mapaExport";
import { useCanvasPaper } from "./CanvasAdapterContext";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";
import { etiquetaModoGlobal, siguienteModoGlobal } from "./toolbar/toolbarStyles";

/**
 * Entradas de menú para plantillas privadas: [Met §8.8], [JOYAS §1],
 * [V-52]/[V-123]. Reusa assets/svg/template.svg canónico.
 */
export function MenuPrincipal() {
  const confirmarSiDirty = useConfirmarSiDirty();
  const canvasPaper = useCanvasPaper();
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
    modelo,
    opdActivoId,
    vistaMapaActiva,
    toggleMapaPanelEstadisticas,
    abrirTablaEnlaces,
    abrirDialogoPlantillas,
    abrirDialogoGuardarPlantilla,
    abrirCheatsheetAtajos,
    objetoSeleccionadoId,
    abrirModalUrls,
    iniciarAsistente,
    copiarJsonAlPortapapeles,
    // Ronda 27 III.A cierre: items absorbidos desde ⋯ Más.
    uiAliasVisibles,
    uiDescripcionesVisibles,
    toggleAliasVisibles,
    toggleDescripcionesVisibles,
    uiModoImagenGlobal,
    fijarModoImagenGlobal,
    editarImagenObjetoSeleccionado,
    gridActiva,
    toggleGrid,
    aplicarLayoutSugerido,
    bibliotecaDockAbierto,
    toggleBibliotecaDock,
    toggleVistaMapa,
    iniciarModoSimulacion,
  } = useMenuPrincipalViewModel();

  const ejecutar = (accion: () => void) => {
    cerrar();
    accion();
  };
  const exportarOpdActualSvg = () => {
    if (!canvasPaper) return;
    void descargarOpdActualSvg(canvasPaper, modelo, opdActivoId);
  };

  return (
    <>
    {abierto ? <div role="menu" aria-label="Menú principal" style={style.menu}>
      <div aria-hidden="true" style={style.menuTitle}>Mi modelo</div>

      <MenuSection title="Modelo">
        <MenuItem label="Guardar" shortcut="Ctrl+S" onClick={() => ejecutar(guardarLocal)} />
        <MenuItem label="Guardar como" onClick={() => ejecutar(abrirGuardarComo)} />
        <MenuItem label="Abrir / importar..." shortcut="Ctrl+O" onClick={() => ejecutar(abrirCargarModelo)} />
        <MenuItem label="Nuevo" shortcut="Ctrl+N" onClick={() => ejecutar(() => confirmarSiDirty(nuevoModelo))} />
        <MenuItem label="Abrir como pestaña" shortcut="Ctrl+T" onClick={() => ejecutar(abrirPestanaNueva)} />
        <MenuItem label="Renombrar..." onClick={() => ejecutar(abrirDialogoConfiguracion)} />
        <MenuItem label="Configuración..." onClick={() => ejecutar(abrirDialogoConfiguracion)} />
        <MenuItem label="Asistente guiado" onClick={() => ejecutar(iniciarAsistente)} />
      </MenuSection>

      <MenuSection title="Buscar">
        <MenuItem label="Buscar en el modelo" shortcut="Ctrl+F" onClick={() => ejecutar(abrirBusquedaCosas)} />
        <MenuItem label="Buscar en todo el workspace" shortcut="Ctrl+Shift+F" onClick={() => ejecutar(abrirBusquedaGlobal)} />
      </MenuSection>

      <MenuSection title="Exportar">
        {vistaMapaActiva ? (
          <>
            <MenuItem label="Exportar mapa como PNG" onClick={() => ejecutar(() => solicitarExportMapa("png"))} />
            <MenuItem label="Exportar mapa como SVG" onClick={() => ejecutar(() => solicitarExportMapa("svg"))} />
            <MenuItem label="Estadísticas del modelo" onClick={() => ejecutar(toggleMapaPanelEstadisticas)} />
          </>
        ) : (
          <MenuItem label="Exportar OPD actual como SVG" disabled={!canvasPaper} onClick={() => ejecutar(exportarOpdActualSvg)} />
        )}
        <MenuItem label="Exportar JSON" onClick={() => ejecutar(copiarJsonAlPortapapeles)} />
      </MenuSection>

      <MenuSection title="Plantillas">
        <MenuItem label="Guardar como plantilla..." icon={templateIcon} onClick={() => ejecutar(abrirDialogoGuardarPlantilla)} />
        <MenuItem label="Plantillas..." icon={templateIcon} onClick={() => ejecutar(abrirDialogoPlantillas)} />
      </MenuSection>

      {/* Ronda 27 III.A cierre: la sección Vista absorbe los toggles globales
          que antes vivían en el `⋯ Más` (apariencia + canvas). Conservamos
          los `data-testid="toolbar-mas-*"` para que los smokes existentes
          sigan apuntando a estos items canónicos sin churn de migración. */}
      <MenuSection title="Vista">
        <MenuItem
          label={uiAliasVisibles ? "Alias visibles" : "Alias ocultos"}
          activo={uiAliasVisibles}
          onClick={() => ejecutar(toggleAliasVisibles)}
        />
        <MenuItem
          label={uiDescripcionesVisibles ? "Descripciones visibles" : "Descripciones ocultas"}
          activo={uiDescripcionesVisibles}
          onClick={() => ejecutar(toggleDescripcionesVisibles)}
        />
        <MenuItem
          label={`Imagen: ${etiquetaModoGlobal(uiModoImagenGlobal)}`}
          activo={uiModoImagenGlobal !== null}
          testId="toolbar-mas-modo-imagen-global"
          onClick={() => ejecutar(() => fijarModoImagenGlobal(siguienteModoGlobal(uiModoImagenGlobal)))}
        />
        {objetoSeleccionadoId ? (
          <MenuItem
            label="Editar imagen del objeto…"
            testId="toolbar-mas-editar-imagen"
            onClick={() => ejecutar(editarImagenObjetoSeleccionado)}
          />
        ) : null}
        <MenuItem
          label={gridActiva ? "Cuadrícula visible" : "Cuadrícula oculta"}
          activo={gridActiva}
          testId="toolbar-mas-toggle-grid"
          onClick={() => ejecutar(toggleGrid)}
        />
        <MenuItem
          label="Biblioteca dock"
          activo={bibliotecaDockAbierto}
          testId="toolbar-mas-biblioteca-dock"
          onClick={() => ejecutar(toggleBibliotecaDock)}
        />
      </MenuSection>

      <MenuSection title="Workspace">
        <MenuItem label={mostrarArchivados ? "Ocultar archivados" : "Mostrar archivados"} onClick={() => ejecutar(toggleMostrarArchivados)} />
        <MenuItem label={mostrarVersiones ? "Ocultar glifos de versiones" : "Mostrar glifos de versiones"} onClick={() => ejecutar(toggleMostrarVersiones)} />
        {modeloPersistidoId ? (
          <MenuItem label="Versiones del modelo" onClick={() => ejecutar(() => abrirVersiones(modeloPersistidoId))} />
        ) : null}
      </MenuSection>

      <MenuSection title="Herramientas">
        <MenuItem label="Tabla de enlaces" onClick={() => ejecutar(abrirTablaEnlaces)} />
        {/* Ronda 27 III.A cierre: Auto-layout, Mapa del sistema y Simulación
            conceptual se absorben aquí desde el `⋯ Más` retirado. */}
        <MenuItem
          label="Auto-layout"
          testId="toolbar-mas-auto-layout"
          onClick={() => ejecutar(aplicarLayoutSugerido)}
        />
        <MenuItem
          label="Mapa del sistema"
          activo={vistaMapaActiva}
          testId="toolbar-mas-mapa"
          onClick={() => ejecutar(toggleVistaMapa)}
        />
        <MenuItem
          label="Simulación conceptual"
          testId="toolbar-mas-simulacion"
          onClick={() => ejecutar(iniciarModoSimulacion)}
        />
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
  /** Ronda 27 III.A: marca toggles activos (alias, descripciones, grid, dock, mapa). */
  activo?: boolean;
  /** Ronda 27 III.A: preserva los `data-testid` heredados de `⋯ Más` para no romper smokes. */
  testId?: string;
  onClick?: () => void;
}

function MenuItem({ label, shortcut, icon, disabled = false, expanded, activo, testId, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      aria-label={label}
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      aria-expanded={expanded}
      aria-pressed={activo === undefined ? undefined : activo}
      data-testid={testId}
      style={disabled ? style.itemDisabled : activo ? style.itemActivo : style.item}
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
    top: "46px",
    left: "10px",
    zIndex: 900,
    width: "320px",
    maxHeight: "calc(100vh - 62px)",
    overflowY: "auto",
    padding: "10px",
    border: `1px solid ${tokens.colors.bordePanel}`,
    borderRadius: tokens.radii.lg,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menuPrincipal,
    display: "grid",
    gap: "10px",
  },
  menuTitle: {
    padding: "2px 10px 0",
    color: tokens.colors.textoPrimario,
    fontSize: "14px",
    fontWeight: 800,
  },
  section: {
    display: "grid",
    gap: "4px",
    paddingTop: "8px",
    borderTop: `1px solid ${tokens.colors.bordeChrome}`,
  },
  sectionTitle: {
    padding: "0 10px",
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
    minHeight: "36px",
    padding: "0 12px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.md,
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
  // Ronda 27 III.A: toggles activos en el menú principal (alias, grid, dock, mapa).
  itemActivo: {
    width: "100%",
    minHeight: "36px",
    padding: "0 12px",
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.acentoUiSuave,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 800,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  itemDisabled: {
    width: "100%",
    minHeight: "36px",
    padding: "0 12px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.md,
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
    padding: "10px 12px 5px",
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
    borderRadius: tokens.radii.lg,
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
