// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import modelWizardIcon from "../../../assets/svg/toolbar/modelWizard.svg";
import { useEffect, useRef } from "preact/hooks";
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
  const menuRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    if (!abierto) return;
    const cerrarDesdeExterior = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuRef.current?.contains(target)) return;
      cerrar();
    };
    window.addEventListener("pointerdown", cerrarDesdeExterior, { capture: true });
    return () => window.removeEventListener("pointerdown", cerrarDesdeExterior, { capture: true });
  }, [abierto, cerrar]);

  return (
    <>
    {abierto ? <div ref={menuRef} role="menu" aria-label="Menú principal" style={style.menu}>
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
        <MenuItem label="Exportar OPD actual como SVG" disabled={!canvasPaper} onClick={() => ejecutar(exportarOpdActualSvg)} />
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
        {/* Ronda 27 III.A cierre: Auto-layout y Simulación conceptual se
            absorben aquí desde el `⋯ Más` retirado. */}
        <MenuItem
          label="Auto-layout"
          testId="toolbar-mas-auto-layout"
          onClick={() => ejecutar(aplicarLayoutSugerido)}
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

/**
 * Estilos del MenuPrincipal — Ronda 28 L2 (Bauhaus monocromática).
 *
 *   - Dropdown plano: borde 1.5px ink, sombra 8 8 0 ink-15 (sin blur).
 *   - Sin border-radius (Bauhaus rechaza esquinas redondas en chrome).
 *   - Items: padding 8 16, hover ink-04, label texto puro ink.
 *   - Labels de sección uppercase tracking 0.08em ink-50 (utility class
 *     `.opm-label-uppercase` del index.html, replicada en estilo).
 *   - Item activo (toggle): pill ink-04 + underline 2px accent cinabrio
 *     interno (sin tinte azul).
 */
const style = {
  menu: {
    position: "absolute",
    top: "46px",
    left: "10px",
    zIndex: 900,
    width: "320px",
    maxHeight: "calc(100vh - 62px)",
    overflowY: "auto",
    padding: "12px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    boxShadow: `8px 8px 0 0 ${tokens.colors.ink15}`,
    display: "grid",
    gap: "12px",
  },
  menuTitle: {
    padding: "2px 10px 0",
    color: tokens.colors.ink,
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.md}px`,
    fontWeight: tokens.typography.weights.bold,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  section: {
    display: "grid",
    gap: "2px",
    paddingTop: "10px",
    borderTop: `1px solid ${tokens.colors.ink15}`,
  },
  sectionTitle: {
    padding: "0 10px 4px",
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  sectionBody: {
    display: "grid",
    gap: "0",
  },
  item: {
    width: "100%",
    minHeight: "32px",
    padding: "8px 16px",
    border: "1px solid transparent",
    background: "transparent",
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    transition: "background 150ms ease-out",
  },
  itemActivo: {
    width: "100%",
    minHeight: "32px",
    padding: "8px 16px",
    border: "1px solid transparent",
    background: tokens.colors.ink04,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.semibold,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    boxShadow: `inset 2px 0 0 0 ${tokens.colors.accent}`,
  },
  itemDisabled: {
    width: "100%",
    minHeight: "32px",
    padding: "8px 16px",
    border: "1px solid transparent",
    background: "transparent",
    color: tokens.colors.ink30,
    cursor: "not-allowed",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.medium,
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
    width: "16px",
    height: "16px",
    flexShrink: 0,
  },
  shortcut: {
    flexShrink: 0,
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.medium,
    letterSpacing: 0,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "4px",
    padding: "10px 12px 5px",
    borderTop: `1px solid ${tokens.colors.ink15}`,
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  submenu: {
    position: "absolute",
    top: 0,
    left: "100%",
    zIndex: 901,
    minWidth: "200px",
    padding: "8px",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    boxShadow: `4px 4px 0 0 ${tokens.colors.ink15}`,
  },
  submenuWrapper: {
    position: "relative",
  },
  submenuItem: {
    display: "block",
    width: "100%",
    padding: "6px 12px",
    border: "none",
    background: "transparent",
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.medium,
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  icon: {
    width: "16px",
    height: "16px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
