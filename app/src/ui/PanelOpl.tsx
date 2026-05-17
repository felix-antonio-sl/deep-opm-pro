// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef, useState } from "preact/hooks";
import {
  panelOplMinimizadoEfectivo,
  usePanelOplViewModel,
} from "../app/viewmodels/panelOplViewModel";
import { Bloques } from "./panelOpl/Bloques";
import { atributosIfmlPanelOpl } from "./panelOpl/dataFlow";
import { EditorOplHonesto } from "./panelOpl/EditorOplHonesto";
import type { EdicionOpl } from "./panelOpl/RenderToken";
import { editorOplStyles } from "./panelOpl/styles";
import { ToolbarOpl } from "./panelOpl/Toolbar";
import { scrollBehaviorPreferido } from "./motion";
import { tokens } from "./tokens";

export { panelOplMinimizadoEfectivo };

/**
 * Barrel publico del panel OPL-ES. IFML: PanelOpl es el detail OPL del
 * multidetail `Canvas -> {Inspector, OPL, ArbolOpd}` (`CN-MMD`), alimentado
 * por DataFlow puro desde seleccion/modelo y sin Action local sobre el canvas.
 */
export function PanelOpl() {
  const vm = usePanelOplViewModel();
  const [edicion, setEdicion] = useState<EdicionOpl | null>(null);
  const contenedorRef = useRef<HTMLElement | null>(null);

  /**
   * Coherencia transversal: cuando una seleccion proviene de canvas/Inspector,
   * el panel debe revelar la oracion correspondiente sin exigir scroll manual.
   * Se ancla a la primera linea OPL que toca la seleccion actual.
   */
  useEffect(() => {
    if (!vm.seleccionRef || vm.editorLibre || vm.minimizado || vm.vistaMapaActiva) return;
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    const primera = vm.primeraVisibleSeleccionada;
    if (!primera) return;
    const node = contenedor.querySelector<HTMLElement>(`[data-opl-ordinal="${primera.ordinal}"]`);
    node?.scrollIntoView({ block: "nearest", behavior: scrollBehaviorPreferido() });
  }, [
    vm.seleccionRef?.tipo,
    vm.seleccionRef?.id,
    vm.editorLibre,
    vm.minimizado,
    vm.vistaMapaActiva,
    vm.lineas.length,
    vm.primeraVisibleSeleccionada?.ordinal,
  ]);

  if (vm.vistaMapaActiva) {
    return (
      <aside style={style.panel} aria-label="Panel OPL-ES" {...atributosIfmlPanelOpl("no-disponible-mapa")}>
        <div style={style.toolbarSpacer} />
        <span style={style.empty}>Vista mapa: OPL no disponible</span>
      </aside>
    );
  }

  if (vm.minimizado) {
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
          aria-label={`Restaurar panel OPL — ${vm.lineas.length} oraciones`}
          onClick={() => vm.restaurarOpl()}
        >
          <span style={editorOplStyles.railLabel}>OPL</span>
          <span style={editorOplStyles.railSeparador} aria-hidden="true">{" · "}</span>
          <span style={editorOplStyles.railContador}>{vm.lineas.length} oraciones</span>
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
        totalOraciones={vm.lineas.length}
        busquedaOpl={vm.busquedaOpl}
        filtroActivo={vm.filtroActivo}
        numeracionVisible={vm.numeracionVisible}
        onMinimizar={vm.minimizarOpl}
        onToggleNumeracion={vm.alternarNumeracionOpl}
        onPlaceholderAi={vm.mostrarPlaceholderAiOpl}
        onBuscar={vm.buscarEnPanelOpl}
        onCopiar={vm.copiarOplActualAlPortapapeles}
        onExportarHtml={vm.exportarOplActualHtml}
        onFiltroSeleccion={vm.fijarFiltroOplPorSeleccion}
        editorActivo={vm.editorLibre}
        onEditarLibre={vm.alternarEditorLibre}
      />

      {vm.editorLibre ? (
        <EditorOplHonesto
          texto={vm.textoLibre}
          preview={vm.previewLibre}
          onTexto={vm.fijarTextoLibre}
          onCancelar={vm.cancelarEditorLibre}
          onAplicar={vm.aplicarEditorLibre}
        />
      ) : vm.visibles.length === 0 ? (
        <span style={style.empty}>
          {vm.lineas.length === 0
            ? "Sin OPL todavía. Inserta una cosa con la toolbar para que las oraciones aparezcan aquí en español."
            : vm.query
              ? "Sin resultados para la búsqueda."
              : "Sin oraciones para la selección."}
        </span>
      ) : (
        <Bloques
          bloques={vm.bloques}
          visiblesPorId={vm.visiblesPorId}
          opdActivoId={vm.opdActivoId}
          hoverOplRef={vm.hoverOplRef}
          seleccionRef={vm.seleccionRef}
          numeracionVisible={vm.numeracionVisible}
          bloquesColapsados={vm.bloquesColapsados}
          alternarBloqueContraido={vm.alternarBloqueOplContraido}
          edicion={edicion}
          setEdicion={setEdicion}
          seleccionarDesdeOpl={vm.seleccionarDesdeOpl}
          renombrarEntidadDesdeOpl={vm.renombrarEntidadDesdeOpl}
          renombrarEstadoDesdeOpl={vm.renombrarEstadoDesdeOpl}
          abrirInspectorEnlaceDesdeOpl={vm.abrirInspectorEnlaceDesdeOpl}
          fijarHoverOpl={vm.fijarHoverOpl}
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
