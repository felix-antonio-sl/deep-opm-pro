import { useBreadcrumbViewModel } from "../app/viewmodels/breadcrumbViewModel";
import type { Id, Modelo, Opd } from "../modelo/tipos";
import { tokens } from "./tokens";

export interface SegmentoBreadcrumbOpd {
  id: Id;
  nombre: string;
}

export function Breadcrumb() {
  const { modelo, opdActivoId, cambiarOpdActivo } = useBreadcrumbViewModel();
  const segmentos = rutaBreadcrumbOpd(modelo, opdActivoId);
  const activo = segmentos[segmentos.length - 1]?.id ?? opdActivoId;

  return (
    <nav aria-label="Ruta OPD" data-testid="breadcrumb-opd" style={style.nav}>
      {segmentos.length === 0 ? (
        <span style={style.empty}>Sin OPD</span>
      ) : (
        segmentos.map((segmento, index) => {
          const esActivo = segmento.id === activo;
          return (
            <span key={segmento.id} style={style.segmentoWrap}>
              {index > 0 ? <span aria-hidden="true" style={style.separador}>/</span> : null}
              <button
                type="button"
                aria-current={esActivo ? "page" : undefined}
                data-testid={`breadcrumb-opd-${segmento.id}`}
                title={segmento.nombre}
                style={esActivo ? { ...style.segmento, ...style.segmentoActivo } : style.segmento}
                onClick={() => {
                  if (!esActivo) cambiarOpdActivo(segmento.id);
                }}
              >
                {segmento.nombre}
              </button>
            </span>
          );
        })
      )}
    </nav>
  );
}

export function rutaBreadcrumbOpd(modelo: Modelo, opdActivoId: Id): SegmentoBreadcrumbOpd[] {
  const inicio = modelo.opds[opdActivoId] ?? modelo.opds[modelo.opdRaizId];
  if (!inicio) return [];
  const ruta: Opd[] = [];
  const visitados = new Set<Id>();
  let actual: Opd | undefined = inicio;

  while (actual && !visitados.has(actual.id)) {
    ruta.push(actual);
    visitados.add(actual.id);
    actual = actual.padreId ? modelo.opds[actual.padreId] : undefined;
  }

  return ruta.reverse().map((opd) => ({ id: opd.id, nombre: opd.nombre }));
}

/**
 * Estilos del Breadcrumb — Ronda 28 L2 (Bauhaus monocromática).
 *
 *   - Fondo paper, sin bordes redondos.
 *   - Separadores `/` en ink-30 (visualmente discretos, monoespaciados).
 *   - Crumb inactivo: ink-70 weight 400. Crumb activo: ink weight 500.
 *     Sin fondo gris translucido — el peso tipografico marca el activo.
 */
const style = {
  nav: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 0,
    height: "32px",
    padding: "0 12px",
    overflow: "hidden",
    color: tokens.colors.ink70,
    borderRight: `1px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
    fontFamily: tokens.typography.fontFamily,
  },
  empty: {
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.medium,
    color: tokens.colors.ink50,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  segmentoWrap: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
  },
  separador: {
    flex: "0 0 auto",
    margin: "0 6px",
    color: tokens.colors.ink30,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.sm}px`,
    lineHeight: 1,
  },
  segmento: {
    minWidth: 0,
    maxWidth: "180px",
    height: "24px",
    border: "1px solid transparent",
    background: "transparent",
    color: tokens.colors.ink70,
    cursor: "pointer",
    padding: "0 4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.normal,
  },
  segmentoActivo: {
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.medium,
    cursor: "default",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
