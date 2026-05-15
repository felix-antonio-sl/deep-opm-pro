// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { agruparOracionesPorOpd, ordenarOpdsParaOpl } from "../opl/bloquesJerarquicos";
import { generarOplInteractivo } from "../opl/generar";
import { filtrarLineasPorReferencia, lineaTocaReferencia, type OplReferencia } from "../opl/interaccion";
import { planificarEdicionOplLibre, type PrevisualizacionOplReverse } from "../opl/parser";
import { useOpmStore } from "../store";
import { Bloques } from "./panelOpl/Bloques";
import { atributosIfmlPanelOpl } from "./panelOpl/dataFlow";
import { EditorOplHonesto } from "./panelOpl/EditorOplHonesto";
import type { EdicionOpl } from "./panelOpl/RenderToken";
import { editorOplStyles } from "./panelOpl/styles";
import { ToolbarOpl } from "./panelOpl/Toolbar";
import { tokens } from "./tokens";

/**
 * Barrel publico del panel OPL-ES. IFML: PanelOpl es el detail OPL del
 * multidetail `Canvas -> {Inspector, OPL, ArbolOpd}` (`CN-MMD`), alimentado
 * por DataFlow puro desde seleccion/modelo y sin Action local sobre el canvas.
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
  const aplicarEdicionOplLibre = useOpmStore((s) => s.aplicarEdicionOplLibre);
  const fijarFiltroOplPorSeleccion = useOpmStore((s) => s.fijarFiltroOplPorSeleccion);
  const fijarHoverOpl = useOpmStore((s) => s.fijarHoverOpl);
  const buscarEnPanelOpl = useOpmStore((s) => s.buscarEnPanelOpl);
  const alternarNumeracionOpl = useOpmStore((s) => s.alternarNumeracionOpl);
  const minimizarOpl = useOpmStore((s) => s.minimizarOpl);
  const restaurarOpl = useOpmStore((s) => s.restaurarOpl);
  const alternarBloqueOplContraido = useOpmStore((s) => s.alternarBloqueOplContraido);
  const mostrarPlaceholderAiOpl = useOpmStore((s) => s.mostrarPlaceholderAiOpl);
  const copiarOplActualAlPortapapeles = useOpmStore((s) => s.copiarOplActualAlPortapapeles);
  const exportarOplActualHtml = useOpmStore((s) => s.exportarOplActualHtml);
  const [edicion, setEdicion] = useState<EdicionOpl | null>(null);
  const [editorLibre, setEditorLibre] = useState(false);
  const [textoLibre, setTextoLibre] = useState("");
  const contenedorRef = useRef<HTMLElement | null>(null);
  const numeracionVisible = preferenciasOpl?.oplNumeracionVisible ?? true;
  const posicion = "inferior";
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
  const textoOplActual = useMemo(() => lineas.map((linea) => linea.texto).join("\n"), [lineas]);
  const previewLibre = useMemo<PrevisualizacionOplReverse | null>(
    () => editorLibre ? planificarEdicionOplLibre(modelo, textoLibre, { opdActivoId }) : null,
    [editorLibre, modelo, textoLibre, opdActivoId],
  );
  const bloques = useMemo(() => agruparOracionesPorOpd(lineas, modelo), [lineas, modelo]);
  const filtradasPorSeleccion = filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas;
  const query = busquedaOpl.toLowerCase().trim();
  const visibles = query
    ? filtradasPorSeleccion.filter((linea) => linea.texto.toLowerCase().includes(query))
    : filtradasPorSeleccion;
  const visiblesPorId = new Set(visibles.map((linea) => linea.id));

  /**
   * Coherencia transversal: cuando una seleccion proviene de canvas/Inspector,
   * el panel debe revelar la oracion correspondiente sin exigir scroll manual.
   * Se ancla a la primera linea OPL que toca la seleccion actual.
   */
  useEffect(() => {
    if (!seleccionRef || editorLibre || minimizado || vistaMapaActiva) return;
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    const primera = visibles.find((linea) => lineaTocaReferencia(linea, seleccionRef));
    if (!primera) return;
    const node = contenedor.querySelector<HTMLElement>(`[data-opl-ordinal="${primera.ordinal}"]`);
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [seleccionRef?.tipo, seleccionRef?.id, editorLibre, minimizado, vistaMapaActiva, lineas.length]);

  if (vistaMapaActiva) {
    return (
      <aside style={style.panel} aria-label="Panel OPL-ES" {...atributosIfmlPanelOpl("no-disponible-mapa")}>
        <div style={style.toolbarSpacer} />
        <span style={style.empty}>Vista mapa: OPL no disponible</span>
      </aside>
    );
  }

  if (minimizado) {
    // Rail minimizado con contador estable. Contenido textual literal
    // `OPL · {N} oraciones · Restaurar` se preserva (smoke 03-opl-panel:217).
    // La mejora L2 ronda 20 es tipográfica: jerarquía visual con label
    // semibold + contador en tabular-nums + restaurar atenuado para que el
    // rail quede legible a 1280x720 sin truncar.
    return (
      <aside
        style={style.panelMinimizado}
        aria-label="Panel OPL-ES"
        data-testid="panel-opl-minimizado"
        {...atributosIfmlPanelOpl("minimizado")}
      >
        <button
          type="button"
          data-testid="panel-opl-restaurar"
          style={editorOplStyles.rail}
          title="Restaurar panel OPL"
          aria-label={`Restaurar panel OPL — ${lineas.length} oraciones`}
          onClick={() => restaurarOpl()}
        >
          <span style={editorOplStyles.railLabel}>OPL</span>
          <span style={editorOplStyles.railSeparador} aria-hidden="true">{" · "}</span>
          <span style={editorOplStyles.railContador}>{lineas.length} oraciones</span>
          <span style={editorOplStyles.railSeparador} aria-hidden="true">{" · "}</span>
          <span style={editorOplStyles.railRestaurar}>Restaurar</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      ref={contenedorRef}
      style={style.panel}
      aria-label="Panel OPL-ES"
      data-testid="panel-opl"
      data-atajos-contexto="panel-opl"
      {...atributosIfmlPanelOpl("activo")}
    >
      <ToolbarOpl
        totalOraciones={lineas.length}
        busquedaOpl={busquedaOpl}
        filtroActivo={filtroActivo}
        numeracionVisible={numeracionVisible}
        posicion={posicion}
        onMinimizar={minimizarOpl}
        onToggleNumeracion={alternarNumeracionOpl}
        onPlaceholderAi={mostrarPlaceholderAiOpl}
        onBuscar={buscarEnPanelOpl}
        onCopiar={copiarOplActualAlPortapapeles}
        onExportarHtml={exportarOplActualHtml}
        onFiltroSeleccion={fijarFiltroOplPorSeleccion}
        editorActivo={editorLibre}
        onEditarLibre={() => {
          const siguiente = !editorLibre;
          setEditorLibre(siguiente);
          if (siguiente) setTextoLibre(textoOplActual);
        }}
      />

      {editorLibre ? (
        <EditorOplHonesto
          texto={textoLibre}
          preview={previewLibre}
          onTexto={setTextoLibre}
          onCancelar={() => {
            setEditorLibre(false);
            setTextoLibre("");
          }}
          onAplicar={() => {
            aplicarEdicionOplLibre(textoLibre);
            setEditorLibre(false);
          }}
        />
      ) : visibles.length === 0 ? (
        <span style={style.empty}>
          {lineas.length === 0
            ? "Sin OPL todavía. Inserta una cosa con la toolbar para que las oraciones aparezcan aquí en español."
            : query
              ? "Sin resultados para la búsqueda."
              : "Sin oraciones para la selección."}
        </span>
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
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    lineHeight: 1.65,
    minHeight: 0,
    height: "100%",
    boxSizing: "border-box",
  },
  panelMinimizado: {
    overflow: "hidden",
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSlate,
    minHeight: 0,
    height: "100%",
    boxSizing: "border-box",
  },
  toolbarSpacer: { minHeight: 26, marginBottom: 10 },
  empty: { color: tokens.colors.textoTerciario },
} satisfies Record<string, preact.JSX.CSSProperties>;
