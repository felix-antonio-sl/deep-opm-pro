import { nombreExtremo } from "../../modelo/extremos";
import type { Entidad, Id, Modelo, SatisfaccionRequisito, TargetSatisfaccionRequisito } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";
import { identificadorEnlaceInspector, identificadorInspector } from "./identificador";

export function satisfaccionesDeTarget(modelo: Modelo, target: TargetSatisfaccionRequisito): SatisfaccionRequisito[] {
  return Object.values(modelo.satisfaccionesRequisito ?? {}).filter((satisfaccion) =>
    satisfaccion.target.tipo === target.tipo && satisfaccion.target.id === target.id
  );
}

export function satisfaccionesDeRequisito(modelo: Modelo, requisitoEntidadId: Id): SatisfaccionRequisito[] {
  return Object.values(modelo.satisfaccionesRequisito ?? {}).filter((satisfaccion) => satisfaccion.requisitoEntidadId === requisitoEntidadId);
}

export function primerOpdConEntidad(modelo: Modelo, entidadId: Id, preferidoId?: Id): Id | null {
  if (preferidoId && Object.values(modelo.opds[preferidoId]?.apariencias ?? {}).some((apariencia) => apariencia.entidadId === entidadId)) {
    return preferidoId;
  }
  return Object.values(modelo.opds).find((opd) =>
    Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId)
  )?.id ?? null;
}

export function SeccionRequisitosVinculados(props: {
  modelo: Modelo;
  satisfacciones: readonly SatisfaccionRequisito[];
  emptyText: string;
  onAbrirRequisito: (requisitoEntidadId: Id) => void;
}) {
  const items = props.satisfacciones
    .map((satisfaccion) => ({ satisfaccion, requisito: props.modelo.entidades[satisfaccion.requisitoEntidadId] }))
    .filter((item): item is { satisfaccion: SatisfaccionRequisito; requisito: Entidad } => !!item.requisito);
  return (
    <section style={requisitosStyles.section} data-testid="inspector-requisitos-vinculados">
      <span class="opm-label-uppercase" style={style.label}>Requisitos vinculados</span>
      {items.length === 0 ? (
        <p style={style.hint}>{props.emptyText}</p>
      ) : (
        <div style={requisitosStyles.rows}>
          {items.map(({ satisfaccion, requisito }) => (
            <div key={satisfaccion.id} style={requisitosStyles.row}>
              <div style={requisitosStyles.copy}>
                <span style={requisitosStyles.primary}>{etiquetaRequisito(requisito)}</span>
                <span style={requisitosStyles.meta}>{estadoLegible(satisfaccion.estado)}</span>
              </div>
              <button type="button" style={requisitosStyles.inlineButton} onClick={() => props.onAbrirRequisito(requisito.id)}>
                Abrir
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function SeccionCoberturaRequisito(props: {
  modelo: Modelo;
  satisfacciones: readonly SatisfaccionRequisito[];
  onAbrirEntidad: (entidadId: Id) => void;
  onAbrirEnlace: (enlaceId: Id) => void;
}) {
  return (
    <section style={requisitosStyles.section} data-testid="inspector-requisito-cobertura">
      <span class="opm-label-uppercase" style={style.label}>Cubre</span>
      {props.satisfacciones.length === 0 ? (
        <p style={style.hint}>Este requisito todavía no cubre ninguna cosa ni enlace.</p>
      ) : (
        <div style={requisitosStyles.rows}>
          {props.satisfacciones.map((satisfaccion) => {
            const target = describirTarget(props.modelo, satisfaccion.target);
            return (
              <div key={satisfaccion.id} style={requisitosStyles.row}>
                <div style={requisitosStyles.copy}>
                  <span style={requisitosStyles.primary}>{target.primary}</span>
                  <span style={requisitosStyles.meta}>{target.meta} · {estadoLegible(satisfaccion.estado)}</span>
                </div>
                <button
                  type="button"
                  style={requisitosStyles.inlineButton}
                  disabled={target.missing}
                  onClick={() => {
                    if (satisfaccion.target.tipo === "entidad") props.onAbrirEntidad(satisfaccion.target.id);
                    else props.onAbrirEnlace(satisfaccion.target.id);
                  }}
                >
                  Abrir
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function etiquetaRequisito(requisito: Entidad): string {
  const idLogico = requisito.requisito?.idLogico;
  return idLogico ? `${idLogico} · ${requisito.nombre}` : requisito.nombre;
}

function describirTarget(modelo: Modelo, target: TargetSatisfaccionRequisito): { primary: string; meta: string; missing: boolean } {
  if (target.tipo === "entidad") {
    const entidad = modelo.entidades[target.id];
    if (!entidad) return { primary: target.id, meta: "entidad no encontrada", missing: true };
    return {
      primary: entidad.nombre,
      meta: `${identificadorInspector(entidad.id)} · ${entidad.tipo}`,
      missing: false,
    };
  }
  const enlace = modelo.enlaces[target.id];
  if (!enlace) return { primary: target.id, meta: "enlace no encontrado", missing: true };
  return {
    primary: `Enlace ${enlace.tipo}`,
    meta: `${identificadorEnlaceInspector(enlace.id)} · ${nombreExtremo(modelo, enlace.origenId)} -> ${nombreExtremo(modelo, enlace.destinoId)}`,
    missing: false,
  };
}

function estadoLegible(estado: SatisfaccionRequisito["estado"]): string {
  return estado === "no-satisface" ? "no satisface" : estado;
}

const requisitosStyles = {
  section: { display: "grid", gap: `${tokens.spacing.xs}px` },
  rows: { display: "grid", gap: `${tokens.spacing.xs}px` },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: `${tokens.spacing.sm}px`,
    minHeight: "34px",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
  },
  copy: { display: "grid", gap: "2px", minWidth: 0 },
  primary: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.semibold,
  },
  meta: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xxs}px`,
  },
  inlineButton: {
    border: 0,
    background: "transparent",
    color: tokens.colors.accentDark,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.semibold,
    padding: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
