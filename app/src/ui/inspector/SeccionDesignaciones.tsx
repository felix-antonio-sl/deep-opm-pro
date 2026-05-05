import { designacionesEstado } from "../../modelo/estadosDesignaciones";
import type { DesignacionEstado, Estado } from "../../modelo/tipos";

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
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
  tagActive: {
    height: "28px",
    border: "1px solid #586D8C",
    borderRadius: "4px",
    background: "#e8eef5",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
