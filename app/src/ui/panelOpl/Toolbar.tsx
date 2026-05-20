// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
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
        title={props.numeracionVisible ? "Ocultar numeración" : "Mostrar numeración"}
        aria-pressed={props.numeracionVisible}
        onClick={props.onToggleNumeracion}
      >
        123
      </button>
      {/* Ronda23 L1 #5: vaporware AI Text apagado hasta que la feature exista.
          Antes (informe UI/UX 2026-05-07) el botón quedaba visible marcado como
          beta y al click disparaba un toast "Próximamente"; el render confundía
          a los usuarios prometiendo algo no disponible. Cuando se implemente la
          feature, basta con poner `AI_TEXT_HABILITADO = true` y los smokes
          (03-opl-panel:297) vuelven a tener objetivo. */}
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

const style = {
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: tokens.spacing.sm,
    marginBottom: 10,
  },
  divider: {
    width: 1,
    height: 18,
    flex: "0 0 auto",
    margin: `0 ${tokens.spacing.xs}px`,
    background: tokens.colors.bordeChrome,
  },
  iconButton: {
    minWidth: 30,
    height: 28,
    border: `1px solid ${tokens.colors.bordeSlate}`,
    borderRadius: 4,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSlate,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: 700,
    padding: "2px 6px",
    cursor: "pointer",
  },
  iconButtonActivo: {
    borderColor: tokens.colors.chromeNeutral,
    background: tokens.colors.fondoLineaTiempo,
    color: tokens.colors.textoPrimario,
  },
  iconButtonBeta: {
    // P0-3: marca visual de "no disponible aun". El handler sigue activo
    // (muestra toast "Proximamente"), pero el chrome aclara el estado.
    opacity: 0.55,
    background: tokens.colors.fondoNeutral,
    color: tokens.colors.textoTerciario,
    cursor: "help",
    minWidth: 56,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },
  betaTag: {
    fontSize: tokens.typography.sizes.xs,
    fontWeight: tokens.typography.weights.semibold,
    padding: "0 4px",
    borderRadius: 999,
    background: tokens.colors.chromeNeutralSuave,
    color: tokens.colors.chromeNeutral,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    lineHeight: 1.5,
  },
  searchInput: {
    flex: "1",
    minWidth: 180,
    maxWidth: 280,
    height: 28,
    padding: "2px 6px",
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: 4,
    fontSize: tokens.typography.sizes.sm,
    fontFamily: "inherit",
  },
  toolbarBtn: {
    height: 28,
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: 4,
    background: tokens.colors.fondoTabla,
    color: tokens.colors.textoSlate,
    fontSize: tokens.typography.sizes.sm,
    padding: "2px 8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  toggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: tokens.colors.textoSecundario,
    fontSize: tokens.typography.sizes.sm,
    userSelect: "none",
    whiteSpace: "nowrap",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
