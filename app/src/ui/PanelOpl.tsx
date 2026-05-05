import { useMemo, useState } from "preact/hooks";
import { agruparOracionesPorOpd, ordenarOpdsParaOpl } from "../opl/bloquesJerarquicos";
import { generarOplInteractivo } from "../opl/generar";
import { filtrarLineasPorReferencia, type OplReferencia } from "../opl/interaccion";
import { useOpmStore } from "../store";
import { Bloques } from "./panelOpl/Bloques";
import type { EdicionOpl } from "./panelOpl/RenderToken";

/**
 * Barrel publico del panel OPL-ES. Conserva lecturas amplias del store y baja
 * props a leaves de render, alineado con OPL como lente derivada del modelo.
 */
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
  const [edicion, setEdicion] = useState<EdicionOpl | null>(null);
  const [bloquesColapsados, setBloquesColapsados] = useState<Set<string>>(() => new Set());

  const seleccionRef: OplReferencia | null = enlaceSeleccionId
    ? { tipo: "enlace", id: enlaceSeleccionId }
    : seleccionId
      ? { tipo: "entidad", id: seleccionId }
      : null;
  const lineas = useMemo(
    () => ordenarOpdsParaOpl(modelo).flatMap((id) => generarOplInteractivo(modelo, id)),
    [modelo],
  );
  const bloques = useMemo(() => agruparOracionesPorOpd(lineas, modelo), [lineas, modelo]);
  const filtradasPorSeleccion = filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas;
  const query = busquedaOpl.toLowerCase().trim();
  const visibles = query
    ? filtradasPorSeleccion.filter((linea) => linea.texto.toLowerCase().includes(query))
    : filtradasPorSeleccion;
  const visiblesPorId = new Set(visibles.map((linea) => linea.id));

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
      <div style={style.toolbar}>
        <input
          type="text"
          placeholder="Buscar en OPL..."
          value={busquedaOpl}
          aria-label="Buscar texto en OPL"
          style={style.searchInput}
          onInput={(event) => fijarBusquedaOpl((event.currentTarget as HTMLInputElement).value)}
        />
        <button style={botonToolbar(lineas.length === 0)} disabled={lineas.length === 0} title="Copiar todo el OPL al portapapeles" onClick={() => copiarOplActualAlPortapapeles()}>
          Copiar OPL
        </button>
        <button style={botonToolbar(lineas.length === 0)} disabled={lineas.length === 0} title="Exportar OPL como archivo HTML" onClick={() => exportarOplActualHtml()}>
          Exportar HTML
        </button>
        <button style={botonToolbar(bloques.length === 0)} disabled={bloques.length === 0} title="Expandir todos los bloques OPD" onClick={() => setBloquesColapsados(new Set())}>
          Expandir todo
        </button>
        <button style={botonToolbar(bloques.length === 0)} disabled={bloques.length === 0} title="Colapsar todos los bloques OPD" onClick={() => setBloquesColapsados(new Set(bloques.map((bloque) => bloque.opdId)))}>
          Colapsar todo
        </button>
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
        <Bloques
          bloques={bloques}
          visiblesPorId={visiblesPorId}
          opdActivoId={opdActivoId}
          hoverOplRef={hoverOplRef}
          seleccionRef={seleccionRef}
          bloquesColapsados={bloquesColapsados}
          setBloquesColapsados={setBloquesColapsados}
          edicion={edicion}
          setEdicion={setEdicion}
          seleccionarDesdeOpl={seleccionarDesdeOpl}
          renombrarEntidadDesdeOpl={renombrarEntidadDesdeOpl}
          renombrarEstadoDesdeOpl={renombrarEstadoDesdeOpl}
          abrirInspectorEnlaceDesdeOpl={abrirInspectorEnlaceDesdeOpl}
          fijarHoverOpl={fijarHoverOpl}
        />
      )}
    </aside>
  );
}

function botonToolbar(disabled: boolean): preact.JSX.CSSProperties {
  return { ...style.toolbarBtn, ...(disabled ? style.btnDisabled : {}) };
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
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  toggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    color: "#475467",
    fontSize: "11px",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  empty: { color: "#667085" },
} satisfies Record<string, preact.JSX.CSSProperties>;
