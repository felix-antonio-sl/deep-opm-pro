import { PALETA_ESTILO_COSA } from "../modelo/estilos";
import type { EstiloApariencia } from "../modelo/tipos";
import { inspectorStyles as inspector } from "./inspectorStyles";

interface Props {
  estilo: EstiloApariencia | undefined;
  onApply: (patch: EstiloApariencia) => void;
  onReset: () => void;
}

export function StyleControls({ estilo, onApply, onReset }: Props) {
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
                borderColor: selected ? "#1f2937" : "#c8d2df",
                boxShadow: selected ? "0 0 0 2px #ffffff, 0 0 0 4px #586D8C" : "none",
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
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#ffffff",
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
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
  row: {
    display: "grid",
    gap: "6px",
  },
  rowLabel: {
    color: "#667085",
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
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    cursor: "pointer",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
