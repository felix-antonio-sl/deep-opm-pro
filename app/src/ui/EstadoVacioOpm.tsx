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
  // Ronda 28 L5: copy histórico preservado — el smoke
  // `21-estado-vacio-opm.spec.ts:36` afirma el texto literal incluyendo
  // "arriba" y "Pulsa" sin tilde. El brief L5 sugería "Pulsá Objeto o
  // Proceso para empezar" pero respetamos el contrato de tests (scope: solo
  // estilos, no copy). El cambio visual es el chrome del hint.
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

/* Ronda 28 L5: Bauhaus monocromático. Hint sin chrome decorativo — sólo
 * tipografía ink-50 centrada al pie del canvas. Nudge con borde 1.5px ink,
 * paper bg y sombra plana flatLarge. Sin radius pill, sin íconos. */
const style = {
  hint: {
    position: "absolute",
    bottom: spacing.lg,
    left: "50%",
    transform: "translateX(-50%)",
    padding: `${spacing.xs}px ${spacing.sm}px`,
    background: "transparent",
    border: "none",
    borderRadius: 0,
    boxShadow: "none",
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    color: colors.ink50,
    pointerEvents: "none",
    zIndex: 4,
    maxWidth: 420,
    textAlign: "center",
  },
  nudge: {
    position: "absolute",
    bottom: spacing.lg,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: spacing.md,
    padding: `${spacing.sm}px ${spacing.md}px`,
    background: colors.paper,
    border: `${1.5}px solid ${colors.ink}`,
    borderRadius: 0,
    boxShadow: shadows.flatLarge,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.base,
    color: colors.ink,
    pointerEvents: "auto",
    zIndex: 4,
    maxWidth: 560,
  },
  nudgeTexto: {
    color: colors.ink70,
  },
  botonNudge: {
    padding: `${spacing.xs}px ${spacing.md}px`,
    border: `1.5px solid ${colors.ink}`,
    borderRadius: 0,
    background: colors.ink,
    color: colors.paper,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    cursor: "pointer",
    transition: "150ms ease-out",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
