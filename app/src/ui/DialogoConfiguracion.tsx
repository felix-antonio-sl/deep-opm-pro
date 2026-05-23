// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { useDialogoConfiguracionViewModel } from "../app/viewmodels/dialogoConfiguracionViewModel";
import { normalizarGridConfig, type GridConfig } from "../canvas/grid";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

/**
 * DialogoConfiguracion «Modal».
 * Consolida preferencias de workbench que antes vivian en superficies separadas:
 * renombrado de modelo + cuadrícula del canvas. No toca `app/src/modelo/`.
 */
export function DialogoConfiguracion() {
  const { abierto, cerrar, modeloNombre, modeloPersistidoId, renombrarModeloActual, gridConfig, fijarGridConfig } = useDialogoConfiguracionViewModel();
  const [nombre, setNombre] = useState(modeloNombre);
  const [gridLocal, setGridLocal] = useState<GridConfig>(() => normalizarGridConfig(gridConfig));

  useEffect(() => {
    if (!abierto) return;
    setNombre(modeloNombre);
    setGridLocal(normalizarGridConfig(gridConfig));
  }, [abierto, gridConfig, modeloNombre]);

  const actualizarGrid = (patch: Partial<GridConfig>) => {
    setGridLocal((actual) => normalizarGridConfig({ ...actual, ...patch }));
  };
  const guardar = () => {
    fijarGridConfig(gridLocal);
    const nombreLimpio = nombre.trim();
    if (nombreLimpio && nombreLimpio !== modeloNombre) {
      renombrarModeloActual(nombreLimpio);
      return;
    }
    cerrar();
  };

  return (
    <Dialogo
      open={abierto}
      title="Configuración"
      onCancel={cerrar}
      size="lg"
      testId="modal-config-grid"
      actions={(
        <>
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
          <button type="button" style={nombre.trim() ? style.primaryButton : style.disabledButton} disabled={!nombre.trim()} onClick={guardar}>Guardar</button>
        </>
      )}
    >
      <div style={style.body}>
        <section style={style.section} aria-labelledby="config-modelo-title">
          <h3 id="config-modelo-title" style={style.sectionTitle}>Modelo</h3>
          <label style={style.field}>
            <span style={style.label}>Nombre</span>
            <input
              aria-label="Nombre del modelo"
              style={style.input}
              value={nombre}
              onInput={(event) => setNombre(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && nombre.trim()) guardar();
              }}
            />
          </label>
          {!modeloPersistidoId ? <p style={style.hint}>Guarda el modelo antes de cambiar su nombre persistido.</p> : null}
        </section>
        <section style={style.section} aria-labelledby="config-grid-title">
          <h3 id="config-grid-title" style={style.sectionTitle}>Cuadrícula</h3>
          <label style={style.checkbox}>
            <input type="checkbox" checked={gridLocal.activa} onChange={(event) => actualizarGrid({ activa: event.currentTarget.checked })} />
            <span>Mostrar cuadrícula</span>
          </label>
          <label style={style.field}>
            <span style={style.label}>Paso</span>
            <input style={style.input} type="number" min={4} max={160} value={gridLocal.paso} onInput={(event) => actualizarGrid({ paso: Number(event.currentTarget.value) })} />
          </label>
          <label style={style.field}>
            <span style={style.label}>Color</span>
            <input style={style.colorInput} type="color" value={gridLocal.color} onInput={(event) => actualizarGrid({ color: event.currentTarget.value })} />
          </label>
          <label style={style.field}>
            <span style={style.label}>Grosor</span>
            <input style={style.input} type="number" min={0.5} max={6} step={0.5} value={gridLocal.strokeWidth} onInput={(event) => actualizarGrid({ strokeWidth: Number(event.currentTarget.value) })} />
          </label>
          <label style={style.field}>
            <span style={style.label}>Escala</span>
            <input style={style.input} type="number" min={0.25} max={8} step={0.25} value={gridLocal.escala} onInput={(event) => actualizarGrid({ escala: Number(event.currentTarget.value) })} />
          </label>
          <label style={style.checkbox}>
            <input type="checkbox" checked={gridLocal.snapActivo} onChange={(event) => actualizarGrid({ snapActivo: event.currentTarget.checked })} />
            <span>Snap</span>
          </label>
        </section>
      </div>
    </Dialogo>
  );
}

// Ronda 28 L5: Bauhaus monocromático.
const style = {
  body: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "20px", width: "100%" },
  section: { display: "grid", alignContent: "start", gap: "10px", padding: "2px" },
  sectionTitle: { margin: 0, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  field: { display: "grid", gridTemplateColumns: "84px minmax(0, 1fr)", alignItems: "center", gap: "8px" },
  label: { fontFamily: tokens.typography.familyChrome, fontSize: "13px", color: tokens.colors.ink70, fontWeight: 400 },
  input: { height: "32px", minWidth: 0, border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.accent },
  colorInput: { width: "54px", height: "32px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, padding: 0, cursor: "pointer" },
  checkbox: { display: "inline-flex", alignItems: "center", gap: "8px", color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  hint: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400 },
  primaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink, color: tokens.colors.paper, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  secondaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  disabledButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.ink04, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500, cursor: "not-allowed" },
} satisfies Record<string, preact.JSX.CSSProperties>;
