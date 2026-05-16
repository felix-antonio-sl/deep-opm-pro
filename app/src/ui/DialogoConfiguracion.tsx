// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { normalizarGridConfig, type GridConfig } from "../canvas/grid";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

/**
 * DialogoConfiguracion «Modal».
 * Consolida preferencias de workbench que antes vivian en superficies separadas:
 * renombrado de modelo + cuadrícula del canvas. No toca `app/src/modelo/`.
 */
export function DialogoConfiguracion() {
  const abierto = useOpmStore((s) => s.dialogoConfiguracionAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoConfiguracion);
  const modelo = useOpmStore((s) => s.modelo);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const renombrarModeloActual = useOpmStore((s) => s.renombrarModeloActual);
  const gridConfig = useOpmStore((s) => normalizarGridConfig(s.gridConfig ?? s.indice.preferenciasUi?.gridConfig));
  const fijarGridConfig = useOpmStore((s) => s.fijarGridConfig);
  const [nombre, setNombre] = useState(modelo.nombre);
  const [gridLocal, setGridLocal] = useState<GridConfig>(() => normalizarGridConfig(gridConfig));

  useEffect(() => {
    if (!abierto) return;
    setNombre(modelo.nombre);
    setGridLocal(normalizarGridConfig(gridConfig));
  }, [abierto, gridConfig, modelo.nombre]);

  const actualizarGrid = (patch: Partial<GridConfig>) => {
    setGridLocal((actual) => normalizarGridConfig({ ...actual, ...patch }));
  };
  const guardar = () => {
    fijarGridConfig(gridLocal);
    const nombreLimpio = nombre.trim();
    if (nombreLimpio && nombreLimpio !== modelo.nombre) {
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

const style = {
  body: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: "16px", width: "100%" },
  section: { display: "grid", alignContent: "start", gap: "10px", padding: "2px" },
  sectionTitle: { margin: 0, color: tokens.colors.textoPrimario, fontSize: "14px", fontWeight: 800 },
  field: { display: "grid", gridTemplateColumns: "84px minmax(0, 1fr)", alignItems: "center", gap: "8px" },
  label: { fontSize: "13px", color: tokens.colors.textoSecundario, fontWeight: 700 },
  input: { height: "32px", minWidth: 0, border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, padding: "0 8px", fontSize: "13px" },
  colorInput: { width: "54px", height: "32px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome },
  checkbox: { display: "inline-flex", alignItems: "center", gap: "8px", color: tokens.colors.textoControl, fontSize: "13px", fontWeight: 700 },
  hint: { margin: 0, color: tokens.colors.textoTerciario, fontSize: "12px", fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontWeight: 700 },
  disabledButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoDeshabilitado, color: tokens.colors.textoDeshabilitado, fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
