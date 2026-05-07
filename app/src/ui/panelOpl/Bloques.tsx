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
  return (
    <div
      data-testid="opl-line"
      data-opl-ordinal={props.linea.ordinal}
      data-opd-id={props.bloqueOpdId}
      style={{
        ...style.linea,
        ...(props.linea.opdId === props.opdActivoId ? style.lineaOpdActiva : {}),
        ...(lineaTocaReferencia(props.linea, props.hoverOplRef) ? style.lineaHover : {}),
        ...(lineaTocaReferencia(props.linea, props.seleccionRef) ? style.lineaSeleccionada : {}),
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

const style = {
  linea: {
    display: "grid",
    gridTemplateColumns: "32px minmax(0, 1fr)",
    columnGap: 6,
    borderRadius: 4,
    padding: "2px 4px",
  },
  bloque: {
    marginBottom: 8,
    paddingLeft: 0,
    borderLeft: "0 solid transparent",
  },
  bloqueHeader: {
    width: "100%",
    minHeight: 28,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: 4,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSlate,
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    padding: "3px 8px",
  },
  chevron: { width: 14, color: tokens.colors.chromeNeutral, fontWeight: 700 },
  bloqueConteo: { color: tokens.colors.textoTerciario, fontSize: "11px", fontWeight: 600 },
  lineaOpdActiva: { background: tokens.colors.oplFondo },
  lineaHover: { background: tokens.colors.fondoLineaTiempo },
  lineaSeleccionada: { boxShadow: `inset 3px 0 0 ${tokens.colors.chromeNeutral}` },
  ordinal: {
    color: tokens.colors.textoTerciario,
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
  },
  ordinalOculto: { opacity: 0 },
  texto: { minWidth: 0 },
} satisfies Record<string, preact.JSX.CSSProperties>;

function estiloBloque(profundidad: number): preact.JSX.CSSProperties {
  const nivelVisual = Math.min(Math.max(profundidad, 0), 4);
  return {
    ...style.bloque,
    paddingLeft: nivelVisual * 16,
    borderLeft: profundidad > 0 ? `2px solid ${tokens.colors.oplBorde}` : "0 solid transparent",
  };
}

function ordinalStyle(visible: boolean): preact.JSX.CSSProperties {
  return visible ? style.ordinal : { ...style.ordinal, ...style.ordinalOculto };
}
