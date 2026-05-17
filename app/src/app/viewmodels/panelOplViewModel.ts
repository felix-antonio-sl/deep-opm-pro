import { useMemo, useState } from "preact/hooks";
import type { Id } from "../../modelo/tipos/comunes";
import { agruparOracionesPorOpd, ordenarOpdsParaOpl, type BloqueOpl } from "../../opl/bloquesJerarquicos";
import { generarOplInteractivo } from "../../opl/generar";
import {
  filtrarLineasPorReferencia,
  lineaTocaReferencia,
  type OplLineaInteractiva,
  type OplReferencia,
} from "../../opl/interaccion";
import { planificarEdicionOplLibre, type PrevisualizacionOplReverse } from "../../opl/parser";
import { useOpmStore } from "../../store";

export interface PanelOplViewModel {
  vistaMapaActiva: boolean;
  opdActivoId: Id;
  filtroActivo: boolean;
  hoverOplRef: OplReferencia | null;
  busquedaOpl: string;
  query: string;
  seleccionRef: OplReferencia | null;
  lineas: OplLineaInteractiva[];
  textoOplActual: string;
  bloques: BloqueOpl[];
  visibles: OplLineaInteractiva[];
  visiblesPorId: Set<string>;
  primeraVisibleSeleccionada: OplLineaInteractiva | null;
  numeracionVisible: boolean;
  minimizado: boolean;
  bloquesColapsados: Set<string>;
  editorLibre: boolean;
  textoLibre: string;
  previewLibre: PrevisualizacionOplReverse | null;
  seleccionarDesdeOpl: (ref: OplReferencia) => void;
  renombrarEntidadDesdeOpl: (entidadId: string, nombre: string) => void;
  renombrarEstadoDesdeOpl: (estadoId: string, nombre: string) => void;
  abrirInspectorEnlaceDesdeOpl: (enlaceId: string) => void;
  fijarFiltroOplPorSeleccion: (activo: boolean) => void;
  fijarHoverOpl: (ref: OplReferencia | null) => void;
  buscarEnPanelOpl: (texto: string) => void;
  alternarNumeracionOpl: () => void;
  minimizarOpl: () => void;
  restaurarOpl: () => void;
  alternarBloqueOplContraido: (opdId: string) => void;
  mostrarPlaceholderAiOpl: () => void;
  copiarOplActualAlPortapapeles: () => void;
  exportarOplActualHtml: () => void;
  alternarEditorLibre: () => void;
  fijarTextoLibre: (texto: string) => void;
  cancelarEditorLibre: () => void;
  aplicarEditorLibre: () => void;
}

export function usePanelOplViewModel(): PanelOplViewModel {
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

  const [editorLibre, setEditorLibre] = useState(false);
  const [textoLibre, setTextoLibre] = useState("");

  const numeracionVisible = preferenciasOpl?.oplNumeracionVisible ?? true;
  const minimizado = panelOplMinimizadoEfectivo(preferenciasOpl?.oplMinimizado, seleccionId, enlaceSeleccionId);
  const bloquesColapsados = useMemo(
    () => new Set(Object.keys(preferenciasOpl?.oplBloquesContraidos ?? {})),
    [preferenciasOpl?.oplBloquesContraidos],
  );

  const seleccionRef = useMemo<OplReferencia | null>(() => {
    if (enlaceSeleccionId) return { tipo: "enlace", id: enlaceSeleccionId };
    if (seleccionId) return { tipo: "entidad", id: seleccionId };
    return null;
  }, [enlaceSeleccionId, seleccionId]);

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
  const filtradasPorSeleccion = useMemo(
    () => filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas,
    [filtroActivo, lineas, seleccionRef],
  );
  const query = busquedaOpl.toLowerCase().trim();
  const visibles = useMemo(
    () => query
      ? filtradasPorSeleccion.filter((linea) => linea.texto.toLowerCase().includes(query))
      : filtradasPorSeleccion,
    [filtradasPorSeleccion, query],
  );
  const visiblesPorId = useMemo(() => new Set(visibles.map((linea) => linea.id)), [visibles]);
  const primeraVisibleSeleccionada = useMemo(() => {
    if (!seleccionRef) return null;
    return visibles.find((linea) => lineaTocaReferencia(linea, seleccionRef)) ?? null;
  }, [seleccionRef, visibles]);

  const alternarEditorLibre = () => {
    const siguiente = !editorLibre;
    setEditorLibre(siguiente);
    if (siguiente) setTextoLibre(textoOplActual);
  };

  const cancelarEditorLibre = () => {
    setEditorLibre(false);
    setTextoLibre("");
  };

  const aplicarEditorLibre = () => {
    aplicarEdicionOplLibre(textoLibre);
    setEditorLibre(false);
  };

  return {
    vistaMapaActiva,
    opdActivoId,
    filtroActivo,
    hoverOplRef,
    busquedaOpl,
    query,
    seleccionRef,
    lineas,
    textoOplActual,
    bloques,
    visibles,
    visiblesPorId,
    primeraVisibleSeleccionada,
    numeracionVisible,
    minimizado,
    bloquesColapsados,
    editorLibre,
    textoLibre,
    previewLibre,
    seleccionarDesdeOpl,
    renombrarEntidadDesdeOpl,
    renombrarEstadoDesdeOpl,
    abrirInspectorEnlaceDesdeOpl,
    fijarFiltroOplPorSeleccion,
    fijarHoverOpl,
    buscarEnPanelOpl,
    alternarNumeracionOpl,
    minimizarOpl,
    restaurarOpl,
    alternarBloqueOplContraido,
    mostrarPlaceholderAiOpl,
    copiarOplActualAlPortapapeles,
    exportarOplActualHtml,
    alternarEditorLibre,
    fijarTextoLibre: setTextoLibre,
    cancelarEditorLibre,
    aplicarEditorLibre,
  };
}

export function panelOplMinimizadoEfectivo(
  preferencia: boolean | undefined,
  seleccionId: Id | null,
  enlaceSeleccionId: Id | null,
): boolean {
  if (preferencia === true) return true;
  if (seleccionId || enlaceSeleccionId) return false;
  return preferencia ?? true;
}
