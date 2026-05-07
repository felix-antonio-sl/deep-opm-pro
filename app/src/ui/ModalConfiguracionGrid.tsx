// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { normalizarGridConfig, type GridConfig } from "../canvas/grid";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

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

  const actualizar = (patch: Partial<GridConfig>) => setLocal((actual) => normalizarGridConfig({ ...actual, ...patch }));

  return (
    <Dialogo
      open={abierto}
      title="Cuadrícula"
      onCancel={onCerrar}
      size="sm"
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={onCerrar}>Cancelar</button>
          <button type="button" style={style.primaryButton} onClick={() => { onGuardar(local); onCerrar(); }}>Guardar</button>
        </>
      )}
    >
      <div data-testid="modal-config-grid" style={style.body}>
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
      </div>
    </Dialogo>
  );
}

const style = {
  body: { display: "grid", gap: "10px" },
  field: { display: "grid", gridTemplateColumns: "84px 1fr", alignItems: "center", gap: "8px" },
  label: { fontSize: "13px", color: tokens.colors.textoSecundario, fontWeight: 700 },
  input: { height: "32px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, padding: "0 8px", fontSize: "13px" },
  colorInput: { width: "54px", height: "32px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome },
  checkbox: { display: "inline-flex", alignItems: "center", gap: "8px", color: tokens.colors.textoControl, fontSize: "13px", fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
