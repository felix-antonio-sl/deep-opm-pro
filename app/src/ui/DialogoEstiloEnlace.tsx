import type { Enlace, EnlaceEstilo, Id } from "../modelo/tipos";

interface Props {
  abierto: boolean;
  enlace: Enlace;
  onCerrar: () => void;
  onAplicar: (enlaceId: Id, estilo: Partial<EnlaceEstilo>) => void;
}

const COLORES = ["#475467", "#d92d20", "#0e7c66", "#1d4ed8", "#ca8a04", "#9333ea"] as const;
const GROSORES = [1, 1.5, 2, 3] as const;
const TRAZOS: Array<{ label: string; value: string }> = [
  { label: "Continua", value: "" },
  { label: "Discontinua", value: "4 4" },
  { label: "Punteada", value: "2 4" },
];

export function DialogoEstiloEnlace({ abierto, enlace, onCerrar, onAplicar }: Props) {
  if (!abierto) return null;
  const estilo = enlace.estilo ?? {};
  return (
    <div style={style.backdrop} role="dialog" aria-modal="true" aria-label="Propiedades visuales del enlace" data-testid="dialogo-estilo-enlace">
      <div style={style.modal}>
        <div style={style.header}>
          <h2 style={style.title}>Estilo de enlace</h2>
          <button type="button" style={style.iconButton} onClick={onCerrar} aria-label="Cerrar">x</button>
        </div>
        <section style={style.section}>
          <span style={style.label}>Color</span>
          <div style={style.swatches}>
            {COLORES.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Color ${color}`}
                data-testid={`estilo-enlace-color-${color}`}
                style={{
                  ...style.swatch,
                  background: color,
                  borderColor: estilo.color?.toLowerCase() === color ? "#111827" : "#c8d2df",
                  boxShadow: estilo.color?.toLowerCase() === color ? "0 0 0 2px #ffffff, 0 0 0 4px #586d8c" : "none",
                }}
                onClick={() => onAplicar(enlace.id, { color })}
              />
            ))}
          </div>
        </section>
        <section style={style.section}>
          <span style={style.label}>Grosor</span>
          <div style={style.row}>
            {GROSORES.map((strokeWidth) => (
              <button
                key={strokeWidth}
                type="button"
                style={estilo.strokeWidth === strokeWidth ? style.choiceActive : style.choice}
                onClick={() => onAplicar(enlace.id, { strokeWidth })}
              >
                {strokeWidth}px
              </button>
            ))}
          </div>
        </section>
        <section style={style.section}>
          <span style={style.label}>Tipo de línea</span>
          <div style={style.row}>
            {TRAZOS.map((trazo) => (
              <button
                key={trazo.label}
                type="button"
                style={(estilo.dashArray ?? "") === trazo.value ? style.choiceActive : style.choice}
                onClick={() => onAplicar(enlace.id, { dashArray: trazo.value })}
              >
                {trazo.label}
              </button>
            ))}
          </div>
        </section>
        <div style={style.footer}>
          <button type="button" style={style.primary} onClick={onCerrar}>Listo</button>
        </div>
      </div>
    </div>
  );
}

const style = {
  backdrop: { position: "fixed", inset: 0, zIndex: 40, display: "grid", placeItems: "center", background: "rgba(15, 23, 42, 0.28)" },
  modal: { width: "360px", display: "grid", gap: "14px", padding: "16px", background: "#ffffff", border: "1px solid #c8d2df", borderRadius: "6px", boxShadow: "0 18px 44px rgba(15, 23, 42, 0.22)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { margin: 0, color: "#1f2937", fontSize: "16px", fontWeight: 800 },
  iconButton: { width: "28px", height: "28px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#f9fbfd", cursor: "pointer" },
  section: { display: "grid", gap: "8px" },
  label: { color: "#475467", fontSize: "12px", fontWeight: 800 },
  swatches: { display: "flex", gap: "8px", flexWrap: "wrap" },
  swatch: { width: "30px", height: "30px", border: "1px solid #c8d2df", borderRadius: "4px", cursor: "pointer" },
  row: { display: "flex", gap: "8px", flexWrap: "wrap" },
  choice: { height: "30px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#344054", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  choiceActive: { height: "30px", border: "1px solid #1d4ed8", borderRadius: "4px", background: "#eaf8ff", color: "#1d4ed8", cursor: "pointer", fontSize: "12px", fontWeight: 800 },
  footer: { display: "flex", justifyContent: "flex-end" },
  primary: { height: "34px", border: "1px solid #586d8c", borderRadius: "4px", background: "#586d8c", color: "#ffffff", cursor: "pointer", fontSize: "13px", fontWeight: 800 },
} satisfies Record<string, preact.JSX.CSSProperties>;
