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

import { useMemo } from "preact/hooks";
import { posicionLibre } from "../modelo/layout";
import { validarFirmaEnlace } from "../modelo/operaciones";
import type { Apariencia, Entidad, Id, Modelo, TipoEntidad } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { colors, radii, shadows, spacing, typography } from "./tokens";

export function EstadoVacioOpm() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const readOnly = useOpmStore((s) => s.readOnly);
  const crearEntidadEnCanvas = useOpmStore((s) => s.crearEntidadEnCanvas);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);
  const iniciarAsistente = useOpmStore((s) => s.iniciarAsistente);

  const apariencias = useMemo(
    () => Object.values(modelo.opds[opdActivoId]?.apariencias ?? {}) as Apariencia[],
    [modelo.opds, opdActivoId],
  );
  const enlacesEnOpd = useMemo(
    () => Object.values(modelo.opds[opdActivoId]?.enlaces ?? {}),
    [modelo.opds, opdActivoId],
  );
  const entidadesVisibles = useMemo(
    () => apariencias
      .map((apariencia) => modelo.entidades[apariencia.entidadId])
      .filter((entidad): entidad is Entidad => !!entidad),
    [apariencias, modelo.entidades],
  );

  if (readOnly) return null;
  // El empty state desaparece al existir la primera apariencia (brief §1.5).
  if (apariencias.length === 0) {
    return (
      <BloqueInicioVacio
        onCrearProceso={() => handleCrearCentrado(crearEntidadEnCanvas, modelo, opdActivoId, "proceso")}
        onCrearObjeto={() => handleCrearCentrado(crearEntidadEnCanvas, modelo, opdActivoId, "objeto")}
        onCrearAgenteInstrumento={() => handleCrearCentrado(crearEntidadEnCanvas, modelo, opdActivoId, "objeto")}
        onAbrirAsistente={iniciarAsistente}
      />
    );
  }

  // Nudge "Conectar como resultado" — visible cuando hay exactamente 1
  // proceso + 1 objeto, 0 enlaces y firma legal (proceso -> objeto). Si la
  // firma no es legal o ya hay enlaces, no se muestra (el usuario ya tiene
  // el menu "Tipos validos" en la toolbar como fallback explicito).
  const sugerenciaResultado = sugerirEnlaceResultado(entidadesVisibles, enlacesEnOpd.length);
  if (sugerenciaResultado) {
    return (
      <NudgeConectarResultado
        nombreProceso={sugerenciaResultado.proceso.nombre}
        nombreObjeto={sugerenciaResultado.objeto.nombre}
        onConectar={() => crearEnlaceEntreEntidades(
          sugerenciaResultado.proceso.id,
          sugerenciaResultado.objeto.id,
          "resultado",
        )}
      />
    );
  }
  return null;
}

interface SugerenciaEnlace {
  proceso: Entidad;
  objeto: Entidad;
}

/**
 * Determina si conviene ofrecer "Conectar como resultado" en el OPD activo.
 *
 * Reglas (cerradas):
 *  - Exactamente 2 entidades visibles (no mas: arriba de eso el estado vacio
 *    cumplio su rol y el usuario tiene toolbar/contextual).
 *  - Una proceso, una objeto.
 *  - 0 enlaces aun.
 *  - Firma legal validarFirmaEnlace("resultado", proceso, objeto).
 */
export function sugerirEnlaceResultado(
  entidadesVisibles: readonly Entidad[],
  cantidadEnlaces: number,
): SugerenciaEnlace | null {
  if (entidadesVisibles.length !== 2) return null;
  if (cantidadEnlaces > 0) return null;
  const proceso = entidadesVisibles.find((entidad) => entidad.tipo === "proceso");
  const objeto = entidadesVisibles.find((entidad) => entidad.tipo === "objeto");
  if (!proceso || !objeto) return null;
  const firma = validarFirmaEnlace("resultado", proceso, objeto);
  if (!firma.ok) return null;
  return { proceso, objeto };
}

function handleCrearCentrado(
  crearEntidadEnCanvas: (tipo: TipoEntidad, posicion: { x: number; y: number }) => void,
  modelo: Modelo,
  opdActivoId: Id,
  tipo: TipoEntidad,
): void {
  // Reutilizamos `posicionLibre` (la misma que usan crearObjetoDemo/
  // crearProcesoDemo) para conservar el layout canonico. La accion
  // `crearEntidadEnCanvas` activa `nuevaCosaPendiente`, que monta el
  // modal de nombre (sub-ViewContainer existente). NO inventamos flujo.
  const posicion = posicionLibre(modelo, opdActivoId, tipo);
  crearEntidadEnCanvas(tipo, posicion);
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
