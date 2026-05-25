// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Ronda 28 L5 (autoría steipete, swatches semánticos): paleta semántica
// Bauhaus para el estilo de enlace. 6 swatches canónicos (ink, ink-50,
// ink-30, accent cinabrio, focus ultramar, warning terracota) en lugar de
// la antigua paleta colorida (rojo/verde/azul/ámbar/violeta). El swatch
// seleccionado se marca con borde 2px cinabrio, preservando la afordancia
// visual histórica.
//
// Contrato preservado: el smoke `07-enlaces-avanzados.spec.ts:537` busca
// `getByRole("button", { name: "Color #C8392F" })`. `accent` coincide con
// el valor histórico de `errorBase` (#C8392F = cinabrio Bauhaus).
import type { Enlace, EnlaceEstilo, Id } from "../modelo/tipos";
import { DialogoAccion } from "./Dialogo";
import { GLIFO_CERRAR } from "./codex/glifos";
import { tokens } from "./tokens";

interface Props {
  abierto: boolean;
  enlace: Enlace;
  onCerrar: () => void;
  onAplicar: (enlaceId: Id, estilo: Partial<EnlaceEstilo>) => void;
}

// Paleta semántica L5: 6 swatches Bauhaus.
//   ink     — trazo principal (default histórico).
//   ink-50  — trazo secundario gris medio.
//   ink-30  — trazo tenue / referencia.
//   accent  — cinabrio (#C8392F) — alerta / error / atención.
//   focus   — ultramar (#1F3FA6) — selección / enlace activo / azul único.
//   warning — terracota apagada — advertencia / pendiente.
//
// Compat: `accent` coincide con el valor histórico de `errorBase` (#C8392F),
// preservando el contrato del smoke `07-enlaces-avanzados.spec.ts:537` que
// busca `getByRole("button", { name: "Color #C8392F" })`.
const COLORES = [
  tokens.colors.ink,
  tokens.colors.ink50,
  tokens.colors.ink30,
  tokens.colors.accent,
  tokens.colors.focus,
  tokens.colors.warning,
] as const;
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
    <div
      style={style.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="Propiedades visuales del enlace"
      data-testid="dialogo-estilo-enlace"
      data-ifml-stereotype="Modal"
      data-ifml-modal="true"
    >
      <div style={style.modal}>
        <div style={style.header}>
          <h2 style={style.title}>Estilo de enlace</h2>
          <button type="button" style={style.iconButton} onClick={onCerrar} aria-label="Cerrar">{GLIFO_CERRAR}</button>
        </div>
        <section style={style.section}>
          <span style={style.label}>Color</span>
          <div style={style.swatches}>
            {COLORES.map((color) => {
              const seleccionado = estilo.color?.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Color ${color}`}
                  data-testid={`estilo-enlace-color-${color}`}
                  style={{
                    ...style.swatch,
                    background: color,
                    borderWidth: seleccionado ? `${tokens.stroke.bold}px` : "1.5px",
                    borderColor: seleccionado ? tokens.colors.accent : tokens.colors.ink15,
                  }}
                  onClick={() => onAplicar(enlace.id, { color })}
                />
              );
            })}
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
          <DialogoAccion tono="primaria" onClick={onCerrar}>Listo</DialogoAccion>
        </div>
      </div>
    </div>
  );
}

const style = {
  // Ronda Codex v1 · L3: este diálogo no usa el componente Dialogo base
  // (overlay propio sin portal), por lo que re-pielamos su chrome a mano al
  // mismo lenguaje: backdrop papel translúcido + blur, hairline ruleStrong,
  // sin sombra, título Inria Serif, cierre como glifo `✕`, "Listo" como palabra.
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 40,
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "rgba(250, 250, 248, 0.78)",
    backdropFilter: "blur(2px)",
  },
  modal: {
    width: "360px",
    display: "grid",
    gap: "16px",
    padding: "20px 24px",
    background: tokens.colors.paper,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    boxShadow: tokens.shadows.none,
    fontFamily: tokens.typography.serif,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "12px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
  },
  title: {
    margin: 0,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs20}px`,
    fontWeight: tokens.typography.weights.bold,
    letterSpacing: tokens.typography.ls.tight,
  },
  iconButton: {
    width: "24px",
    height: "24px",
    border: "none",
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.inkMid,
    cursor: "pointer",
    fontSize: `${tokens.typography.fs.fs14}px`,
    lineHeight: 1,
    padding: 0,
  },
  section: { display: "grid", gap: "10px" },
  label: {
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  swatches: { display: "flex", gap: "10px", flexWrap: "wrap" },
  swatch: {
    width: "24px",
    height: "24px",
    borderStyle: "solid",
    borderWidth: "1.5px",
    borderColor: tokens.colors.ink15,
    borderRadius: 0,
    cursor: "pointer",
    padding: 0,
    transition: tokens.transitions.fast,
  },
  row: { display: "flex", gap: "8px", flexWrap: "wrap" },
  choice: {
    minHeight: "30px",
    padding: "6px 12px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink70,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 400,
  },
  choiceActive: {
    minHeight: "30px",
    padding: "6px 12px",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 500,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "12px",
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
