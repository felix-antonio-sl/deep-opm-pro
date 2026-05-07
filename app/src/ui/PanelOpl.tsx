// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useMemo, useState } from "preact/hooks";
import { agruparOracionesPorOpd, ordenarOpdsParaOpl } from "../opl/bloquesJerarquicos";
import { generarOplInteractivo } from "../opl/generar";
import { filtrarLineasPorReferencia, type OplReferencia } from "../opl/interaccion";
import { planificarEdicionOplLibre, type PrevisualizacionOplReverse } from "../opl/parser";
import { useOpmStore } from "../store";
import { Bloques } from "./panelOpl/Bloques";
import type { EdicionOpl } from "./panelOpl/RenderToken";
import { ToolbarOpl } from "./panelOpl/Toolbar";
import { tokens } from "./tokens";

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
  const aplicarEdicionOplLibre = useOpmStore((s) => s.aplicarEdicionOplLibre);
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
  const [editorLibre, setEditorLibre] = useState(false);
  const [textoLibre, setTextoLibre] = useState("");
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
        editorActivo={editorLibre}
        onEditarLibre={() => {
          const siguiente = !editorLibre;
          setEditorLibre(siguiente);
          if (siguiente) setTextoLibre(textoOplActual);
        }}
      />

      {editorLibre ? (
        <EditorLibre
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

function EditorLibre(props: {
  texto: string;
  preview: PrevisualizacionOplReverse | null;
  onTexto: (texto: string) => void;
  onAplicar: () => void;
  onCancelar: () => void;
}) {
  const errores = props.preview?.diagnosticos.filter((diagnostico) => diagnostico.severidad === "error") ?? [];
  const avisos = props.preview?.diagnosticos.filter((diagnostico) => diagnostico.severidad !== "error") ?? [];
  const patches = props.preview?.patches ?? [];
  const puedeAplicar = errores.length === 0 && patches.length > 0;

  return (
    <section style={style.editor} data-testid="panel-opl-editor-libre">
      <textarea
        data-testid="panel-opl-editor-textarea"
        aria-label="Editor OPL libre"
        value={props.texto}
        style={style.editorTextarea}
        spellcheck={false}
        onInput={(event) => props.onTexto((event.currentTarget as HTMLTextAreaElement).value)}
      />
      <div style={style.editorFooter}>
        <span style={errores.length > 0 ? style.editorError : style.editorResumen}>
          {errores.length > 0
            ? `${errores.length} error${errores.length === 1 ? "" : "es"}`
            : `${patches.length} cambio${patches.length === 1 ? "" : "s"} aplicable${patches.length === 1 ? "" : "s"}`}
        </span>
        <button type="button" style={style.editorBtn} onClick={props.onCancelar}>Cancelar</button>
        <button
          type="button"
          data-testid="panel-opl-editor-aplicar"
          style={{ ...style.editorBtn, ...(puedeAplicar ? style.editorBtnPrimario : style.editorBtnDisabled) }}
          disabled={!puedeAplicar}
          onClick={props.onAplicar}
        >
          Aplicar
        </button>
      </div>
      {patches.length > 0 ? (
        <ul style={style.previewList} data-testid="panel-opl-editor-preview">
          {patches.slice(0, 8).map((patch, index) => (
            <li key={`${patch.tipo}-${index}`}>L{patch.linea}: {descripcionPatch(patch)}</li>
          ))}
        </ul>
      ) : null}
      {[...errores, ...avisos].length > 0 ? (
        <ul style={style.diagnostics} data-testid="panel-opl-editor-diagnosticos">
          {[...errores, ...avisos].slice(0, 6).map((diagnostico, index) => (
            <li key={`${diagnostico.codigo}-${index}`}>L{diagnostico.linea}: {diagnostico.mensaje}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function descripcionPatch(patch: PrevisualizacionOplReverse["patches"][number]): string {
  switch (patch.tipo) {
    case "renombrar-entidad": return `renombrar ${patch.anterior} -> ${patch.siguiente}`;
    case "cambiar-esencia": return `esencia ${patch.anterior} -> ${patch.siguiente}`;
    case "cambiar-afiliacion": return `afiliacion ${patch.anterior} -> ${patch.siguiente}`;
    case "crear-entidad": return `crear ${patch.entidadTipo} ${patch.nombre}`;
    case "sincronizar-estados": return `sincronizar estados (${patch.nombres.join(", ")})`;
    case "renombrar-estado": return `estado ${patch.anterior} -> ${patch.siguiente}`;
    case "crear-enlace": return `crear enlace ${patch.tipoEnlace}`;
    case "fijar-etiqueta-enlace": return `etiqueta enlace -> ${patch.siguiente || "(vacia)"}`;
  }
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
  barraMinimizada: {
    width: "100%",
    height: "100%",
    minHeight: 28,
    border: 0,
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSlate,
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    padding: "4px 12px",
  },
  toolbarSpacer: { minHeight: 26, marginBottom: 10 },
  empty: { color: tokens.colors.textoTerciario },
  editor: {
    display: "grid",
    gap: 8,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: 4,
    background: tokens.colors.fondoElevado,
    padding: 10,
  },
  editorTextarea: {
    minHeight: 220,
    resize: "vertical",
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: 4,
    padding: 8,
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    lineHeight: 1.5,
    color: tokens.colors.textoPrimario,
    background: tokens.colors.fondoChrome,
  },
  editorFooter: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  editorResumen: { color: tokens.colors.textoSecundario, marginRight: "auto", fontSize: "12px", fontWeight: 700 },
  editorError: { color: tokens.colors.errorTexto, marginRight: "auto", fontSize: "12px", fontWeight: 700 },
  editorBtn: {
    border: `1px solid ${tokens.colors.bordeNeutral}`,
    borderRadius: 4,
    background: tokens.colors.fondoTabla,
    color: tokens.colors.textoSlate,
    fontSize: "12px",
    fontWeight: 700,
    padding: "5px 10px",
    cursor: "pointer",
  },
  editorBtnPrimario: {
    borderColor: tokens.colors.chromeNeutral,
    background: tokens.colors.fondoLineaTiempo,
    color: tokens.colors.textoPrimario,
  },
  editorBtnDisabled: { opacity: 0.45, cursor: "not-allowed" },
  previewList: {
    margin: 0,
    paddingLeft: 18,
    color: tokens.colors.textoSecundario,
    fontSize: "12px",
  },
  diagnostics: {
    margin: 0,
    paddingLeft: 18,
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
