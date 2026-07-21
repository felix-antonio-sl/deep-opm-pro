// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Centinela de Drift (Fase 3) — sección «Anclaje» del Inspector de una cosa
// anclada. Lee el estado de drift derivado (`driftMap`) y dispara las acciones
// con efecto `reSincronizarAnclajeEntidad` / `soltarAnclajeEntidad`. El copy es
// honesto biblioteca-nivel (D1) y SIN crimson (D3): el énfasis es tipográfico,
// no cromático de alarma — crimson es UI-only (foco/selección, ui-forja/06 §100).
// Diseño rector: spec `…/2026-06-26-corte-centinela-drift-ui-design.md` §4.3.
import type { Entidad } from "../../modelo/tipos";
import { useState } from "preact/hooks";
import { useOpmStore } from "../../store";
import { deriveReuseIntent, runTutorPolicy } from "../../tutor";
import { tokens } from "../tokens";
import { copyAnclaje } from "./anclajePresentacion";
import { TutorInterventionDetails } from "../TutorDetails";

interface Props {
  entidad: Entidad;
}

/** Predicado puro: la sección solo se monta si la cosa está anclada. */
export function debeMostrarSeccionAnclaje(entidad: Entidad): boolean {
  return entidad.anclaje != null;
}

export function SeccionAnclaje({ entidad }: Props) {
  const driftMap = useOpmStore((s) => s.driftMap);
  const reSincronizar = useOpmStore((s) => s.reSincronizarAnclajeEntidad);
  const soltar = useOpmStore((s) => s.soltarAnclajeEntidad);
  const [eleccionTutor, setEleccionTutor] = useState<"resync" | "detach" | null>(null);

  const anclaje = entidad.anclaje;
  if (!anclaje) return null;

  const copy = copyAnclaje(driftMap[entidad.id], anclaje);
  const tutorActivo = copy.estado === "divergente";
  const intentIdTutor = `anchor:${entidad.id}:drift`;
  const intervencionTutor = runTutorPolicy(deriveReuseIntent({
    intentId: intentIdTutor,
    focus: "anchor-drift",
    driftDetected: tutorActivo,
    choice: eleccionTutor,
  }));

  return (
    <div
      style={anclajeStyles.field}
      data-testid={`inspector-anclaje-${copy.estado}`}
      data-tutor-intent={intentIdTutor}
    >
      <TutorInterventionDetails
        intervention={intervencionTutor}
        testId="tutor-inspector-anclaje"
      />
      {copy.titulo ? <p style={anclajeStyles.titulo}>{copy.titulo}</p> : null}
      <p style={anclajeStyles.cuerpo}>{copy.cuerpo}</p>
      <div style={anclajeStyles.acciones}>
        {copy.mostrarReSincronizar ? (
          <button
            type="button"
            style={anclajeStyles.botonResync}
            data-testid="anclaje-resincronizar"
            data-tutor-entrypoint="anchor:resync"
            onClick={() => {
              setEleccionTutor("resync");
              void reSincronizar(entidad.id);
            }}
          >
            Re-sincronizar
          </button>
        ) : null}
        {copy.mostrarSoltar ? (
          <button
            type="button"
            style={anclajeStyles.botonSoltar}
            data-testid="anclaje-soltar"
            data-tutor-entrypoint="anchor:detach"
            onClick={() => {
              setEleccionTutor("detach");
              soltar(entidad.id);
            }}
          >
            Soltar
          </button>
        ) : null}
      </div>
      {!tutorActivo ? <p style={anclajeStyles.aviso}>{copy.avisoAcciones}</p> : null}
    </div>
  );
}

// Estilos exportados para la aserción dura «sin crimson» (D3) en el test.
export const anclajeStyles = {
  field: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
  },
  titulo: {
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.base}px`,
    fontWeight: tokens.typography.weights.semibold,
    margin: 0,
  },
  cuerpo: {
    color: tokens.colors.ink70,
    fontSize: `${tokens.typography.sizes.base}px`,
    lineHeight: 1.4,
    margin: 0,
  },
  acciones: {
    display: "flex",
    gap: `${tokens.spacing.xs}px`,
    marginTop: `${tokens.spacing.xs}px`,
  },
  // Acción primaria — tinta sólida (no crimson).
  botonResync: {
    flex: 1,
    height: "28px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.semibold,
  },
  // Soltar — outline sobrio en tinta, NO crimson (D3). El copy explica que el
  // gesto admite undo inmediato, pero no una reconversión directa posterior.
  botonSoltar: {
    flex: 1,
    height: "28px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.semibold,
  },
  aviso: {
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    lineHeight: 1.4,
    margin: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
