import { useEffect } from "preact/hooks";
import { useChipRevisionViewModel } from "../../app/viewmodels/chipRevisionViewModel";
import { tokens } from "../tokens";

/**
 * A′-vitrina: chip de chrome que avisa que un agente empujó una revisión al
 * modelo abierto, y ramifica por si hay cambios locales en riesgo (spec
 * 2026-07-06-puente-directo §6).
 *
 * Vocabulario visual: TINTA (`ink`), glifo «↓» (entrante) — deliberadamente
 * distinto del ● crimson «pendiente» del chip de persistencia y del ⟳ del
 * marcador de drift del Centinela (badge circular del canvas). El costo de la
 * rama destructiva se comunica por el NOMBRE del botón, no por color.
 *
 * El chip monta siempre (devuelve null cuando no hay revisión nueva) y arranca
 * el poll de revisión en su `useEffect` (idempotente, patrón autosalvado).
 */
export function ChipRevisionNueva(): preact.JSX.Element | null {
  const { estado, traer, verVersion, iniciarPoll, detenerPoll } = useChipRevisionViewModel();

  useEffect(() => {
    iniciarPoll();
    return () => detenerPoll();
  }, [iniciarPoll, detenerPoll]);

  if (!estado.visible) return null;

  return (
    <span style={style.contenedor} data-testid="chip-revision-nueva" data-cambios-locales={estado.hayCambiosLocales ? "true" : "false"}>
      <span aria-hidden="true" style={style.glifo}>↓</span>
      <span style={style.etiqueta}>Revisión del agente</span>
      {estado.hayCambiosLocales ? (
        <>
          <button type="button" style={style.boton} onClick={verVersion} data-testid="revision-ver">
            Ver la del agente
          </button>
          <button type="button" style={style.boton} onClick={traer} data-testid="revision-descartar">
            Descartar los míos y traer la del agente
          </button>
        </>
      ) : (
        <button type="button" style={style.boton} onClick={traer} data-testid="revision-recargar">
          Recargar
        </button>
      )}
    </span>
  );
}

// TINTA monocromática, plana (sin radio, sin sombra) — pasa design:governance.
const style = {
  contenedor: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "24px",
    whiteSpace: "nowrap",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.sm}px`,
    color: tokens.colors.ink70,
  },
  glifo: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.medium,
    lineHeight: 1,
  },
  etiqueta: {
    lineHeight: 1,
    fontWeight: tokens.typography.weights.medium,
  },
  boton: {
    height: "22px",
    padding: "0 8px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.medium,
    whiteSpace: "nowrap",
    boxShadow: "none",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
