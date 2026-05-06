import type { Apariencia } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  apariencia: Apariencia;
  onRedimensionar: (width: number, height: number) => void;
  onAjustarTexto: () => void;
  onVolverAuto: () => void;
  onAlternarModo: () => void;
}

export function SeccionTamano({ apariencia, onRedimensionar, onAjustarTexto, onVolverAuto, onAlternarModo }: Props) {
  const modo = apariencia.modoTamano ?? "auto";
  return (
    <section style={local.section} aria-label="Tamaño">
      <div style={local.header}>
        <span style={style.label}>Tamaño</span>
        <button type="button" style={modo === "manual" ? local.activeMiniButton : local.miniButton} onClick={onAlternarModo}>
          {modo === "manual" ? "Manual" : "Auto"}
        </button>
      </div>
      <div style={local.grid}>
        <label style={style.field}>
          <span style={style.label}>Ancho</span>
          <input
            style={style.input}
            type="number"
            min={70}
            value={apariencia.width}
            onInput={(event) => onRedimensionar(Number(event.currentTarget.value), apariencia.height)}
          />
        </label>
        <label style={style.field}>
          <span style={style.label}>Alto</span>
          <input
            style={style.input}
            type="number"
            min={40}
            value={apariencia.height}
            onInput={(event) => onRedimensionar(apariencia.width, Number(event.currentTarget.value))}
          />
        </label>
      </div>
      <div style={local.actions}>
        <button type="button" style={local.secondaryButton} onClick={onAjustarTexto}>Ajustar texto</button>
        <button type="button" style={local.secondaryButton} onClick={onVolverAuto}>Volver auto</button>
      </div>
    </section>
  );
}

const local = {
  section: { display: "grid", gap: "8px", marginBottom: "14px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  miniButton: { height: "28px", padding: "0 8px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  activeMiniButton: { height: "28px", padding: "0 8px", border: "1px solid #586D8C", borderRadius: "4px", background: "#e8eef5", color: "#1f2937", cursor: "pointer", fontSize: "12px", fontWeight: 800 },
  secondaryButton: { height: "30px", padding: "0 10px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
