// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Centinela de Drift (Fase 3) — sección «Anclaje» del Inspector de una cosa
// anclada. Lee el estado de drift derivado (`driftMap`) y dispara las acciones
// con efecto `reSincronizarAnclajeEntidad` / `soltarAnclajeEntidad`. El copy es
// honesto biblioteca-nivel (D1) y SIN crimson (D3): el énfasis es tipográfico,
// no cromático de alarma — crimson es UI-only (foco/selección, ui-forja/06 §100).
// Diseño rector: spec `…/2026-06-26-corte-centinela-drift-ui-design.md` §4.3.
import type { Entidad } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { tokens } from "../tokens";
import { copyAnclaje } from "./anclajePresentacion";

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

  const anclaje = entidad.anclaje;
  if (!anclaje) return null;

  const copy = copyAnclaje(driftMap[entidad.id], anclaje);

  return (
    <div style={anclajeStyles.field} data-testid={`inspector-anclaje-${copy.estado}`}>
      {copy.titulo ? <p style={anclajeStyles.titulo}>{copy.titulo}</p> : null}
      <p style={anclajeStyles.cuerpo}>{copy.cuerpo}</p>
      <div style={anclajeStyles.acciones}>
        {copy.mostrarReSincronizar ? (
          <button
            type="button"
            style={anclajeStyles.botonResync}
            data-testid="anclaje-resincronizar"
            onClick={() => void reSincronizar(entidad.id)}
          >
            Re-sincronizar
          </button>
        ) : null}
        {copy.mostrarSoltar ? (
          <button
            type="button"
            style={anclajeStyles.botonSoltar}
            data-testid="anclaje-soltar"
            onClick={() => soltar(entidad.id)}
          >
            Soltar
          </button>
        ) : null}
      </div>
      <p style={anclajeStyles.aviso}>{copy.avisoAcciones}</p>
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
  // Soltar (irreversible) — outline sobrio en tinta, NO crimson (D3). La
  // gravedad se comunica por copy («Soltar no se deshace»), no por color.
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
