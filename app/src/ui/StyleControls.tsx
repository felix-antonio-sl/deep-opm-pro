// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { FAMILIAS_TIPOGRAFICAS, PALETA_ESTILO_COSA } from "../modelo/estilos";
import type { EstiloApariencia } from "../modelo/tipos";
import { inspectorStyles as inspector } from "./inspectorStyles";
import { tokens } from "./tokens";

export const COLORS_UI = [tokens.colors.chromeNeutral, tokens.colors.canvas.objeto, tokens.colors.canvas.proceso, tokens.colors.canvas.texto, tokens.colors.errorBase, tokens.colors.naranja, tokens.colors.violeta, tokens.colors.negro] as const;
// SSOT V-2/V-71: "ambiental" en OPM = afiliacion con contorno DISCONTINUO.
// Aqui "continuo" es solo sentinel UI para `dashArray=""` (linea solida).
// No tiene relacion con afiliacion ambiental del modelo.
export const DASH_PATTERNS_UI = ["continuo", "4 4", "2 4", "6 4 2 4"] as const;

interface Props {
  estilo: EstiloApariencia | undefined;
  onApply: (patch: EstiloApariencia) => void;
  onReset: () => void;
  /** Cuando es true, muestra sección de texto para rotulo */
  showText?: boolean;
  onApplyText?: (patch: EstiloApariencia) => void;
  onResetText?: () => void;
  /**
   * Contexto de enlace: cuando es true, muestra botones copy/paste globales.
   * Estos invocan onCopyStyleEnlace / onPasteStyleEnlace en lugar de onApply.
   */
  enlaceContext?: boolean;
  enlaceEstiloPortapapeles?: { color?: string; strokeWidth?: number; dashArray?: string } | null;
  onCopyStyleEnlace?: () => void;
  onPasteStyleEnlace?: () => void;
  onResetStyleEnlace?: () => void;
  seleccionMultipleCount?: number;
  aplicarASeleccion?: boolean;
  onCambiarAplicarASeleccion?: (activo: boolean) => void;
}

export function StyleControls({ estilo, onApply, onReset, showText, onApplyText, onResetText, enlaceContext, enlaceEstiloPortapapeles, onCopyStyleEnlace, onPasteStyleEnlace, seleccionMultipleCount = 0, aplicarASeleccion = false, onCambiarAplicarASeleccion }: Props) {
  return (
    <section style={styles.section} aria-label="Style">
      <div style={styles.header}>
        <span style={inspector.label}>Style</span>
        <button
          type="button"
          style={styles.reset}
          onClick={onReset}
          title="Reset Style"
        >
          Reset
        </button>
      </div>
      {seleccionMultipleCount >= 2 ? (
        <label style={styles.batchBar}>
          <span>{seleccionMultipleCount} elementos seleccionados</span>
          <input
            type="checkbox"
            checked={aplicarASeleccion}
            onChange={(event) => onCambiarAplicarASeleccion?.(event.currentTarget.checked)}
          />
          <span>Aplicar a selección</span>
        </label>
      ) : null}
      <Swatches
        label="Fill"
        selected={estilo?.fill}
        onSelect={(fill) => onApply({ fill })}
      />
      <Swatches
        label="Borde"
        selected={estilo?.borderColor}
        onSelect={(borderColor) => onApply({ borderColor })}
      />

      {showText ? (
        <div style={textStyles.section}>
          <div style={textStyles.headerRow}>
            <span style={inspector.label}>Texto del rótulo</span>
            {onResetText ? (
              <button type="button" style={styles.reset} onClick={onResetText} title="Reset texto">
                Reset
              </button>
            ) : null}
          </div>
          <div style={textStyles.row}>
            <span style={textStyles.fieldLabel}>Familia</span>
            <select
              aria-label="Familia tipográfica"
              style={inspector.input}
              value={estilo?.fontFamily ?? "Arial"}
              onChange={(e) => onApplyText?.({ fontFamily: e.currentTarget.value })}
            >
              {FAMILIAS_TIPOGRAFICAS.map((fam) => (
                <option key={fam} value={fam}>{fam}</option>
              ))}
            </select>
          </div>
          <div style={textStyles.row}>
            <span style={textStyles.fieldLabel}>Tamaño ({estilo?.fontSize ?? 14}px)</span>
            <input
              aria-label={`Tamaño de fuente: ${estilo?.fontSize ?? 14} píxeles`}
              type="range"
              min={8}
              max={24}
              value={estilo?.fontSize ?? 14}
              style={textStyles.slider}
              onInput={(e) => onApplyText?.({ fontSize: Number(e.currentTarget.value) })}
            />
          </div>
          <div style={textStyles.rowInline}>
            <label style={textStyles.checkLabel}>
              <input type="checkbox" checked={(estilo?.fontWeight === "bold" || estilo?.fontWeight === 700)} onChange={(e) => onApplyText?.({ fontWeight: (e.currentTarget as HTMLInputElement).checked ? 700 : 400 })} />
              Negrita
            </label>
            <label style={textStyles.checkLabel}>
              <input type="checkbox" checked={estilo?.fontStyle === "italic"} onChange={(e) => onApplyText?.({ fontStyle: (e.currentTarget as HTMLInputElement).checked ? "italic" : "normal" })} />
              Cursiva
            </label>
          </div>
          <div style={textStyles.row}>
            <span style={textStyles.fieldLabel}>Color texto</span>
            <SwatchesCompact
              selected={estilo?.textColor}
              onSelect={(textColor) => onApplyText?.({ textColor })}
            />
          </div>
          <div style={textStyles.row}>
            <span style={textStyles.fieldLabel}>Alineación</span>
            <div style={textStyles.segmented}>
              <button type="button" style={estilo?.textAnchor === "start" ? textStyles.segmentActive : textStyles.segment} onClick={() => onApplyText?.({ textAnchor: "start" })}>Izq.</button>
              <button type="button" style={!estilo?.textAnchor || estilo.textAnchor === "middle" ? textStyles.segmentActive : textStyles.segment} onClick={() => onApplyText?.({ textAnchor: "middle" })}>Centro</button>
              <button type="button" style={estilo?.textAnchor === "end" ? textStyles.segmentActive : textStyles.segment} onClick={() => onApplyText?.({ textAnchor: "end" })}>Der.</button>
            </div>
          </div>
        </div>
      ) : null}

      {enlaceContext ? (
        <div style={textStyles.rowInline}>
          <button type="button" style={styles.reset} onClick={onCopyStyleEnlace}>Copiar estilo</button>
          <button type="button" style={styles.reset} disabled={!enlaceEstiloPortapapeles} onClick={onPasteStyleEnlace}>Pegar estilo</button>
        </div>
      ) : null}
    </section>
  );
}

function Swatches(props: {
  label: string;
  selected: string | undefined;
  onSelect: (color: string) => void;
}) {
  return (
    <div style={styles.row}>
      <span style={styles.rowLabel}>{props.label}</span>
      <div style={styles.swatches}>
        {PALETA_ESTILO_COSA.map((color) => {
          const selected = props.selected?.toLowerCase() === color;
          return (
            <button
              key={`${props.label}-${color}`}
              type="button"
              aria-label={`${props.label} ${color}`}
              aria-pressed={selected}
              title={`${props.label} ${color}`}
              style={{
                ...styles.swatch,
                background: color,
                borderColor: selected ? tokens.colors.textoPrimario : tokens.colors.bordeControl,
                boxShadow: selected ? `0 0 0 2px ${tokens.colors.fondoChrome}, 0 0 0 4px ${tokens.colors.chromeNeutral}` : "none",
              }}
              onClick={() => props.onSelect(color)}
            />
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  section: {
    display: "grid",
    gap: "10px",
    marginBottom: "14px",
    padding: "10px",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: "8px",
  },
  reset: {
    height: "28px",
    padding: "0 10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  row: {
    display: "grid",
    gap: "6px",
  },
  rowLabel: {
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 700,
  },
  swatches: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 28px)",
    gap: "8px",
    alignItems: "center",
  },
  swatch: {
    width: "28px",
    height: "28px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    cursor: "pointer",
  },
  batchBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minHeight: "28px",
    padding: "6px 8px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.azulMuySuave,
    color: tokens.colors.textoControl,
    fontSize: "12px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

function SwatchesCompact(props: {
  selected: string | undefined;
  onSelect: (color: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {COLORS_UI.map((color) => {
        const selected = props.selected?.toLowerCase() === color;
        return (
          <button
            key={color}
            type="button"
            aria-label={`Color ${color}`}
            title={color}
            style={{
              width: "22px",
              height: "22px",
              background: color,
              border: selected ? `2px solid ${tokens.colors.textoPrimario}` : `1px solid ${tokens.colors.bordeControl}`,
              borderRadius: tokens.radii.sm,
              cursor: "pointer",
              boxShadow: selected ? `0 0 0 1px ${tokens.colors.fondoChrome}, 0 0 0 3px ${tokens.colors.chromeNeutral}` : "none",
            }}
            onClick={() => props.onSelect(color)}
          />
        );
      })}
    </div>
  );
}

const textStyles = {
  section: {
    display: "grid",
    gap: "8px",
    padding: "8px",
    marginTop: "4px",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoInput,
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
  },
  row: {
    display: "grid",
    gap: "4px",
  },
  rowInline: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  fieldLabel: {
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    fontWeight: 700,
  },
  slider: {
    width: "100%",
    height: "20px",
    accentColor: tokens.colors.chromeNeutral,
  },
  checkLabel: {
    display: "flex",
    gap: "4px",
    alignItems: "center",
    color: tokens.colors.textoSecundario,
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  segmented: {
    display: "flex",
    gap: "0",
    borderRadius: tokens.radii.sm,
    overflow: "hidden",
    border: `1px solid ${tokens.colors.bordeControl}`,
  },
  segment: {
    flex: 1,
    minHeight: "28px",
    border: "none",
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 600,
  },
  segmentActive: {
    flex: 1,
    minHeight: "28px",
    border: "none",
    background: tokens.colors.chromeNeutral,
    color: tokens.colors.fondoChrome,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
