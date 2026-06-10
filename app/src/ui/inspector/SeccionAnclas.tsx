// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { anclasDe } from "../../modelo/anclasNormativas";
import type { AnclaNormativa, TargetAncla } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";
import { etiquetaEstadoAncla, formatearReferencia } from "./anclasPresentacion";

/**
 * W6.4: proyección READ-ONLY de las anclas normativas adjuntas al target
 * seleccionado (entidad/enlace/opd/modelo). Las anclas nacen en el proto y solo
 * transicionan vía re-elicitación de la skill (C1): la app las muestra, no las
 * edita. Las acciones del registro [RATIFICAR] viven a nivel modelo en
 * `SeccionRegistroRatificar` (W6.5-b); aquí el pendiente solo se señaliza.
 */
interface Props {
  target: TargetAncla;
  /** Rótulo de la sección; útil en la rama vacía para distinguir modelo/OPD. */
  titulo?: string;
}

export function SeccionAnclas(props: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const anclas = anclasDe(modelo, props.target);
  if (anclas.length === 0) return null;

  return (
    <div style={style.field} data-testid="inspector-seccion-anclas">
      <span class="opm-label-uppercase" style={style.label}>
        {props.titulo ?? "Anclas normativas"} · {anclas.length}
      </span>
      {anclas.map((ancla) => <FichaAncla key={ancla.id} ancla={ancla} />)}
    </div>
  );
}

function FichaAncla(props: { ancla: AnclaNormativa }) {
  const pendiente = props.ancla.estado === "pendiente-ratificacion";
  return (
    <div style={anclasStyles.ficha} data-testid="ancla-item">
      <div style={anclasStyles.cabecera}>
        <code style={anclasStyles.clave}>{props.ancla.claveProto}</code>
        <span
          style={pendiente ? anclasStyles.estadoPendiente : anclasStyles.estadoVigente}
          title={pendiente
            ? `Pendiente de ratificación (${props.ancla.ratificacion?.nivelAutoridad ?? "—"} · ${props.ancla.ratificacion?.estadoRatificacion ?? "pendiente"}) — se resuelve en el registro modelo-nivel`
            : "Ancla vigente (ratificada en el proto)"}
        >
          {etiquetaEstadoAncla(props.ancla.estado)}
        </span>
      </div>
      {(props.ancla.referencias ?? []).map((referencia, indice) => (
        <span key={indice} style={anclasStyles.referencia}>{formatearReferencia(referencia)}</span>
      ))}
      {props.ancla.nota ? <span style={anclasStyles.nota}>{props.ancla.nota}</span> : null}
    </div>
  );
}

const anclasStyles = {
  ficha: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
  },
  cabecera: {
    display: "flex",
    justifyContent: "space-between",
    gap: `${tokens.spacing.xs}px`,
    alignItems: "baseline",
  },
  clave: {
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    color: tokens.colors.ink,
  },
  estadoVigente: {
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.xxs}px`,
  },
  estadoPendiente: {
    color: tokens.colors.accent,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    fontFamily: tokens.typography.fontFamilyMono,
  },
  referencia: {
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.xxs}px`,
    fontFamily: tokens.typography.fontFamilyMono,
  },
  nota: {
    color: tokens.colors.ink50,
    fontSize: `${tokens.typography.sizes.base}px`,
    lineHeight: 1.4,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
