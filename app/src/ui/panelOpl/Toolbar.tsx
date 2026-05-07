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
}

export function ToolbarOpl(props: ToolbarOplProps) {
  const sinOraciones = props.totalOraciones === 0;
  return (
    <div style={style.toolbar} data-testid="panel-opl-toolbar">
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
        data-testid="panel-opl-posicion"
        style={style.iconButton}
        title={props.posicion === "inferior" ? "Mover OPL al lateral derecho" : "Mover OPL abajo"}
        aria-label={props.posicion === "inferior" ? "Mover OPL al lateral derecho" : "Mover OPL abajo"}
        onClick={props.onTogglePosicion}
      >
        {props.posicion === "inferior" ? "↔" : "↧"}
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
    gap: 6,
    marginBottom: 10,
  },
  iconButton: {
    minWidth: 30,
    height: 26,
    border: `1px solid ${tokens.colors.bordeSlate}`,
    borderRadius: 4,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSlate,
    fontSize: "11px",
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
    minWidth: 120,
    maxWidth: 240,
    height: 26,
    padding: "2px 6px",
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: 4,
    fontSize: "12px",
    fontFamily: "inherit",
  },
  toolbarBtn: {
    height: 26,
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: 4,
    background: tokens.colors.fondoTabla,
    color: tokens.colors.textoSlate,
    fontSize: "11px",
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
    fontSize: "11px",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
