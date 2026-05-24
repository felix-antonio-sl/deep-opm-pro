import { useMemo, useState } from "preact/hooks";
import { useZustandOplPort } from "../ports/zustandOplPort";
import type { Id } from "../../modelo/tipos/comunes";
import type { BloqueOpl } from "../../opl/bloquesJerarquicos";
import type { OplLineaInteractiva, OplReferencia } from "../../opl/interaccion";
import { focoPasoActualSimulacion } from "../../modelo/simulacion/foco";
import { derivarPanelOpl } from "../../opl/panel";
import type { PrevisualizacionOplReverse } from "../../opl/parser";

export interface PanelOplViewModel {
  vistaMapaActiva: boolean;
  opdActivoId: Id;
  filtroActivo: boolean;
  hoverOplRef: OplReferencia | null;
  busquedaOpl: string;
  query: string;
  seleccionRef: OplReferencia | null;
  procesoActivoSimId: string | null;
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
  const {
    modelo,
    opdActivoId,
    vistaMapaActiva,
    contextoSimulacion,
    seleccionId,
    enlaceSeleccionId,
    filtroActivo,
    hoverOplRef,
    busquedaOpl,
    preferenciasOpl,
    seleccionarDesdeOpl,
    renombrarEntidadDesdeOpl,
    renombrarEstadoDesdeOpl,
    abrirInspectorEnlaceDesdeOpl,
    aplicarEdicionOplLibre,
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
  } = useZustandOplPort();

  const [editorLibre, setEditorLibre] = useState(false);
  const [textoLibre, setTextoLibre] = useState("");

  const numeracionVisible = preferenciasOpl?.oplNumeracionVisible ?? true;
  const minimizado = panelOplMinimizadoEfectivo(preferenciasOpl?.oplMinimizado, seleccionId, enlaceSeleccionId);
  const bloquesColapsados = useMemo(
    () => new Set(Object.keys(preferenciasOpl?.oplBloquesContraidos ?? {})),
    [preferenciasOpl?.oplBloquesContraidos],
  );

  const derivado = useMemo(
    () => derivarPanelOpl({
      modelo,
      opdActivoId,
      seleccionId,
      enlaceSeleccionId,
      filtroActivo,
      busquedaOpl,
      editorLibre,
      textoLibre,
    }),
    [modelo, opdActivoId, seleccionId, enlaceSeleccionId, filtroActivo, busquedaOpl, editorLibre, textoLibre],
  );

  // B0.025: id del proceso activo durante la simulacion, para que el panel OPL
  // resalte su frase sin regenerar texto. `null` cuando no se simula.
  const procesoActivoSimId = useMemo(
    () => (contextoSimulacion ? focoPasoActualSimulacion(modelo, contextoSimulacion).procesoActivoId : null),
    [modelo, contextoSimulacion],
  );

  const alternarEditorLibre = () => {
    const siguiente = !editorLibre;
    setEditorLibre(siguiente);
    if (siguiente) setTextoLibre(derivado.textoOplActual);
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
    query: derivado.query,
    seleccionRef: derivado.seleccionRef,
    procesoActivoSimId,
    lineas: derivado.lineas,
    textoOplActual: derivado.textoOplActual,
    bloques: derivado.bloques,
    visibles: derivado.visibles,
    visiblesPorId: derivado.visiblesPorId,
    primeraVisibleSeleccionada: derivado.primeraVisibleSeleccionada,
    numeracionVisible,
    minimizado,
    bloquesColapsados,
    editorLibre,
    textoLibre,
    previewLibre: derivado.previewLibre,
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
