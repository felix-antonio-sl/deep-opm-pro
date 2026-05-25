// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
// Ronda 28 L3: paleta Bauhaus aplicada — toolbar borde inferior 1px ink-15,
// botones outline ink-15, activo fondo ink + paper, sin glow.
import { tokens } from "../tokens";

/**
 * Ronda23 L1 #5: el botón "AI Text" del panel OPL está apagado en producción
 * hasta que la feature exista de verdad. El JSX se conserva tras un guard
 * para que el día que se implemente baste con bajar `AI_TEXT_HABILITADO` a
 * `true`. El handler `panel-opl-ai-text` (toast "Próximamente") sigue en el
 * código pero no se renderiza. NOTA: con el botón oculto, los smokes que
 * consultaban `panel-opl-ai-text` quedan sin objetivo — actualizarlos al
 * mismo tiempo que se baje este flag.
 */
const AI_TEXT_HABILITADO = false;

interface ToolbarOplProps {
  totalOraciones: number;
  busquedaOpl: string;
  filtroActivo: boolean;
  /**
   * Codex L6 (G7): cuando el filtro por selección está activo, el chip muestra
   * `filtrado · <código> · N/M ✕`. `filtroCodigo` es el identificador canónico
   * del elemento seleccionado (`o.06`, `p.02`…) o `null` si no aplica (enlace).
   * `filtroVisibles` = oraciones que pasan el filtro (N); `totalOraciones` = M.
   */
  filtroCodigo: string | null;
  filtroVisibles: number;
  numeracionVisible: boolean;
  onMinimizar: () => void;
  onToggleNumeracion: () => void;
  onPlaceholderAi: () => void;
  onBuscar: (texto: string) => void;
  onCopiar: () => void;
  onExportarHtml: () => void;
  onFiltroSeleccion: (activo: boolean) => void;
  editorActivo: boolean;
  onEditarLibre: () => void;
}

export function ToolbarOpl(props: ToolbarOplProps) {
  const sinOraciones = props.totalOraciones === 0;
  return (
    <div style={style.toolbar} data-testid="panel-opl-toolbar">
      {/* Cluster 1: chrome del contenedor */}
      <button
        type="button"
        data-testid="panel-opl-minimizar"
        style={style.iconWord}
        title="Minimizar panel OPL"
        aria-label="Minimizar panel OPL"
        onClick={props.onMinimizar}
      >
        ▾
      </button>
      <span style={style.divider} aria-hidden="true" />

      {/* Cluster 2: display y modos */}
      <button
        type="button"
        data-testid="panel-opl-toggle-numeracion"
        style={botonActivo(props.numeracionVisible)}
        title={
          props.numeracionVisible
            ? "Ocultar numeración de oraciones OPL"
            : "Mostrar numeración de oraciones OPL"
        }
        aria-label={
          props.numeracionVisible
            ? "Ocultar numeración de oraciones OPL"
            : "Mostrar numeración de oraciones OPL"
        }
        aria-pressed={props.numeracionVisible}
        onClick={props.onToggleNumeracion}
      >
        nº
      </button>
      {/* Ronda23 L1 #5: vaporware AI Text apagado hasta que la feature exista.
          Cuando se implemente la feature, basta con poner
          `AI_TEXT_HABILITADO = true` y los smokes (03-opl-panel:297) vuelven
          a tener objetivo. */}
      {AI_TEXT_HABILITADO ? (
        <button
          type="button"
          data-testid="panel-opl-ai-text"
          style={{ ...style.iconWord, ...style.iconButtonBeta }}
          title="AI Text · próximamente (beta)"
          aria-label="AI Text"
          data-beta="true"
          onClick={props.onPlaceholderAi}
        >
          AI<span style={style.betaTag}>beta</span>
        </button>
      ) : null}
      <button
        type="button"
        data-testid="panel-opl-editar-libre"
        style={botonActivo(props.editorActivo)}
        title={props.editorActivo ? "Cerrar edición OPL" : "Editar OPL libre"}
        aria-pressed={props.editorActivo}
        onClick={props.onEditarLibre}
      >
        editar
      </button>
      <span style={style.divider} aria-hidden="true" />

      {/* Cluster 3: consulta y exportación */}
      <input
        data-testid="panel-opl-buscar"
        type="text"
        placeholder="Buscar en OPL..."
        value={props.busquedaOpl}
        aria-label="Buscar texto en OPL"
        style={style.searchInput}
        onInput={(event) => props.onBuscar((event.currentTarget as HTMLInputElement).value)}
      />
      <button
        type="button"
        data-testid="panel-opl-copiar"
        style={botonToolbar(sinOraciones)}
        disabled={sinOraciones}
        title="Copiar todo el OPL al portapapeles"
        onClick={props.onCopiar}
      >
        copiar
      </button>
      <button
        type="button"
        data-testid="panel-opl-exportar-html"
        style={botonToolbar(sinOraciones)}
        disabled={sinOraciones}
        title="Exportar OPL como archivo HTML"
        onClick={props.onExportarHtml}
      >
        html
      </button>
      <button
        type="button"
        data-testid="panel-opl-exportar"
        style={botonToolbar(sinOraciones)}
        disabled={sinOraciones}
        title="Exportar OPL como archivo HTML"
        onClick={props.onExportarHtml}
      >
        exportar
      </button>
      <span style={style.divider} aria-hidden="true" />

      {/* Toggle independiente al extremo derecho */}
      {props.filtroActivo ? (
        // Codex L6 (G7): chip de filtro activo — crimson italic. Reemplaza al
        // checkbox mientras hay filtro; la ✕ lo desactiva. Forma editorial:
        // `filtrado · o.06 · 4/24 ✕`.
        <span style={style.chipFiltro} data-testid="panel-opl-filtro-chip">
          <span style={style.chipKicker}>filtrado</span>
          {props.filtroCodigo ? (
            <>
              <span style={style.chipSep} aria-hidden="true">·</span>
              <span style={style.chipCodigo}>{props.filtroCodigo}</span>
            </>
          ) : null}
          <span style={style.chipSep} aria-hidden="true">·</span>
          <span style={style.chipConteo}>
            {props.filtroVisibles}/{props.totalOraciones}
          </span>
          <button
            type="button"
            data-testid="panel-opl-filtro-chip-quitar"
            style={style.chipCerrar}
            title="Quitar filtro por selección"
            aria-label="Quitar filtro por selección"
            onClick={() => props.onFiltroSeleccion(false)}
          >
            ✕
          </button>
        </span>
      ) : (
        <button
          type="button"
          role="button"
          aria-label="Filtrar por selección"
          aria-pressed={props.filtroActivo}
          data-testid="panel-opl-filtro-toggle"
          style={style.filterWord}
          onClick={() => props.onFiltroSeleccion(true)}
        >
          filtrar por selección
        </button>
      )}
    </div>
  );
}

function botonToolbar(disabled: boolean): preact.JSX.CSSProperties {
  return { ...style.toolbarBtn, ...(disabled ? style.btnDisabled : {}) };
}

function botonActivo(activo: boolean): preact.JSX.CSSProperties {
  return { ...style.wordButton, ...(activo ? style.wordButtonActivo : {}) };
}

// Ronda 28 L3: toolbar OPL Bauhaus.
//   - toolbar: borde inferior 1px ink-15.
//   - iconButton: border 1px ink-15, padding 4 10, font 11/500 ink.
//   - activo: fondo ink + paper, sin glow.
//   - search input: outline focus, caret accent.
const style = {
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
  },
  divider: {
    width: 1,
    height: 18,
    flex: "0 0 auto",
    margin: `0 ${tokens.spacing.xs}px`,
    background: tokens.colors.ink15,
  },
  iconWord: {
    minWidth: 24,
    height: 24,
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.medium,
    padding: "0 2px",
    cursor: "pointer",
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  wordButton: {
    minWidth: 24,
    height: 24,
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: tokens.typography.sizes.sm,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
    padding: "0 2px",
    cursor: "pointer",
    letterSpacing: 0,
    textDecoration: "none",
    textUnderlineOffset: "3px",
    transition: tokens.transitions.fast,
  },
  wordButtonActivo: {
    color: tokens.colors.ink,
    textDecoration: "underline",
  },
  iconButtonBeta: {
    opacity: 0.55,
    background: tokens.colors.ink04,
    color: tokens.colors.ink50,
    cursor: "help",
    minWidth: 56,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  betaTag: {
    fontSize: tokens.typography.sizes.xxs,
    fontWeight: tokens.typography.weights.semibold,
    padding: "0 4px",
    borderRadius: tokens.radii.pill,
    background: tokens.colors.ink04,
    color: tokens.colors.ink50,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    lineHeight: 1.5,
  },
  searchInput: {
    flex: "1",
    minWidth: 180,
    maxWidth: 280,
    height: 28,
    padding: "4px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    fontSize: tokens.typography.sizes.sm,
    fontFamily: "inherit",
  },
  toolbarBtn: {
    height: 24,
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: tokens.typography.sizes.sm,
    fontStyle: "italic",
    fontWeight: tokens.typography.weights.regular,
    padding: "0 2px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    transition: tokens.transitions.fast,
  },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" as const },
  // Codex L6 (G7): chip de filtro activo — crimson italic, sin caja ni sombra.
  chipFiltro: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: 4,
    color: tokens.colors.crimson,
    fontStyle: "italic" as const,
    fontSize: tokens.typography.sizes.sm,
    whiteSpace: "nowrap" as const,
    userSelect: "none" as const,
  },
  chipKicker: {
    fontFamily: tokens.typography.serif,
    fontStyle: "italic" as const,
  },
  chipSep: {
    color: tokens.colors.crimson,
    fontStyle: "normal" as const,
    opacity: 0.6,
  },
  chipCodigo: {
    fontFamily: tokens.typography.fontFamilyMono,
    fontStyle: "normal" as const,
    fontSize: tokens.typography.sizes.xs,
    letterSpacing: tokens.typography.ls.meta,
  },
  chipConteo: {
    fontFamily: tokens.typography.fontFamilyMono,
    fontStyle: "normal" as const,
    fontSize: tokens.typography.sizes.xs,
    fontVariantNumeric: "tabular-nums" as const,
  },
  chipCerrar: {
    border: "none",
    background: "transparent",
    color: tokens.colors.crimson,
    cursor: "pointer",
    padding: "0 2px",
    marginLeft: 2,
    fontStyle: "normal" as const,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: 1,
  },
  filterWord: {
    height: 24,
    border: "none",
    background: "transparent",
    padding: "0 2px",
    display: "inline-flex",
    alignItems: "center",
    color: tokens.colors.inkSoft,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: tokens.typography.sizes.sm,
    fontStyle: "italic",
    textDecoration: "none",
    textUnderlineOffset: "3px",
    userSelect: "none" as const,
    whiteSpace: "nowrap" as const,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
