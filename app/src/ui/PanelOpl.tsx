import { useMemo, useState } from "preact/hooks";
import { agruparOracionesPorOpd, ordenarOpdsParaOpl } from "../opl/bloquesJerarquicos";
import { generarOplInteractivo } from "../opl/generar";
import { filtrarLineasPorReferencia, type OplReferencia } from "../opl/interaccion";
import { useOpmStore } from "../store";
import { Bloques } from "./panelOpl/Bloques";
import type { EdicionOpl } from "./panelOpl/RenderToken";
import { ToolbarOpl } from "./panelOpl/Toolbar";

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
  const preferenciasOpl = useOpmStore((s) => s.indice.preferenciasUi);
  const seleccionarDesdeOpl = useOpmStore((s) => s.seleccionarDesdeOpl);
  const renombrarEntidadDesdeOpl = useOpmStore((s) => s.renombrarEntidadDesdeOpl);
  const renombrarEstadoDesdeOpl = useOpmStore((s) => s.renombrarEstadoDesdeOpl);
  const abrirInspectorEnlaceDesdeOpl = useOpmStore((s) => s.abrirInspectorEnlaceDesdeOpl);
  const fijarFiltroOplPorSeleccion = useOpmStore((s) => s.fijarFiltroOplPorSeleccion);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const buscarEnPanelOpl = useOpmStore((s) => s.buscarEnPanelOpl);
  const alternarNumeracionOpl = useOpmStore((s) => s.alternarNumeracionOpl);
  const cambiarPosicionOpl = useOpmStore((s) => s.cambiarPosicionOpl);
  const minimizarOpl = useOpmStore((s) => s.minimizarOpl);
  const restaurarOpl = useOpmStore((s) => s.restaurarOpl);
  const alternarBloqueOplContraido = useOpmStore((s) => s.alternarBloqueOplContraido);
  const mostrarPlaceholderAiOpl = useOpmStore((s) => s.mostrarPlaceholderAiOpl);
  const copiarOplActualAlPortapapeles = useOpmStore((s) => s.copiarOplActualAlPortapapeles);
  const exportarOplActualHtml = useOpmStore((s) => s.exportarOplActualHtml);
  const [edicion, setEdicion] = useState<EdicionOpl | null>(null);
  const numeracionVisible = preferenciasOpl?.oplNumeracionVisible ?? true;
  const posicion = preferenciasOpl?.oplPosicion ?? "inferior";
  const minimizado = preferenciasOpl?.oplMinimizado ?? false;
  const bloquesColapsados = useMemo(
    () => new Set(Object.keys(preferenciasOpl?.oplBloquesContraidos ?? {})),
    [preferenciasOpl?.oplBloquesContraidos],
  );

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
        <div style={style.toolbarSpacer} />
        <span style={style.empty}>Vista mapa: OPL no disponible</span>
      </aside>
    );
  }

  if (minimizado) {
    return (
      <aside style={style.panelMinimizado} aria-label="Panel OPL-ES" data-testid="panel-opl-minimizado">
        <button
          type="button"
          data-testid="panel-opl-restaurar"
          style={style.barraMinimizada}
          title="Restaurar panel OPL"
          onClick={() => restaurarOpl()}
        >
          OPL · {lineas.length} oraciones · Restaurar
        </button>
      </aside>
    );
  }

  return (
    <aside style={style.panel} aria-label="Panel OPL-ES" data-atajos-contexto="panel-opl">
      <ToolbarOpl
        totalOraciones={lineas.length}
        busquedaOpl={busquedaOpl}
        filtroActivo={filtroActivo}
        numeracionVisible={numeracionVisible}
        posicion={posicion}
        onMinimizar={minimizarOpl}
        onToggleNumeracion={alternarNumeracionOpl}
        onTogglePosicion={() => cambiarPosicionOpl()}
        onPlaceholderAi={mostrarPlaceholderAiOpl}
        onBuscar={buscarEnPanelOpl}
        onCopiar={copiarOplActualAlPortapapeles}
        onExportarHtml={exportarOplActualHtml}
        onFiltroSeleccion={fijarFiltroOplPorSeleccion}
      />

      {visibles.length === 0 ? (
        <span style={style.empty}>{lineas.length === 0 ? "Sin OPL todavía." : query ? "Sin resultados para la búsqueda." : "Sin oraciones para la selección."}</span>
      ) : (
        <Bloques
          bloques={bloques}
          visiblesPorId={visiblesPorId}
          opdActivoId={opdActivoId}
          hoverOplRef={hoverOplRef}
          seleccionRef={seleccionRef}
          numeracionVisible={numeracionVisible}
          bloquesColapsados={bloquesColapsados}
          alternarBloqueContraido={alternarBloqueOplContraido}
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

const style = {
  panel: {
    overflow: "auto",
    padding: "10px 14px",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "13px",
    lineHeight: 1.65,
    minHeight: 0,
    height: "100%",
    boxSizing: "border-box",
  },
  panelMinimizado: {
    overflow: "hidden",
    background: "#ffffff",
    color: "#334155",
    minHeight: 0,
    height: "100%",
    boxSizing: "border-box",
  },
  barraMinimizada: {
    width: "100%",
    height: "100%",
    minHeight: 28,
    border: 0,
    borderTop: "1px solid #d9e0ea",
    background: "#f8fafc",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    padding: "4px 12px",
  },
  toolbarSpacer: { minHeight: 26, marginBottom: 10 },
  empty: { color: "#667085" },
} satisfies Record<string, preact.JSX.CSSProperties>;
