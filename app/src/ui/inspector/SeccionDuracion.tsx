// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import timeDurationIcon from "../../../../assets/svg/timeDuration.svg";
import type { Estado } from "../../modelo/tipos";
import { tokens } from "../tokens";

/**
 * Tag de duración temporal del estado.
 * SSOT: [Glos 3.43] duración asociada a estado; asset assets/svg/timeDuration.svg [JOYAS §2].
 */
interface Props {
  estado: Estado;
  onAbrirDuracion: (estadoId: string) => void;
}

export function SeccionDuracion(props: Props) {
  return (
    <button type="button" style={stateStyles.tag} onClick={() => props.onAbrirDuracion(props.estado.id)} title="Duración temporal">
      <img src={timeDurationIcon} alt="" aria-hidden="true" style={stateStyles.icon} />
      {props.estado.duracion ? "Duración*" : "Duración"}
    </button>
  );
}

const stateStyles = {
  tag: {
    height: "28px",
    padding: "0 8px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  icon: { width: "12px", height: "12px", display: "block" },
} satisfies Record<string, preact.JSX.CSSProperties>;
