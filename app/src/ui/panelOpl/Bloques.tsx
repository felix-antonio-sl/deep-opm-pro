import { togglearColapsoBloque, type BloqueOpl } from "../../opl/bloquesJerarquicos";
import { lineaTocaReferencia, type OplLineaInteractiva, type OplReferencia } from "../../opl/interaccion";
import { RenderToken, type EdicionOpl } from "./RenderToken";

interface BloquesProps {
  bloques: BloqueOpl[];
  visiblesPorId: Set<string>;
  opdActivoId: string;
  hoverOplRef: OplReferencia | null;
  seleccionRef: OplReferencia | null;
  bloquesColapsados: Set<string>;
  setBloquesColapsados: (actualizar: (actual: Set<string>) => Set<string>) => void;
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
            style={{ ...style.bloque, marginLeft: `${bloque.profundidad * 18}px` }}
          >
            <button
              type="button"
              data-testid={`cabecera-bloque-opl-${bloque.opdId}`}
              style={style.bloqueHeader}
              onClick={() => props.setBloquesColapsados((actual) => togglearColapsoBloque(actual, bloque.opdId))}
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
      <span style={style.ordinal}>{props.linea.ordinal}.</span>
      <span style={style.texto}>
        {props.linea.tokens.map((token) => (
          <RenderToken
            key={token.id}
            token={token}
            hoverOplRef={props.hoverOplRef}
            edicion={props.edicion}
            setEdicion={props.setEdicion}
            seleccionarDesdeOpl={props.seleccionarDesdeOpl}
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
  bloque: { marginBottom: 8 },
  bloqueHeader: {
    width: "100%",
    minHeight: 28,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid #e4eaf1",
    borderRadius: 4,
    background: "#f8fafc",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    padding: "3px 8px",
  },
  chevron: { width: 14, color: "#586D8C", fontWeight: 700 },
  bloqueConteo: { color: "#667085", fontSize: "11px", fontWeight: 600 },
  lineaOpdActiva: { background: "#fbfdff" },
  lineaHover: { background: "#edf2f7" },
  lineaSeleccionada: { boxShadow: "inset 3px 0 0 #586D8C" },
  ordinal: {
    color: "#667085",
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
  },
  texto: { minWidth: 0 },
} satisfies Record<string, preact.JSX.CSSProperties>;
