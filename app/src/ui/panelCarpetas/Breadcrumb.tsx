// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Id } from "../../modelo/tipos";
import type { CarpetaIndice } from "../../persistencia/workspace";
import { tokens } from "../tokens";

interface BreadcrumbProps {
  segmentos: CarpetaIndice[];
  carpetaActualId: Id | null;
  onNavegarBreadcrumb: (carpetaId: Id | null, segmentIndex: number) => void;
}

/**
 * Ruta de carpeta actual del selector de workspace.
 */
export function Breadcrumb(props: BreadcrumbProps) {
  return (
    <div style={style.breadcrumbBar}>
      <button
        type="button"
        style={style.backButton}
        disabled={props.carpetaActualId === null}
        aria-label="Atrás"
        onClick={() => {
          if (props.segmentos.length > 0) {
            const ultimo = props.segmentos[props.segmentos.length - 1]!;
            props.onNavegarBreadcrumb(ultimo.padreId, props.segmentos.length - 2);
          } else {
            props.onNavegarBreadcrumb(null, -1);
          }
        }}
      >
        {"<"}
      </button>
      <nav aria-label="Ubicación" style={style.breadcrumb}>
        <span style={style.breadcrumbPart}>
          <button
            type="button"
            style={{ ...style.breadcrumbButton, fontWeight: props.carpetaActualId === null ? 700 : 400 }}
            onClick={() => props.onNavegarBreadcrumb(null, -1)}
          >
            Inicio
          </button>
        </span>
        {props.segmentos.map((segmento, index) => (
          <span key={segmento.id} style={style.breadcrumbPart}>
            <span style={style.separator}>/</span>
            <button
              type="button"
              style={{ ...style.breadcrumbButton, fontWeight: index === props.segmentos.length - 1 ? 700 : 400 }}
              onClick={() => props.onNavegarBreadcrumb(segmento.id, index)}
            >
              {segmento.nombre}
            </button>
          </span>
        ))}
      </nav>
    </div>
  );
}

// Ronda 28 L3: Breadcrumb Bauhaus — backButton mono ink-30, ruta tipográfica.
const style = {
  breadcrumbBar: { display: "flex" as const, alignItems: "center", gap: tokens.spacing.sm },
  backButton: {
    width: "30px",
    height: "30px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontWeight: tokens.typography.weights.medium,
    flexShrink: 0,
    cursor: "pointer",
    transition: tokens.transitions.fast,
  },
  breadcrumb: {
    display: "flex" as const,
    alignItems: "center",
    minWidth: 0,
    flexWrap: "wrap" as const,
    gap: tokens.spacing.xs,
  },
  breadcrumbPart: { display: "inline-flex" as const, alignItems: "center", gap: tokens.spacing.xs },
  separator: {
    color: tokens.colors.ink30,
    fontFamily: tokens.typography.fontFamilyMono,
  },
  breadcrumbButton: {
    border: 0,
    padding: 0,
    background: "transparent",
    color: tokens.colors.ink70,
    fontSize: tokens.typography.sizes.sm,
    cursor: "pointer",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
