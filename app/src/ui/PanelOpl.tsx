import { useMemo, useState } from "preact/hooks";
import { generarOplInteractivo } from "../opl/generar";
import { filtrarLineasPorReferencia, lineaTocaReferencia, mismaReferencia, type OplReferencia, type OplToken } from "../opl/interaccion";
import { useOpmStore } from "../store";

export function PanelOpl() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const filtroActivo = useOpmStore((s) => s.filtroOplPorSeleccion);
  const hoverOplRef = useOpmStore((s) => s.hoverOplRef);
  const seleccionarDesdeOpl = useOpmStore((s) => s.seleccionarDesdeOpl);
  const renombrarEntidadDesdeOpl = useOpmStore((s) => s.renombrarEntidadDesdeOpl);
  const fijarFiltroOplPorSeleccion = useOpmStore((s) => s.fijarFiltroOplPorSeleccion);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const [edicion, setEdicion] = useState<{ entidadId: string; tokenId: string; valor: string } | null>(null);
  const seleccionRef = enlaceSeleccionId
    ? ({ tipo: "enlace", id: enlaceSeleccionId } as const)
    : seleccionId
      ? ({ tipo: "entidad", id: seleccionId } as const)
      : null;
  const lineas = useMemo(() => generarOplInteractivo(modelo, opdActivoId), [modelo, opdActivoId]);
  const visibles = filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas;

  return (
    <aside style={style.panel} aria-label="Panel OPL-ES">
      <div style={style.toolbar}>
        <label style={style.toggle}>
          <input
            type="checkbox"
            checked={filtroActivo}
            onInput={(event) => fijarFiltroOplPorSeleccion((event.currentTarget as HTMLInputElement).checked)}
          />
          Filtrar por selección
        </label>
      </div>
      {visibles.length === 0 ? (
        <span style={style.empty}>{lineas.length === 0 ? "Sin OPL todavía." : "Sin oraciones para la selección."}</span>
      ) : (
        visibles.map((linea) => (
          <div
            key={linea.id}
            data-testid="opl-line"
            data-opl-ordinal={linea.ordinal}
            style={{
              ...style.linea,
              ...(lineaTocaReferencia(linea, hoverOplRef) ? style.lineaHover : {}),
              ...(lineaTocaReferencia(linea, seleccionRef) ? style.lineaSeleccionada : {}),
            }}
          >
            <span style={style.ordinal}>{linea.ordinal}.</span>
            <span style={style.texto}>
              {linea.tokens.map((token) => renderToken({
                token,
                hoverOplRef,
                edicion,
                setEdicion,
                seleccionarDesdeOpl,
                renombrarEntidadDesdeOpl,
                fijarHoverOpl,
              }))}
            </span>
          </div>
        ))
      )}
    </aside>
  );
}

function renderToken(props: {
  token: OplToken;
  hoverOplRef: OplReferencia | null;
  edicion: { entidadId: string; tokenId: string; valor: string } | null;
  setEdicion: (value: { entidadId: string; tokenId: string; valor: string } | null) => void;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: string, nombre: string) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
}) {
  const { token, hoverOplRef, edicion, setEdicion, seleccionarDesdeOpl, renombrarEntidadDesdeOpl, fijarHoverOpl } = props;
  if (token.ref?.tipo === "entidad" && edicion?.tokenId === token.id) {
    return (
      <input
        key={token.id}
        aria-label="Renombrar desde OPL"
        value={edicion.valor}
        autoFocus
        style={style.inputInline}
        onInput={(event) => setEdicion({ entidadId: token.ref?.id ?? edicion.entidadId, tokenId: token.id, valor: (event.currentTarget as HTMLInputElement).value })}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            renombrarEntidadDesdeOpl(edicion.entidadId, edicion.valor);
            setEdicion(null);
          }
          if (event.key === "Escape") setEdicion(null);
        }}
        onBlur={() => setEdicion(null)}
      />
    );
  }

  const interactivo = !!token.ref;
  const seleccionado = token.ref && hoverOplRef ? mismaReferencia(token.ref, hoverOplRef) : false;
  const contenido = textoVisibleToken(token);
  const common = {
    key: token.id,
    "data-opl-token": token.ref ? `${token.ref.tipo}:${token.ref.id}` : undefined,
    style: {
      ...style.token,
      ...(interactivo ? style.tokenInteractivo : {}),
      ...(seleccionado ? style.tokenHover : {}),
      ...styleTokenMarkdown(token),
    },
    onMouseEnter: () => token.ref && fijarHoverOpl(token.ref),
    onMouseLeave: () => token.ref && fijarHoverOpl(null),
    onClick: () => token.ref && seleccionarDesdeOpl(token.ref),
    onDblClick: () => {
      if (token.ref?.tipo === "entidad") {
        setEdicion({ entidadId: token.ref.id, tokenId: token.id, valor: contenido });
        return;
      }
      if (token.ref?.tipo === "enlace") seleccionarDesdeOpl(token.ref);
    },
  };

  if (token.markdown === "objeto") return <strong {...common}>{contenido}</strong>;
  if (token.markdown === "proceso") return <em {...common}>{contenido}</em>;
  if (token.markdown === "estado") return <code {...common}>{token.texto}</code>;
  return <span {...common}>{token.texto}</span>;
}

function textoVisibleToken(token: OplToken): string {
  if (token.markdown === "objeto") {
    return token.texto.replace(/\*\*([^*]+)\*\*/g, "$1");
  }
  if (token.markdown === "proceso") {
    return token.texto.replace(/\*([^*\s][^*]*?)\*/g, "$1");
  }
  return token.texto;
}

function styleTokenMarkdown(token: OplToken): preact.JSX.CSSProperties {
  if (token.markdown === "objeto") return style.objeto;
  if (token.markdown === "proceso") return style.proceso;
  if (token.markdown === "estado") return style.estado;
  if (token.rol === "verbo") return style.verbo;
  return {};
}

const style = {
  panel: {
    overflow: "auto",
    padding: "10px 14px",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "13px",
    lineHeight: 1.65,
  },
  toolbar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  toggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "#475467",
    fontSize: "12px",
    userSelect: "none",
  },
  empty: {
    color: "#667085",
  },
  linea: {
    display: "grid",
    gridTemplateColumns: "32px minmax(0, 1fr)",
    columnGap: 6,
    borderRadius: 4,
    padding: "2px 4px",
  },
  lineaHover: {
    background: "#edf2f7",
  },
  lineaSeleccionada: {
    boxShadow: "inset 3px 0 0 #586D8C",
  },
  ordinal: {
    color: "#667085",
    fontVariantNumeric: "tabular-nums",
    textAlign: "right",
  },
  texto: {
    minWidth: 0,
  },
  token: {
    borderRadius: 3,
  },
  tokenInteractivo: {
    cursor: "pointer",
  },
  tokenHover: {
    background: "#E1E6EB",
  },
  objeto: {
    color: "#1f7a3c",
    fontWeight: 700,
  },
  proceso: {
    color: "#147aa5",
    fontStyle: "italic",
    fontWeight: 700,
  },
  estado: {
    color: "#475467",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "12px",
  },
  verbo: {
    color: "#334155",
    fontWeight: 700,
  },
  inputInline: {
    width: "14ch",
    minWidth: 80,
    maxWidth: 220,
    border: "1px solid #586D8C",
    borderRadius: 4,
    padding: "1px 4px",
    font: "inherit",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
