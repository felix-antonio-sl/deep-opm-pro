/**
 * EstadoVacioOpm — Hint inferior discreto + nudge "Conectar como resultado".
 *
 * Corte 3.5 sustracción de chrome: se eliminó el bloque centrado "Iniciar SD"
 * con sus 3 botones primarios + botón de asistente. La toolbar (Objeto /
 * Proceso) y el PantallaInicio (cuando aplica) ya son los puntos de entrada
 * para crear la primera cosa. Aquí solo queda:
 *
 *  - Hint inferior discreto cuando el OPD activo está vacío.
 *  - Nudge "Conectar como resultado" cuando hay exactamente 1 proceso + 1
 *    objeto, 0 enlaces y firma legal proceso → objeto.
 *
 * Tokens-only chrome (cero hex literales) [JOYAS §1].
 */

import { useEstadoVacioOpmViewModel } from "../app/viewmodels/estadoVacioOpmViewModel";
import { colors, radii, shadows, spacing, typography } from "./tokens";

export function EstadoVacioOpm() {
  const vm = useEstadoVacioOpmViewModel();

  if (vm.readOnly) return null;
  if (vm.estaVacio) {
    return <HintInicioVacio />;
  }
  if (vm.sugerenciaResultado) {
    return (
      <NudgeConectarResultado
        nombreProceso={vm.sugerenciaResultado.proceso.nombre}
        nombreObjeto={vm.sugerenciaResultado.objeto.nombre}
        onConectar={vm.conectarResultado}
      />
    );
  }
  return null;
}

function HintInicioVacio() {
  return (
    <div
      data-testid="estado-vacio-hint"
      role="note"
      aria-label="Iniciar SD"
      style={style.hint}
    >
      Pulsa Objeto o Proceso arriba para empezar.
    </div>
  );
}

interface NudgeProps {
  nombreProceso: string;
  nombreObjeto: string;
  onConectar: () => void;
}

function NudgeConectarResultado({ nombreProceso, nombreObjeto, onConectar }: NudgeProps) {
  return (
    <div
      data-testid="estado-vacio-nudge-resultado"
      role="region"
      aria-label="Sugerencia: conectar como resultado"
      style={style.nudge}
    >
      <span style={style.nudgeTexto}>
        Siguiente paso: conectar <strong>{nombreProceso}</strong> que produce <strong>{nombreObjeto}</strong>.
      </span>
      <button
        type="button"
        style={style.botonNudge}
        data-testid="estado-vacio-conectar-resultado"
        onClick={onConectar}
        title={`Crear enlace de resultado: ${nombreProceso} -> ${nombreObjeto}`}
      >
        Conectar como resultado
      </button>
    </div>
  );
}

/* Corte 3.5 sustracción de chrome — solo hint inferior + nudge, tokens-only. */
const style = {
  hint: {
    position: "absolute",
    bottom: spacing.lg,
    left: "50%",
    transform: "translateX(-50%)",
    padding: `${spacing.xs}px ${spacing.md}px`,
    background: colors.fondoChrome,
    border: `1px solid ${colors.bordeSuave}`,
    borderRadius: radii.pill,
    boxShadow: shadows.sm,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.sm,
    color: colors.textoSecundario,
    pointerEvents: "none",
    zIndex: 4,
    maxWidth: 420,
  },
  nudge: {
    position: "absolute",
    bottom: spacing.lg,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: spacing.sm,
    padding: `${spacing.xs}px ${spacing.md}px`,
    background: colors.acentoUiSuave,
    border: `1px solid ${colors.infoBordeSuave}`,
    borderRadius: radii.pill,
    boxShadow: shadows.popover,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.sm,
    color: colors.textoPrimario,
    pointerEvents: "auto",
    zIndex: 4,
    maxWidth: 560,
  },
  nudgeTexto: {
    color: colors.textoSecundario,
  },
  botonNudge: {
    padding: `${spacing.xs}px ${spacing.md}px`,
    border: `1px solid ${colors.acentoUi}`,
    borderRadius: radii.pill,
    background: colors.acentoUi,
    color: colors.fondoChrome,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    cursor: "pointer",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
