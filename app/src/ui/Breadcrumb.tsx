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

const style = {
  nav: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: 0,
    height: "32px",
    padding: "0 10px",
    overflow: "hidden",
    color: tokens.colors.textoSecundario,
    borderRight: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoChrome,
  },
  empty: {
    fontSize: "12px",
    fontWeight: 700,
    color: tokens.colors.textoTerciario,
  },
  segmentoWrap: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
  },
  separador: {
    flex: "0 0 auto",
    margin: "0 4px",
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
  },
  segmento: {
    minWidth: 0,
    maxWidth: "180px",
    height: "24px",
    border: "1px solid transparent",
    borderRadius: tokens.radii.sm,
    background: "transparent",
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    padding: "0 6px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "12px",
    fontWeight: 700,
  },
  segmentoActivo: {
    color: tokens.colors.textoPrimario,
    background: tokens.colors.chromeNeutralSuave,
    cursor: "default",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
