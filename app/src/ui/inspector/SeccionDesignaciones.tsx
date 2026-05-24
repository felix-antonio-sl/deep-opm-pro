// Ronda Codex v1 · L2 — re-piel a flags tipograficos (cero logica nueva).
//
// Las designaciones de estado (inicial/final/default/current) pasan de pills con
// background a PALABRAS tipograficas (filosofia Codex §12, decision blocked §9):
// activa => bold + underline ink; inactiva => inkSoft; deshabilitada (exclusion
// mutua default↔current) => inkFaint not-allowed. Siguen siendo `<button>` con
// el mismo nombre accesible ("Inicial"/"Final"/"Default"/"Current") para
// preservar e2e que las localiza por rol+nombre.
import { designacionesEstado } from "../../modelo/estadosDesignaciones";
import type { DesignacionEstado, Estado } from "../../modelo/tipos";
import { tokens } from "../tokens";

interface Props {
  estado: Estado;
  onDesignar: (estadoId: string, designacion: DesignacionEstado) => void;
  onQuitarDesignacion: (estadoId: string, designacion: DesignacionEstado) => void;
}

const DESIGNACIONES: ReadonlyArray<DesignacionEstado> = ["inicial", "final", "default", "current"];

export function SeccionDesignaciones(props: Props) {
  const activas = designacionesEstado(props.estado);
  return (
    <span style={stateStyles.flags}>
      {DESIGNACIONES.map((designacion) => {
        const activa = activas.includes(designacion);
        const excluida = designacion === "default"
          ? activas.includes("current")
          : designacion === "current" && activas.includes("default");
        return (
          <button
            key={designacion}
            type="button"
            disabled={excluida}
            aria-pressed={activa}
            style={excluida ? stateStyles.flagOff : activa ? stateStyles.flagActive : stateStyles.flag}
            onClick={() => activa ? props.onQuitarDesignacion(props.estado.id, designacion) : props.onDesignar(props.estado.id, designacion)}
            title={activa ? "Quitar designación" : `Designar ${designacion}`}
          >
            {etiquetaDesignacion(designacion)}
          </button>
        );
      })}
    </span>
  );
}

function etiquetaDesignacion(designacion: DesignacionEstado): string {
  if (designacion === "default") return "Default";
  if (designacion === "current") return "Current";
  return designacion === "inicial" ? "Inicial" : "Final";
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
  flags: {
    display: "inline-flex",
    flexWrap: "wrap" as const,
    gap: `${tokens.spacing.sm}px`,
  },
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
  flagOff: {
    ...flagBase,
    color: tokens.colors.inkFaint,
    cursor: "not-allowed",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
