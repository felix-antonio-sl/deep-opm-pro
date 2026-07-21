import { useMemo, useState } from "preact/hooks";
import { useOpmStore } from "../../store";
import { useZustandOplPort } from "../ports/zustandOplPort";
import type { Id } from "../../modelo/tipos/comunes";
import type { Modelo } from "../../modelo/tipos/modelo";
import type { BloqueOpl } from "../../opl/bloquesJerarquicos";
import type { OplLineaInteractiva, OplReferencia } from "../../opl/interaccion";
import { focoPasoActualSimulacion } from "../../modelo/simulacion/foco";
import { derivarPanelOpl } from "../../opl/panel";
import type { PrevisualizacionOplReverse } from "../../opl/parser";

export interface PanelOplViewModel {
  modelo: Modelo;
  vistaMapaActiva: boolean;
  opdActivoId: Id;
  filtroActivo: boolean;
  /**
   * Codex L6 (G7): identificador canónico del elemento que filtra el panel
   * (`o.06`, `p.02`, `s.03`) o `null` para enlaces / cuando no hay selección.
   * Alimenta el chip `filtrado · <código> · N/M ✕` de la toolbar.
   */
  filtroCodigo: string | null;
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
  } = useZustandOplPort();

  const [editorLibre, setEditorLibre] = useState(false);
  const [textoLibre, setTextoLibre] = useState("");

  const numeracionVisible = preferenciasOpl?.oplNumeracionVisible ?? true;
  const minimizado = panelOplMinimizadoEfectivo(preferenciasOpl?.oplMinimizado, seleccionId, enlaceSeleccionId);
  const bloquesColapsados = useMemo(
    () => new Set(Object.keys(preferenciasOpl?.oplBloquesContraidos ?? {})),
    [preferenciasOpl?.oplBloquesContraidos],
  );

  // ¿El modelo activo es un apunte? La especie vive en el índice del workspace
  // (no en el kernel), como en CommandPalette/CintaApunte/PanelDiagnostico.
  const esApunte = useOpmStore((s) => s.indice.modelos.some((m) => m.id === s.modelo.id && m.esApunte === true));

  // Opciones de generación del panel. `esencia` es preferencia de display:
  // `textoOplActual` (canónico) se genera con esencia default dentro de
  // `derivarPanelOpl`, protegiendo el roundtrip. `esApunte` es RÉGIMEN
  // (excepción de apunte a R-ENT-2) y aplica a ambos pases: display y canónico
  // cuentan lo mismo en un boceto.
  const visibilidad = { esencia: preferenciasOpl?.oplEsenciaVisibilidad ?? "siempre", esApunte } as const;

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
      visibilidad,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [modelo, opdActivoId, seleccionId, enlaceSeleccionId, filtroActivo, busquedaOpl, editorLibre, textoLibre, visibilidad.esencia, visibilidad.esApunte],
  );

  // B0.025: id del proceso activo durante la simulacion, para que el panel OPL
  // resalte su frase sin regenerar texto. `null` cuando no se simula.
  const procesoActivoSimId = useMemo(
    () => (contextoSimulacion ? focoPasoActualSimulacion(modelo, contextoSimulacion).procesoActivoId : null),
    [modelo, contextoSimulacion],
  );

  // Codex L6 (G7): código canónico del elemento que filtra el panel, para el
  // chip de filtro activo. Se deriva del seleccionRef + modelo; null si no hay
  // filtro, si la selección es un enlace, o si no se resuelve el elemento.
  const filtroCodigo = useMemo(
    () => (filtroActivo ? codigoCanonicoSeleccion(modelo, derivado.seleccionRef) : null),
    [filtroActivo, modelo, derivado.seleccionRef],
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
    modelo,
    vistaMapaActiva,
    opdActivoId,
    filtroActivo,
    filtroCodigo,
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
    alternarEditorLibre,
    fijarTextoLibre: setTextoLibre,
    cancelarEditorLibre,
    aplicarEditorLibre,
  };
}

/**
 * Codex L6 (G7): identificador canónico del elemento seleccionado para el chip
 * de filtro. Reproduce el formato V-202 de presentación (`o.NN`/`p.NN`/`s.NN`,
 * prefijo por clase + secuencia zero-pad a 2 desde el id), sin acoplar el
 * view-model al adaptador JointJS. Enlaces no llevan código → `null`.
 */
export function codigoCanonicoSeleccion(modelo: Modelo, ref: OplReferencia | null): string | null {
  if (!ref) return null;
  if (ref.tipo === "entidad") {
    const entidad = modelo.entidades[ref.id];
    if (!entidad) return null;
    const prefijo = entidad.tipo === "proceso" ? "p" : "o";
    return `${prefijo}.${secuenciaCanonica(ref.id)}`;
  }
  if (ref.tipo === "estado") {
    if (!modelo.estados[ref.id]) return null;
    return `s.${secuenciaCanonica(ref.id)}`;
  }
  // Enlaces: sin identificador canónico de clase → el chip omite el código.
  return null;
}

function secuenciaCanonica(id: Id): string {
  const sufijo = id.includes("-") ? id.slice(id.lastIndexOf("-") + 1) : id.replace(/^[a-zA-Z]+/, "");
  const n = Number.parseInt(sufijo, 10);
  if (!Number.isFinite(n)) return sufijo || "01";
  return String(n).padStart(2, "0");
}

export function panelOplMinimizadoEfectivo(
  preferencia: boolean | undefined,
  seleccionId: Id | null,
  enlaceSeleccionId: Id | null,
): boolean {
  if (preferencia === true) return true;
  if (seleccionId || enlaceSeleccionId) return false;
  return preferencia ?? false;
}
