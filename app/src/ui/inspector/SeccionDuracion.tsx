import type { Estado } from "../../modelo/tipos";

interface Props {
  estado: Estado;
  onAbrirDuracion: (estadoId: string) => void;
}

export function SeccionDuracion(props: Props) {
  return (
    <button type="button" style={stateStyles.tag} onClick={() => props.onAbrirDuracion(props.estado.id)} title="Duración temporal">
      {props.estado.duracion ? "Duración*" : "Duración"}
    </button>
  );
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
} satisfies Record<string, preact.JSX.CSSProperties>;
