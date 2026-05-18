/**
 * EstadoVacioOpm — Inicio OPM compacto desde canvas vacio.
 *
 * Brief: docs/instrucciones-lineas-dev/ronda21/linea-1-estado-vacio-opm.md
 * Pendiente que cierra: informe UI/UX 2026-05-07 §P2 estado vacio + eval
 * "crear SD <60s".
 *
 * Doctrina:
 *  - Bloque DISCRETO dentro del canvas-pane (no landing page, no hero).
 *  - 3 botones de creacion primaria + 1 secundario (Asistente).
 *  - Cuando hay 2 entidades con firma legal proceso->objeto y 0 enlaces,
 *    ofrece "Conectar como resultado" como nudge separado, no overlay
 *    pedagogico (EPICA-91 descartada — no tutorial mode).
 *  - Reusa operaciones existentes: `crearEntidadEnCanvas` (con su modal de
 *    nombre via `nuevaCosaPendiente`), `crearEnlaceEntreEntidades`,
 *    `iniciarAsistente`. NO inventa flujos paralelos.
 *  - El bloque desaparece al existir la primera apariencia. La nudge
 *    aparece tras la segunda.
 *  - Tokens-only para chrome (cero hex literales). [JOYAS §1].
 */

import { useEstadoVacioOpmViewModel } from "../app/viewmodels/estadoVacioOpmViewModel";
import { colors, radii, shadows, spacing, typography } from "./tokens";

export function EstadoVacioOpm() {
  const vm = useEstadoVacioOpmViewModel();

  if (vm.readOnly) return null;
  // El empty state desaparece al existir la primera apariencia (brief §1.5).
  if (vm.estaVacio) {
    return (
      <BloqueInicioVacio
        onCrearProceso={vm.crearProceso}
        onCrearObjeto={vm.crearObjeto}
        onCrearAgenteInstrumento={vm.crearAgenteInstrumento}
        onAbrirAsistente={vm.iniciarAsistente}
      />
    );
  }

  // Nudge "Conectar como resultado" — visible cuando hay exactamente 1
  // proceso + 1 objeto, 0 enlaces y firma legal (proceso -> objeto). Si la
  // firma no es legal o ya hay enlaces, no se muestra (el usuario ya tiene
  // el menu "Tipos validos" en la toolbar como fallback explicito).
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

interface BloqueInicioProps {
  onCrearProceso: () => void;
  onCrearObjeto: () => void;
  onCrearAgenteInstrumento: () => void;
  onAbrirAsistente: () => void;
}

function BloqueInicioVacio({ onCrearProceso, onCrearObjeto, onCrearAgenteInstrumento, onAbrirAsistente }: BloqueInicioProps) {
  return (
    <div
      data-testid="estado-vacio-opm"
      role="region"
      aria-label="Iniciar SD"
      style={style.bloque}
    >
      <div style={style.titulo}>Iniciar SD</div>
      <div style={style.subtitulo}>Crea la primera cosa para arrancar el modelo.</div>
      <div style={style.botoneraPrimaria}>
        <button
          type="button"
          style={style.botonPrimario}
          data-testid="estado-vacio-crear-proceso"
          onClick={onCrearProceso}
          title="Crear el proceso central del SD (forma elipse, 135x60)"
        >
          Crear proceso
        </button>
        <button
          type="button"
          style={style.botonPrimario}
          data-testid="estado-vacio-crear-objeto"
          onClick={onCrearObjeto}
          title="Agregar un objeto que el proceso transforma"
        >
          Agregar objeto
        </button>
        <button
          type="button"
          style={style.botonPrimario}
          data-testid="estado-vacio-crear-agente-instrumento"
          onClick={onCrearAgenteInstrumento}
          title="Agregar un objeto que sera agente o instrumento del proceso"
        >
          Agregar agente/instrumento
        </button>
      </div>
      <div style={style.botoneraSecundaria}>
        <button
          type="button"
          style={style.botonSecundario}
          data-testid="estado-vacio-abrir-asistente"
          onClick={onAbrirAsistente}
          title="Abrir asistente guiado para sembrar un modelo desde funcion-beneficiario"
        >
          Abrir asistente
        </button>
      </div>
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

/* L1 ronda 21 — empty state OPM, tokens-only chrome */
const style = {
  bloque: {
    position: "absolute",
    top: spacing.lg,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: spacing.sm,
    padding: `${spacing.md}px ${spacing.lg}px`,
    background: colors.fondoChrome,
    border: `1px solid ${colors.bordeIntermedio}`,
    borderRadius: radii.lg,
    boxShadow: shadows.card,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.md,
    color: colors.textoPrimario,
    pointerEvents: "auto",
    zIndex: 4,
    maxWidth: 520,
  },
  titulo: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textoCasiNegro,
  },
  subtitulo: {
    fontSize: typography.sizes.sm,
    color: colors.textoSecundario,
    marginBottom: spacing.xs,
  },
  botoneraPrimaria: {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  botonPrimario: {
    flex: "1 1 auto",
    padding: `${spacing.xs}px ${spacing.md}px`,
    border: `1px solid ${colors.acentoUi}`,
    borderRadius: radii.control,
    background: colors.acentoUi,
    color: colors.fondoChrome,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    cursor: "pointer",
    minWidth: 0,
  },
  botoneraSecundaria: {
    display: "flex",
    justifyContent: "flex-end",
  },
  botonSecundario: {
    padding: `${spacing.xs}px ${spacing.md}px`,
    border: `1px solid ${colors.bordeControl}`,
    borderRadius: radii.control,
    background: colors.fondoChrome,
    color: colors.textoControl,
    fontFamily: typography.familyChrome,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    cursor: "pointer",
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
