import { useMemo, useState } from "preact/hooks";
import { generarOplInteractivo } from "../opl/generar";
import {
  filtrarLineasPorReferencia,
  lineaTocaReferencia,
  mismaReferencia,
  type OplReferencia,
  type OplToken,
} from "../opl/interaccion";
import { useOpmStore } from "../store";

export function PanelOpl() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const filtroActivo = useOpmStore((s) => s.filtroOplPorSeleccion);
  const hoverOplRef = useOpmStore((s) => s.hoverOplRef);
  const busquedaOpl = useOpmStore((s) => s.busquedaOpl);
  const seleccionarDesdeOpl = useOpmStore((s) => s.seleccionarDesdeOpl);
  const renombrarEntidadDesdeOpl = useOpmStore((s) => s.renombrarEntidadDesdeOpl);
  const renombrarEstadoDesdeOpl = useOpmStore((s) => s.renombrarEstadoDesdeOpl);
  const abrirInspectorEnlaceDesdeOpl = useOpmStore((s) => s.abrirInspectorEnlaceDesdeOpl);
  const fijarFiltroOplPorSeleccion = useOpmStore((s) => s.fijarFiltroOplPorSeleccion);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const fijarBusquedaOpl = useOpmStore((s) => s.fijarBusquedaOpl);
  const copiarOplActualAlPortapapeles = useOpmStore((s) => s.copiarOplActualAlPortapapeles);
  const exportarOplActualHtml = useOpmStore((s) => s.exportarOplActualHtml);

  const [edicion, setEdicion] = useState<{
    tipo: "entidad" | "estado";
    id: string;
    tokenId: string;
    valor: string;
  } | null>(null);

  const seleccionRef = enlaceSeleccionId
    ? ({ tipo: "enlace", id: enlaceSeleccionId } as const)
    : seleccionId
      ? ({ tipo: "entidad", id: seleccionId } as const)
      : null;

  const lineas = useMemo(() => generarOplInteractivo(modelo, opdActivoId), [modelo, opdActivoId]);

  // Combinar filtros: selección + búsqueda (AND)
  const filtradasPorSeleccion = filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas;
  const query = busquedaOpl.toLowerCase().trim();
  const visibles = query
    ? filtradasPorSeleccion.filter((linea) => linea.texto.toLowerCase().includes(query))
    : filtradasPorSeleccion;

  // Profundidad del OPD activo (HU-50.026). Cableado a 0 para OPD único,
  // preparado para HU-50.027 cuando haya múltiples OPDs visibles.
  const profundidad = 0;
  const indentacion = profundidad * 20;

  // HU-21.006: OPL no disponible durante vista mapa
  if (vistaMapaActiva) {
    return (
      <aside style={style.panel} aria-label="Panel OPL-ES">
        <div style={style.toolbar} />
        <span style={style.empty}>Vista mapa: OPL no disponible</span>
      </aside>
    );
  }

  return (
    <aside style={style.panel} aria-label="Panel OPL-ES">
      {/* ── Barra superior: búsqueda + botones ── */}
      <div style={style.toolbar}>
        <input
          type="text"
          placeholder="Buscar en OPL..."
          value={busquedaOpl}
          aria-label="Buscar texto en OPL"
          style={style.searchInput}
          onInput={(event) =>
            fijarBusquedaOpl((event.currentTarget as HTMLInputElement).value)
          }
        />
        <button
          style={{ ...style.toolbarBtn, ...(lineas.length === 0 ? style.btnDisabled : {}) }}
          disabled={lineas.length === 0}
          title="Copiar todo el OPL al portapapeles"
          onClick={() => copiarOplActualAlPortapapeles()}
        >
          Copiar OPL
        </button>
        <button
          style={{ ...style.toolbarBtn, ...(lineas.length === 0 ? style.btnDisabled : {}) }}
          disabled={lineas.length === 0}
          title="Exportar OPL como archivo HTML"
          onClick={() => exportarOplActualHtml()}
        >
          Exportar HTML
        </button>
        <label style={style.toggle}>
          <input
            type="checkbox"
            checked={filtroActivo}
            onInput={(event) =>
              fijarFiltroOplPorSeleccion((event.currentTarget as HTMLInputElement).checked)
            }
          />
          Filtrar por selección
        </label>
      </div>

      {/* ── Área de oraciones ── */}
      <div style={{ paddingLeft: `${indentacion}px` }}>
        {visibles.length === 0 ? (
          <span style={style.empty}>
            {lineas.length === 0
              ? "Sin OPL todavía."
              : "Sin oraciones para la selección."}
          </span>
        ) : (
          visibles.map((linea) => (
            <div
              key={linea.id}
              data-testid="opl-line"
              data-opl-ordinal={linea.ordinal}
              style={{
                ...style.linea,
                ...(lineaTocaReferencia(linea, hoverOplRef) ? style.lineaHover : {}),
                ...(lineaTocaReferencia(linea, seleccionRef)
                  ? style.lineaSeleccionada
                  : {}),
              }}
            >
              <span style={style.ordinal}>{linea.ordinal}.</span>
              <span style={style.texto}>
                {linea.tokens.map((token) =>
                  renderToken({
                    token,
                    hoverOplRef,
                    edicion,
                    setEdicion,
                    seleccionarDesdeOpl,
                    renombrarEntidadDesdeOpl,
                    renombrarEstadoDesdeOpl,
                    abrirInspectorEnlaceDesdeOpl,
                    fijarHoverOpl,
                  }),
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

// ── Render de token individual ──

function renderToken(props: {
  token: OplToken;
  hoverOplRef: OplReferencia | null;
  edicion: { tipo: "entidad" | "estado"; id: string; tokenId: string; valor: string } | null;
  setEdicion: (value: { tipo: "entidad" | "estado"; id: string; tokenId: string; valor: string } | null) => void;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: string, nombre: string) => void;
  renombrarEstadoDesdeOpl: (estadoId: string, nombre: string) => void;
  abrirInspectorEnlaceDesdeOpl: (enlaceId: string) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
}) {
  const {
    token, hoverOplRef, edicion, setEdicion,
    seleccionarDesdeOpl, renombrarEntidadDesdeOpl,
    renombrarEstadoDesdeOpl, abrirInspectorEnlaceDesdeOpl,
    fijarHoverOpl,
  } = props;

  const editando = edicion && edicion.tokenId === token.id;

  // ── Edición inline para entidad ──
  if (token.ref?.tipo === "entidad" && editando && edicion?.tipo === "entidad") {
    return (
      <input
        key={token.id}
        aria-label="Renombrar desde OPL"
        value={edicion.valor}
        autoFocus
        style={style.inputInline}
        onInput={(event) =>
          setEdicion({
            ...edicion,
            valor: (event.currentTarget as HTMLInputElement).value,
          })
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            renombrarEntidadDesdeOpl(edicion.id, edicion.valor);
            setEdicion(null);
          }
          if (event.key === "Escape") setEdicion(null);
        }}
        onBlur={() => setEdicion(null)}
      />
    );
  }

  // ── Edición inline para estado ──
  if (token.ref?.tipo === "estado" && editando && edicion?.tipo === "estado") {
    return (
      <input
        key={token.id}
        aria-label="Renombrar estado desde OPL"
        value={edicion.valor}
        autoFocus
        style={style.inputInline}
        onInput={(event) =>
          setEdicion({
            ...edicion,
            valor: (event.currentTarget as HTMLInputElement).value,
          })
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            renombrarEstadoDesdeOpl(edicion.id, edicion.valor);
            setEdicion(null);
          }
          if (event.key === "Escape") setEdicion(null);
        }}
        onBlur={() => setEdicion(null)}
      />
    );
  }

  const interactivo = !!token.ref;
  const seleccionado =
    token.ref && hoverOplRef ? mismaReferencia(token.ref, hoverOplRef) : false;
  const contenido = textoVisibleToken(token);

  const isEnlaceDestino = token.rol === "nombre" && token.ref?.tipo === "enlace";
  const enlaceRef = token.ref?.tipo === "enlace" ? token.ref : null;

  const common = {
    key: token.id,
    "data-opl-token": token.ref
      ? `${token.ref.tipo}:${token.ref.id}`
      : undefined,
    "data-opl-rol": token.rol,
    style: {
      ...style.token,
      ...(interactivo ? style.tokenInteractivo : {}),
      ...(seleccionado ? style.tokenHover : {}),
      ...styleTokenMarkdown(token),
      // Señal visual para tokens multi-enlace (HU-50.021): subrayado punteado
      ...(isEnlaceDestino ? style.tokenMultiEnlace : {}),
    },
    onMouseEnter: () => token.ref && fijarHoverOpl(token.ref),
    onMouseLeave: () => token.ref && fijarHoverOpl(null),
    onClick: () => {
      if (token.ref) {
        seleccionarDesdeOpl(token.ref);
      }
    },
    onDblClick: () => {
      if (token.ref?.tipo === "entidad") {
        setEdicion({
          tipo: "entidad",
          id: token.ref.id,
          tokenId: token.id,
          valor: contenido,
        });
        return;
      }
      if (token.ref?.tipo === "estado") {
        setEdicion({
          tipo: "estado",
          id: token.ref.id,
          tokenId: token.id,
          valor: token.texto.replace(/`/g, ""),
        });
        return;
      }
      // Doble clic en verbo → seleccionar y abrir inspector (HU-50.022)
      if (token.rol === "verbo" && enlaceRef) {
        abrirInspectorEnlaceDesdeOpl(enlaceRef.id);
        return;
      }
      if (token.ref?.tipo === "enlace") {
        abrirInspectorEnlaceDesdeOpl(token.ref.id);
      }
    },
  };

  if (token.markdown === "objeto")
    return <strong {...common}>{contenido}</strong>;
  if (token.markdown === "proceso")
    return <em {...common}>{contenido}</em>;
  if (token.markdown === "estado")
    return <code {...common}>{token.texto}</code>;
  return <span {...common}>{token.texto}</span>;
}

// ── Helpers ──

function textoVisibleToken(token: OplToken): string {
  if (token.markdown === "objeto") {
    return token.texto.replace(/\*\*([^*]+)\*\*/g, "$1");
  }
  if (token.markdown === "proceso") {
    return token.texto.replace(/\*([^*\s][^*]*?)\*/g, "$1");
  }
  // Quitar backticks para estados
  return token.texto.replace(/`/g, "");
}

function styleTokenMarkdown(token: OplToken): preact.JSX.CSSProperties {
  if (token.markdown === "objeto") return style.objeto;
  if (token.markdown === "proceso") return style.proceso;
  if (token.markdown === "estado") return style.estado;
  if (token.rol === "verbo") return style.verbo;
  return {};
}

// ── Estilos ──

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
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  searchInput: {
    flex: "1",
    minWidth: 100,
    maxWidth: 220,
    padding: "2px 6px",
    border: "1px solid #d1d5db",
    borderRadius: 4,
    fontSize: "12px",
    fontFamily: "inherit",
  },
  toolbarBtn: {
    border: "1px solid #d1d5db",
    borderRadius: 4,
    background: "#f9fafb",
    color: "#334155",
    fontSize: "11px",
    padding: "2px 8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  toggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: "#475467",
    fontSize: "11px",
    userSelect: "none",
    whiteSpace: "nowrap",
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
  tokenMultiEnlace: {
    borderBottom: "1px dotted #93a3b8",
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
