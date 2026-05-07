// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { designacionesEstado } from "../../modelo/estadosDesignaciones";
import type { DesignacionEstado, Estado } from "../../modelo/tipos";
import { tokens } from "../tokens";

interface Props {
  estado: Estado;
  onDesignar: (estadoId: string, designacion: DesignacionEstado) => void;
  onQuitarDesignacion: (estadoId: string, designacion: DesignacionEstado) => void;
}

export function SeccionDesignaciones(props: Props) {
  return (
    <>
      {(["inicial", "final", "default", "current"] as const).map((designacion) => {
        const activa = designacionesEstado(props.estado).includes(designacion);
        const excluida = designacion === "default"
          ? designacionesEstado(props.estado).includes("current")
          : designacion === "current" && designacionesEstado(props.estado).includes("default");
        return (
          <button
            key={designacion}
            type="button"
            style={activa ? stateStyles.tagActive : stateStyles.tag}
            disabled={excluida}
            onClick={() => activa ? props.onQuitarDesignacion(props.estado.id, designacion) : props.onDesignar(props.estado.id, designacion)}
            title={activa ? "Quitar designación" : `Designar ${designacion}`}
          >
            {etiquetaDesignacion(designacion)}
          </button>
        );
      })}
    </>
  );
}

function etiquetaDesignacion(designacion: DesignacionEstado): string {
  if (designacion === "default") return "Default";
  if (designacion === "current") return "Current";
  return designacion === "inicial" ? "Inicial" : "Final";
}

const stateStyles = {
  tag: {
    height: "28px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
  tagActive: {
    height: "28px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.chromeNeutralSuave,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
