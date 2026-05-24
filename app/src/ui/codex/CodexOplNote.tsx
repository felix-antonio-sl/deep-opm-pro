// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semantico invariante.
//
// Ronda Codex v1 · L1 — `CodexOPLNote` (ui-forja/02-components.md §6,
// 04-opl-rendering.md §1/§5/§6).
//
// Una oracion OPL como parrafo numerado en marginalia: numero + cuerpo (que usa
// OplObj/OplProc/OplState) + slot opcional de marginalia de validacion.
//
//   - Numero: mono pequeno, inkSoft. Sube a crimson cuando `selected` (§5; el
//     crimson es canal UI, no semantica de estado).
//   - Cuerpo: serif, inkMid por defecto, sube a ink full + subrayado crimson
//     cuando `selected`.
//   - Marginalia: `△ SEVERIDAD` (kicker mono 9px tracking 0.12em uppercase) +
//     descripcion italic serif 11px, indent 38px. Color por severidad
//     (critica→crimson, alta→oliva, sin severidad→inkSoft).
//
// El render del numero/cuerpo se delega al padre (LineaOpl ya tiene grid,
// data-* y eventos de seleccion/edicion). Este componente fija la PIEL Codex:
// columnas de numero+cuerpo y la marginalia al pie. No muta el modelo ni
// regenera OPL — solo cambia como se VE la oracion.
import type { ComponentChildren } from "preact";
import { GLIFO_WARN } from "./glifos";
import { tokens } from "../tokens";

export type SeveridadOplNote = "critica" | "alta";

export interface CodexOplNoteProps {
  /** Numero ordinal ya formateado (ej. "01", "24"). */
  numero: ComponentChildren;
  /** Cuerpo de la oracion — usa OplObj/OplProc/OplState para los nombres. */
  cuerpo: ComponentChildren;
  /** Oracion seleccionada: numero crimson + cuerpo ink + subrayado UI (§5). */
  seleccionada?: boolean;
  /** Numeracion oculta: el numero se atenua sin perder el hueco de layout. */
  numeracionVisible?: boolean;
  /** Texto de la marginalia de validacion (§6). Si falta, no se renderiza. */
  marginalia?: ComponentChildren;
  /** Severidad de la marginalia: define el color del kicker `△` y el texto. */
  severidad?: SeveridadOplNote;
  /** Etiqueta de severidad mostrada en el kicker (ej. "ALTA"). */
  etiquetaSeveridad?: string;
  /** Atributos `data-*` / aria heredados de la linea (testIds inmutables). */
  contenedorProps?: Record<string, string | number | boolean | undefined>;
  /** Estilo extra del contenedor (estados hover/seleccion/sim del padre). */
  estiloContenedor?: preact.JSX.CSSProperties;
}

/**
 * Oracion OPL numerada en marginalia. La estructura formal (numero + cuerpo +
 * marginalia) es la de `02-components §6`; los nombres OPM del cuerpo deben
 * venir ya envueltos en OplObj/OplProc/OplState por el llamador.
 */
export function CodexOplNote(props: CodexOplNoteProps) {
  const numeracionVisible = props.numeracionVisible ?? true;
  const estiloSev = estiloMarginalia(props.severidad);
  return (
    <div
      {...props.contenedorProps}
      style={{ ...estilos.contenedor, ...(props.estiloContenedor ?? {}) }}
    >
      <div style={estilos.fila}>
        <span
          style={{
            ...estilos.numero,
            ...(props.seleccionada ? estilos.numeroSeleccionado : {}),
            ...(numeracionVisible ? {} : estilos.numeroOculto),
          }}
          aria-hidden={!numeracionVisible}
        >
          {props.numero}
        </span>
        <span
          style={{
            ...estilos.cuerpo,
            ...(props.seleccionada ? estilos.cuerpoSeleccionado : {}),
          }}
        >
          {props.cuerpo}
        </span>
      </div>
      {props.marginalia != null ? (
        <p style={{ ...estilos.marginalia, ...estiloSev }} role="note">
          <span style={{ ...estilos.kicker, ...estiloSev }}>
            {GLIFO_WARN} {props.etiquetaSeveridad ?? etiquetaPorSeveridad(props.severidad)}
          </span>
          <span style={estilos.marginaliaTexto}>{props.marginalia}</span>
        </p>
      ) : null}
    </div>
  );
}

function etiquetaPorSeveridad(severidad: SeveridadOplNote | undefined): string {
  if (severidad === "critica") return "CRITICA";
  if (severidad === "alta") return "ALTA";
  return "NOTA";
}

// Color de la marginalia por severidad (04 §6): critica→crimson, alta→oliva,
// sin severidad→inkSoft. El crimson aqui es canal UI de severidad, no estado OPM.
function estiloMarginalia(severidad: SeveridadOplNote | undefined): preact.JSX.CSSProperties {
  if (severidad === "critica") return { color: tokens.colors.crimson };
  if (severidad === "alta") return { color: tokens.colors.opm.state };
  return { color: tokens.colors.inkSoft };
}

const INDENT_MARGINALIA = 38;

const estilos = {
  contenedor: {
    display: "block",
  },
  fila: {
    display: "grid",
    gridTemplateColumns: "30px minmax(0, 1fr)",
    columnGap: tokens.spacing.sm,
    alignItems: "baseline",
  },
  // Numero ordinal: mono inkSoft tabular. Crimson en seleccion (§5).
  numero: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontVariantNumeric: "tabular-nums" as const,
    fontSize: `${tokens.typography.fs.fs10}px`,
    textAlign: "right" as const,
  },
  numeroSeleccionado: {
    color: tokens.colors.crimson,
  },
  numeroOculto: { opacity: 0 },
  // Cuerpo: serif inkMid por defecto; ink full + subrayado crimson en seleccion.
  cuerpo: {
    minWidth: 0,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    lineHeight: tokens.typography.lh.opl,
  },
  cuerpoSeleccionado: {
    color: tokens.colors.ink,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.crimson}`,
  },
  // Marginalia de validacion: indent 38px, separada de la oracion.
  marginalia: {
    margin: 0,
    marginTop: "2px",
    marginLeft: `${INDENT_MARGINALIA}px`,
    lineHeight: tokens.typography.lh.body,
    fontFamily: tokens.typography.serif,
    fontStyle: "italic" as const,
    fontSize: `${tokens.typography.fs.fs11}px`,
  },
  // Kicker `△ SEVERIDAD`: mono 9px tracking 0.12em uppercase.
  kicker: {
    marginRight: tokens.spacing.sm,
    fontFamily: tokens.typography.mono,
    fontStyle: "normal" as const,
    fontSize: `${tokens.typography.fs.fs9}px`,
    letterSpacing: tokens.typography.ls.mark,
    textTransform: "uppercase" as const,
  },
  marginaliaTexto: {
    // Hereda el color de la severidad desde el contenedor `<p>`.
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
