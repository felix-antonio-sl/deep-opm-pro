import { useEffect, useState } from "preact/hooks";
import { normalizarGridConfig, type GridConfig } from "../canvas/grid";

interface Props {
  abierto: boolean;
  config: GridConfig;
  onCerrar: () => void;
  onGuardar: (config: Partial<GridConfig>) => void;
}

export function ModalConfiguracionGrid({ abierto, config, onCerrar, onGuardar }: Props) {
  const [local, setLocal] = useState<GridConfig>(() => normalizarGridConfig(config));
  useEffect(() => {
    if (abierto) setLocal(normalizarGridConfig(config));
  }, [abierto, config]);
  if (!abierto) return null;

  const actualizar = (patch: Partial<GridConfig>) => setLocal((actual) => normalizarGridConfig({ ...actual, ...patch }));

  return (
    <div role="dialog" aria-modal="true" aria-label="Configuración de cuadrícula" style={style.backdrop} data-testid="modal-config-grid">
      <div style={style.dialog}>
        <h2 style={style.title}>Cuadrícula</h2>
        <label style={style.field}>
          <span style={style.label}>Paso</span>
          <input style={style.input} type="number" min={4} max={160} value={local.paso} onInput={(event) => actualizar({ paso: Number(event.currentTarget.value) })} />
        </label>
        <label style={style.field}>
          <span style={style.label}>Color</span>
          <input style={style.colorInput} type="color" value={local.color} onInput={(event) => actualizar({ color: event.currentTarget.value })} />
        </label>
        <label style={style.field}>
          <span style={style.label}>Grosor</span>
          <input style={style.input} type="number" min={0.5} max={6} step={0.5} value={local.strokeWidth} onInput={(event) => actualizar({ strokeWidth: Number(event.currentTarget.value) })} />
        </label>
        <label style={style.field}>
          <span style={style.label}>Escala</span>
          <input style={style.input} type="number" min={0.25} max={8} step={0.25} value={local.escala} onInput={(event) => actualizar({ escala: Number(event.currentTarget.value) })} />
        </label>
        <label style={style.checkbox}>
          <input type="checkbox" checked={local.snapActivo} onChange={(event) => actualizar({ snapActivo: event.currentTarget.checked })} />
          <span>Snap</span>
        </label>
        <div style={style.actions}>
          <button type="button" style={style.secondaryButton} onClick={onCerrar}>Cancelar</button>
          <button
            type="button"
            style={style.primaryButton}
            onClick={() => {
              onGuardar(local);
              onCerrar();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    background: "rgb(15 23 42 / 0.28)",
    display: "grid",
    placeItems: "center",
  },
  dialog: {
    width: "min(360px, calc(100vw - 32px))",
    background: "#ffffff",
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    boxShadow: "0 18px 42px rgb(15 23 42 / 0.22)",
    padding: "16px",
    display: "grid",
    gap: "10px",
  },
  title: { margin: 0, fontSize: "16px", color: "#1f2937" },
  field: { display: "grid", gridTemplateColumns: "84px 1fr", alignItems: "center", gap: "8px" },
  label: { fontSize: "13px", color: "#475467", fontWeight: 700 },
  input: { height: "32px", border: "1px solid #c8d2df", borderRadius: "4px", padding: "0 8px", fontSize: "13px" },
  colorInput: { width: "54px", height: "32px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff" },
  checkbox: { display: "inline-flex", alignItems: "center", gap: "8px", color: "#344054", fontSize: "13px", fontWeight: 700 },
  actions: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" },
  primaryButton: { height: "34px", padding: "0 12px", border: "1px solid #586D8C", borderRadius: "4px", background: "#586D8C", color: "#ffffff", cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 12px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
