// Ronda Codex v1 · L2 — re-piel a flag tipografico (cero logica nueva).
//
// Duracion temporal del estado pasa de pill con icono SVG a PALABRA tipografica
// (Codex usa glifos/palabras, no iconos vectoriales; Apendice "Patrones
// prohibidos"). Activa (duracion definida) => bold + underline ink; inactiva =>
// inkSoft. Sigue siendo `<button>` accesible.
// SSOT: [Glos 3.43] duracion asociada a estado.
import type { Estado } from "../../modelo/tipos";
import { tokens } from "../tokens";

interface Props {
  estado: Estado;
  onAbrirDuracion: (estadoId: string) => void;
}

export function SeccionDuracion(props: Props) {
  const activa = !!props.estado.duracion;
  return (
    <button
      type="button"
      aria-pressed={activa}
      style={activa ? stateStyles.flagActive : stateStyles.flag}
      onClick={() => props.onAbrirDuracion(props.estado.id)}
      title="Duración temporal"
    >
      duración
    </button>
  );
}

const flagBase: preact.JSX.CSSProperties = {
  border: 0,
  padding: 0,
  background: "transparent",
  fontFamily: tokens.typography.sans,
  fontSize: `${tokens.typography.fs.fs11}px`,
  fontWeight: tokens.typography.weights.regular,
  cursor: "pointer",
};

const stateStyles = {
  flag: {
    ...flagBase,
    color: tokens.colors.inkSoft,
  },
  flagActive: {
    ...flagBase,
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.semibold,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
