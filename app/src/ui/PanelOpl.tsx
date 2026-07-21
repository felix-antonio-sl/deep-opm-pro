// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useRef, useState } from "preact/hooks";
import { type PanelOplViewModel, usePanelOplViewModel } from "../app/viewmodels/panelOplViewModel";
import { Bloques } from "./panelOpl/Bloques";
import { atributosIfmlPanelOpl } from "./panelOpl/dataFlow";
import { EditorOplHonesto } from "./panelOpl/EditorOplHonesto";
import type { EdicionOpl } from "./panelOpl/RenderToken";
import { editorOplStyles } from "./panelOpl/styles";
import { ToolbarOpl } from "./panelOpl/Toolbar";
import { scrollBehaviorPreferido } from "./motion";
import { tokens } from "./tokens";
import { derivarDeltaLineasOpl, type DeltaLineasOpl } from "../opl/panel";
import { clasificarEdicionOpl } from "../opl/clasificadorEdicion";
import { deriveViewIntent, runTutorPolicy } from "../tutor";
import { TutorInterventionDetails } from "./TutorDetails";

/**
 * Barrel publico del panel OPL-ES. IFML: PanelOpl es el detail OPL del
 * multidetail `Canvas -> {Inspector, OPL, ArbolOpd}` (`CN-MMD`), alimentado
 * por DataFlow puro desde seleccion/modelo y sin Action local sobre el canvas.
 */
export function PanelOpl() {
  const vm = usePanelOplViewModel();
  return <PanelOplView vm={vm} />;
}

export function PanelOplView({ vm }: { vm: PanelOplViewModel }) {
  const [edicion, setEdicion] = useState<EdicionOpl | null>(null);
  const [deltaOpl, setDeltaOpl] = useState<DeltaLineasOpl | null>(null);
  const contenedorRef = useRef<HTMLElement | null>(null);
  const anteriorRef = useRef<{
    modelo: PanelOplViewModel["modelo"];
    lineas: { id: string; texto: string }[];
  } | null>(null);
  const firmaLineas = JSON.stringify(vm.lineas.map((linea) => [linea.id, linea.texto]));
  const clasificacionOpl = vm.editorLibre
    ? clasificarEdicionOpl(vm.textoLibre, vm.previewLibre)
    : null;
  const intervencionOpl = runTutorPolicy(deriveViewIntent({
    intentId: vm.editorLibre ? "opl:reverse-preview" : `opl:delta:${firmaLineas}`,
    focus: "opl",
    recognizedLines: clasificacionOpl
      ? clasificacionOpl.resumen.aplicables + clasificacionOpl.resumen.sinCambio
      : (deltaOpl?.lineasCambiadasIds.length ?? 0),
    unrecognizedLines: clasificacionOpl?.resumen.noAplicables ?? 0,
    previewVisible: !!vm.previewLibre || !!deltaOpl,
  }));

  useEffect(() => {
    const actuales = vm.lineas.map(({ id, texto }) => ({ id, texto }));
    const anterior = anteriorRef.current;
    anteriorRef.current = { modelo: vm.modelo, lineas: actuales };
    if (!anterior || anterior.modelo.id !== vm.modelo.id || anterior.modelo === vm.modelo) {
      setDeltaOpl(null);
      return;
    }
    const delta = derivarDeltaLineasOpl(anterior.lineas, actuales);
    setDeltaOpl(delta.nuevasOModificadas > 0 || delta.eliminadas > 0 ? delta : null);
  }, [vm.modelo, firmaLineas]);

  useEffect(() => {
    const primeraId = deltaOpl?.lineasCambiadasIds[0];
    if (!primeraId || vm.editorLibre || vm.minimizado || vm.vistaMapaActiva) return;
    const ordinal = vm.lineas.find((linea) => linea.id === primeraId)?.ordinal;
    if (ordinal === undefined) return;
    requestAnimationFrame(() => {
      contenedorRef.current
        ?.querySelector<HTMLElement>(`[data-opl-ordinal="${ordinal}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: scrollBehaviorPreferido() });
    });
  }, [deltaOpl, vm.editorLibre, vm.minimizado, vm.vistaMapaActiva, firmaLineas]);

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
        filtroCodigo={vm.filtroCodigo}
        filtroVisibles={vm.visibles.length}
        numeracionVisible={vm.numeracionVisible}
        onMinimizar={vm.minimizarOpl}
        onToggleNumeracion={vm.alternarNumeracionOpl}
        onPlaceholderAi={vm.mostrarPlaceholderAiOpl}
        onBuscar={vm.buscarEnPanelOpl}
        onCopiar={vm.copiarOplActualAlPortapapeles}
        onFiltroSeleccion={vm.fijarFiltroOplPorSeleccion}
        editorActivo={vm.editorLibre}
        onEditarLibre={vm.alternarEditorLibre}
      />

      {deltaOpl ? (
        <div
          data-testid="panel-opl-delta"
          data-product-feedback="opl-delta"
          style={style.deltaTutor}
        >
          <div role="status" aria-live="polite">
            OPL actualizada · {deltaOpl.nuevasOModificadas} línea{deltaOpl.nuevasOModificadas === 1 ? "" : "s"} nueva{deltaOpl.nuevasOModificadas === 1 ? "" : "s"} o modificada{deltaOpl.nuevasOModificadas === 1 ? "" : "s"}
            {deltaOpl.eliminadas > 0 ? ` · ${deltaOpl.eliminadas} eliminada${deltaOpl.eliminadas === 1 ? "" : "s"}` : ""}
          </div>
        </div>
      ) : null}

      {vm.editorLibre ? (
        <>
          {!deltaOpl ? <TutorInterventionDetails intervention={intervencionOpl} testId="tutor-panel-opl-editor" /> : null}
          <EditorOplHonesto
            texto={vm.textoLibre}
            preview={vm.previewLibre}
            onTexto={vm.fijarTextoLibre}
            onCancelar={vm.cancelarEditorLibre}
            onAplicar={vm.aplicarEditorLibre}
          />
        </>
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
          lineasConDelta={new Set(deltaOpl?.lineasCambiadasIds ?? [])}
          opdActivoId={vm.opdActivoId}
          hoverOplRef={vm.hoverOplRef}
          seleccionRef={vm.seleccionRef}
          procesoActivoSimId={vm.procesoActivoSimId}
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
    padding: "10px 14px 12px",
    background: tokens.colors.fondoPanel,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    lineHeight: 1.65,
    minHeight: 0,
    height: "100%",
    boxSizing: "border-box",
    borderTop: `1px solid ${tokens.colors.bordePanel}`,
  },
  panelMinimizado: {
    overflow: "hidden",
    background: tokens.colors.fondoPanel,
    color: tokens.colors.textoSlate,
    minHeight: 0,
    height: "100%",
    boxSizing: "border-box",
    borderTop: `1px solid ${tokens.colors.bordePanel}`,
  },
  toolbarSpacer: { minHeight: 26, marginBottom: 10 },
  deltaTutor: {
    margin: "4px 0 8px",
    paddingLeft: 8,
    borderLeft: `2px solid ${tokens.colors.inkSoft}`,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.familyChrome,
    fontSize: 12,
    lineHeight: 1.4,
  },
  empty: { color: tokens.colors.textoTerciario },
} satisfies Record<string, preact.JSX.CSSProperties>;
