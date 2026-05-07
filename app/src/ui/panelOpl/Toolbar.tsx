// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { tokens } from "../tokens";
interface ToolbarOplProps {
  totalOraciones: number;
  busquedaOpl: string;
  filtroActivo: boolean;
  numeracionVisible: boolean;
  posicion: "inferior" | "lateral-derecho";
  onMinimizar: () => void;
  onToggleNumeracion: () => void;
  onTogglePosicion: () => void;
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
      <button
        type="button"
        data-testid="panel-opl-posicion"
        style={style.iconButton}
        title={props.posicion === "inferior" ? "Mover OPL al lateral derecho" : "Mover OPL abajo"}
        aria-label={props.posicion === "inferior" ? "Mover OPL al lateral derecho" : "Mover OPL abajo"}
        onClick={props.onTogglePosicion}
      >
        {props.posicion === "inferior" ? (
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3 8 L13 8 M3 8 L5 6 M3 8 L5 10 M13 8 L11 6 M13 8 L11 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M8 3 L8 13 M8 13 L6 11 M8 13 L10 11" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
          </svg>
        )}
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
      <button
        type="button"
        data-testid="panel-opl-ai-text"
        style={style.iconButton}
        title="AI Text"
        aria-label="AI Text"
        onClick={props.onPlaceholderAi}
      >
        AI
      </button>
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
