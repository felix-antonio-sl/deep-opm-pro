// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { BloqueOpl } from "../../opl/bloquesJerarquicos";
import { lineaTocaReferencia, referenciaEnlaceEspecifico, type OplLineaInteractiva, type OplReferencia } from "../../opl/interaccion";
import { RenderToken, type EdicionOpl } from "./RenderToken";
import { tokens } from "../tokens";

interface BloquesProps {
  bloques: BloqueOpl[];
  visiblesPorId: Set<string>;
  opdActivoId: string;
  hoverOplRef: OplReferencia | null;
  seleccionRef: OplReferencia | null;
  procesoActivoSimId: string | null;
  numeracionVisible: boolean;
  bloquesColapsados: Set<string>;
  alternarBloqueContraido: (opdId: string) => void;
  edicion: EdicionOpl | null;
  setEdicion: (value: EdicionOpl | null) => void;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: string, nombre: string) => void;
  renombrarEstadoDesdeOpl: (estadoId: string, nombre: string) => void;
  abrirInspectorEnlaceDesdeOpl: (enlaceId: string) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
}

/**
 * Agrupa oraciones OPL por OPD y conserva los testids del panel historico.
 * Lo consume PanelOpl como leaf prop-driven.
 */
export function Bloques(props: BloquesProps) {
  return (
    <div>
      {props.bloques.map((bloque) => {
        const oracionesVisibles = bloque.oraciones.filter((linea) => props.visiblesPorId.has(linea.id));
        if (oracionesVisibles.length === 0) return null;
        const colapsado = props.bloquesColapsados.has(bloque.opdId);
        return (
          <section
            key={bloque.opdId}
            data-testid={`bloque-opl-${bloque.opdId}`}
            data-opl-nivel={bloque.profundidad}
            style={estiloBloque(bloque.profundidad)}
          >
            <button
              type="button"
              data-testid={`cabecera-bloque-opl-${bloque.opdId}`}
              style={style.bloqueHeader}
              onClick={() => props.alternarBloqueContraido(bloque.opdId)}
              aria-expanded={!colapsado}
            >
              <span style={style.chevron}>{colapsado ? "▸" : "▾"}</span>
              <span>{bloque.opdNombre}</span>
              <span style={style.bloqueConteo}>({bloque.oraciones.length} oraciones)</span>
            </button>
            {colapsado ? null : oracionesVisibles.map((linea) => (
              <LineaOpl key={linea.id} linea={linea} bloqueOpdId={bloque.opdId} {...props} />
            ))}
          </section>
        );
      })}
    </div>
  );
}

function LineaOpl(props: BloquesProps & { linea: OplLineaInteractiva; bloqueOpdId: string }) {
  // B0.025: durante la simulacion, resaltar la(s) frase(s) del proceso activo.
  // Es puramente presentacional: no regenera OPL ni muta el modelo, sólo reusa
  // `lineaTocaReferencia` contra la referencia de entidad del proceso activo.
  const esProcesoActivoSim =
    props.procesoActivoSimId != null &&
    lineaTocaReferencia(props.linea, { tipo: "entidad", id: props.procesoActivoSimId });
  const esSeleccionada = lineaTocaReferencia(props.linea, props.seleccionRef);
  // Composición sim-activa + selección: cuando ambas coinciden, la barra sim
  // (bosque, 4px exterior) envuelve a la barra de selección (cinabrio, 2px
  // interior) y conserva el tinte bosque. No clobbering de una sobre otra.
  const estiloSimActiva = esProcesoActivoSim
    ? {
        ...style.lineaSimActiva,
        ...(esSeleccionada
          ? {
              boxShadow: `inset 4px 0 0 ${tokens.colors.bosque}, inset 2px 0 0 ${tokens.colors.accent}`,
            }
          : {}),
      }
    : {};
  return (
    <div
      data-testid="opl-line"
      data-sim-activa={esProcesoActivoSim ? "true" : undefined}
      data-opl-ordinal={props.linea.ordinal}
      data-opd-id={props.bloqueOpdId}
      style={{
        ...style.linea,
        ...(props.linea.opdId === props.opdActivoId ? style.lineaOpdActiva : {}),
        ...(lineaTocaReferencia(props.linea, props.hoverOplRef) ? style.lineaHover : {}),
        ...(esSeleccionada ? style.lineaSeleccionada : {}),
        ...estiloSimActiva,
      }}
    >
      <span style={ordinalStyle(props.numeracionVisible)} aria-hidden={!props.numeracionVisible}>
        {props.linea.ordinal}.
      </span>
      <span style={style.texto}>
        {props.linea.tokens.map((token, tokenIndex) => (
          <RenderToken
            key={token.id}
            token={token}
            hoverOplRef={props.hoverOplRef}
            edicion={props.edicion}
            setEdicion={props.setEdicion}
            seleccionarDesdeOpl={(ref) => props.seleccionarDesdeOpl(referenciaEnlaceEspecifico(props.linea, tokenIndex) ?? ref)}
            renombrarEntidadDesdeOpl={props.renombrarEntidadDesdeOpl}
            renombrarEstadoDesdeOpl={props.renombrarEstadoDesdeOpl}
            abrirInspectorEnlaceDesdeOpl={props.abrirInspectorEnlaceDesdeOpl}
            fijarHoverOpl={props.fijarHoverOpl}
          />
        ))}
      </span>
    </div>
  );
}

// Ronda 28 L3: Bloques Bauhaus.
//   - section title (cabecera bloque): Inter Tight 11/500 uppercase tracking
//     +0.08em ink-70, sin background ni borde (chrome editorial).
//   - lines: grid 30px 1fr, mono 12px, numeración ink-30 tabular.
//   - hover: ink-04 plano. activo: barra lateral 2px cinabrio izquierda.
const style = {
  linea: {
    display: "grid",
    gridTemplateColumns: "30px minmax(0, 1fr)",
    columnGap: tokens.spacing.sm,
    borderRadius: tokens.radii.xs,
    padding: "2px 4px",
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.sm}px`,
    lineHeight: 1.65,
    transition: tokens.transitions.fast,
  },
  bloque: {
    marginBottom: tokens.spacing.sm,
    paddingLeft: 0,
    borderLeft: "0 solid transparent",
  },
  // Section header del bloque OPD: tipográfico — sin caja, sólo label
  // uppercase y conteo en mono. Mantiene un click target amplio (32px alto)
  // mediante padding vertical pero el contorno desaparece.
  bloqueHeader: {
    width: "100%",
    minHeight: 28,
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.medium,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    cursor: "pointer",
    textAlign: "left" as const,
    padding: `${tokens.spacing.xs}px 0`,
  },
  chevron: {
    width: 14,
    color: tokens.colors.ink50,
    fontWeight: tokens.typography.weights.medium,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xs}px`,
    textTransform: "none" as const,
    letterSpacing: 0,
  },
  bloqueConteo: {
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.sm}px`,
    fontWeight: tokens.typography.weights.normal,
    textTransform: "none" as const,
    letterSpacing: 0,
  },
  lineaOpdActiva: { background: "transparent" },
  lineaHover: { background: tokens.colors.ink04 },
  // Línea seleccionada: barra lateral 2px cinabrio (consistente con árbol y
  // apariencia activa del inspector).
  lineaSeleccionada: {
    boxShadow: `inset 2px 0 0 ${tokens.colors.accent}`,
    background: tokens.colors.ink04,
  },
  // B0.025: frase del proceso activo durante la simulacion. Reusa el mismo
  // mecanismo de barra lateral + tinte que la seleccion, pero en la familia
  // bosque (verde) para alinear con el halo SIM_VERDE del proceso activo en
  // el canvas. Sólo se aplica mientras `procesoActivoSimId != null` (simulando).
  lineaSimActiva: {
    boxShadow: `inset 2px 0 0 ${tokens.colors.bosque}`,
    background: tokens.colors.bosqueSoft,
  },
  ordinal: {
    color: tokens.colors.ink30,
    fontFamily: tokens.typography.fontFamilyMono,
    fontVariantNumeric: "tabular-nums" as const,
    fontSize: `${tokens.typography.sizes.sm}px`,
    textAlign: "right" as const,
  },
  ordinalOculto: { opacity: 0 },
  texto: { minWidth: 0 },
} satisfies Record<string, preact.JSX.CSSProperties>;

// Bloque anidado: usa border-left hairline ink-15 (sutil) en vez de la barra
// 2px corporativa anterior. La jerarquía profundidad → indentación 16px se
// preserva.
function estiloBloque(profundidad: number): preact.JSX.CSSProperties {
  const nivelVisual = Math.min(Math.max(profundidad, 0), 4);
  return {
    ...style.bloque,
    paddingLeft: nivelVisual * 16,
    borderLeft: profundidad > 0
      ? `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`
      : "0 solid transparent",
  };
}

function ordinalStyle(visible: boolean): preact.JSX.CSSProperties {
  return visible ? style.ordinal : { ...style.ordinal, ...style.ordinalOculto };
}
