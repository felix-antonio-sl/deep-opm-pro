// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Enlace, EnlaceEstilo, Id } from "../modelo/tipos";
import { tokens } from "./tokens";

interface Props {
  abierto: boolean;
  enlace: Enlace;
  onCerrar: () => void;
  onAplicar: (enlaceId: Id, estilo: Partial<EnlaceEstilo>) => void;
}

const COLORES = [tokens.colors.textoSecundario, tokens.colors.errorBase, tokens.colors.verdeObjetoOscuro, tokens.colors.azulAccion, tokens.colors.ambarOscuro, tokens.colors.violetaFuerte] as const;
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
                  borderColor: estilo.color?.toLowerCase() === color ? tokens.colors.textoCasiNegro : tokens.colors.bordeControl,
                  boxShadow: estilo.color?.toLowerCase() === color ? `0 0 0 2px ${tokens.colors.fondoChrome}, 0 0 0 4px ${tokens.colors.chromeNeutral}` : "none",
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
  modal: { width: "360px", display: "grid", gap: "14px", padding: "16px", background: tokens.colors.fondoChrome, border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.md, boxShadow: tokens.shadows.modal },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  title: { margin: 0, color: tokens.colors.textoPrimario, fontSize: "16px", fontWeight: 800 },
  iconButton: { width: "28px", height: "28px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoCard, cursor: "pointer" },
  section: { display: "grid", gap: "8px" },
  label: { color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 800 },
  swatches: { display: "flex", gap: "8px", flexWrap: "wrap" },
  swatch: { width: "30px", height: "30px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, cursor: "pointer" },
  row: { display: "flex", gap: "8px", flexWrap: "wrap" },
  choice: { height: "30px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoControl, cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  choiceActive: { height: "30px", border: `1px solid ${tokens.colors.azulAccion}`, borderRadius: tokens.radii.sm, background: tokens.colors.acentoUiSuave, color: tokens.colors.azulAccion, cursor: "pointer", fontSize: "12px", fontWeight: 800 },
  footer: { display: "flex", justifyContent: "flex-end" },
  primary: { height: "34px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontSize: "13px", fontWeight: 800 },
} satisfies Record<string, preact.JSX.CSSProperties>;
