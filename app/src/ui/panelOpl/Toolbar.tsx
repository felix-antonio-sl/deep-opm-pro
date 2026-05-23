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
        style={style.iconButton}
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
        Nº
      </button>
      {/* Ronda23 L1 #5: vaporware AI Text apagado hasta que la feature exista.
          Cuando se implemente la feature, basta con poner
          `AI_TEXT_HABILITADO = true` y los smokes (03-opl-panel:297) vuelven
          a tener objetivo. */}
      {AI_TEXT_HABILITADO ? (
        <button
          type="button"
          data-testid="panel-opl-ai-text"
          style={{ ...style.iconButton, ...style.iconButtonBeta }}
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
        Editar
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
        Copiar
      </button>
      <button
        type="button"
        data-testid="panel-opl-exportar-html"
        style={botonToolbar(sinOraciones)}
        disabled={sinOraciones}
        title="Exportar OPL como archivo HTML"
        onClick={props.onExportarHtml}
      >
        HTML
      </button>
      <span style={style.divider} aria-hidden="true" />

      {/* Toggle independiente al extremo derecho */}
      <label style={style.toggle}>
        <input
          type="checkbox"
          checked={props.filtroActivo}
          onInput={(event) => props.onFiltroSeleccion((event.currentTarget as HTMLInputElement).checked)}
        />
        Filtrar por selección
      </label>
    </div>
  );
}

function botonToolbar(disabled: boolean): preact.JSX.CSSProperties {
  return { ...style.toolbarBtn, ...(disabled ? style.btnDisabled : {}) };
}

function botonActivo(activo: boolean): preact.JSX.CSSProperties {
  return { ...style.iconButton, ...(activo ? style.iconButtonActivo : {}) };
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
  iconButton: {
    minWidth: 30,
    height: 28,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.medium,
    padding: "4px 10px",
    cursor: "pointer",
    letterSpacing: 0,
    transition: tokens.transitions.fast,
  },
  iconButtonActivo: {
    borderColor: tokens.colors.ink,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
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
    height: 28,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.medium,
    padding: "4px 10px",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: tokens.transitions.fast,
  },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" as const },
  toggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: tokens.colors.ink70,
    fontSize: tokens.typography.sizes.sm,
    userSelect: "none" as const,
    whiteSpace: "nowrap" as const,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
