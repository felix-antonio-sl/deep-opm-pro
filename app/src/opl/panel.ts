import type { Id, Modelo } from "../modelo/tipos";
import { agruparOracionesPorOpd, ordenarOpdsParaOpl, type BloqueOpl } from "./bloquesJerarquicos";
import { generarOplInteractivo } from "./generar";
import {
  filtrarLineasPorReferencia,
  lineaTocaReferencia,
  type OplLineaInteractiva,
  type OplReferencia,
} from "./interaccion";
import { planificarEdicionOplLibre, type PrevisualizacionOplReverse } from "./parser";

export interface DerivarPanelOplInput {
  modelo: Modelo;
  opdActivoId: Id;
  seleccionId: Id | null;
  enlaceSeleccionId: Id | null;
  filtroActivo: boolean;
  busquedaOpl: string;
  editorLibre: boolean;
  textoLibre: string;
}

export interface PanelOplDerivado {
  query: string;
  seleccionRef: OplReferencia | null;
  lineas: OplLineaInteractiva[];
  textoOplActual: string;
  bloques: BloqueOpl[];
  visibles: OplLineaInteractiva[];
  visiblesPorId: Set<string>;
  primeraVisibleSeleccionada: OplLineaInteractiva | null;
  previewLibre: PrevisualizacionOplReverse | null;
}

export function derivarPanelOpl(input: DerivarPanelOplInput): PanelOplDerivado {
  const seleccionRef = referenciaSeleccionada(input.seleccionId, input.enlaceSeleccionId);
  const lineas = ordenarOpdsParaOpl(input.modelo).flatMap((id) => generarOplInteractivo(input.modelo, id));
  const textoOplActual = lineas.map((linea) => linea.texto).join("\n");
  const previewLibre = input.editorLibre
    ? planificarEdicionOplLibre(input.modelo, input.textoLibre, { opdActivoId: input.opdActivoId })
    : null;
  const bloques = agruparOracionesPorOpd(lineas, input.modelo);
  const filtradasPorSeleccion = input.filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas;
  const query = input.busquedaOpl.toLowerCase().trim();
  const visibles = query
    ? filtradasPorSeleccion.filter((linea) => linea.texto.toLowerCase().includes(query))
    : filtradasPorSeleccion;
  const visiblesPorId = new Set(visibles.map((linea) => linea.id));
  const primeraVisibleSeleccionada = seleccionRef
    ? visibles.find((linea) => lineaTocaReferencia(linea, seleccionRef)) ?? null
    : null;

  return {
    query,
    seleccionRef,
    lineas,
    textoOplActual,
    bloques,
    visibles,
    visiblesPorId,
    primeraVisibleSeleccionada,
    previewLibre,
  };
}

export function referenciaSeleccionada(
  seleccionId: Id | null,
  enlaceSeleccionId: Id | null,
): OplReferencia | null {
  if (enlaceSeleccionId) return { tipo: "enlace", id: enlaceSeleccionId };
  if (seleccionId) return { tipo: "entidad", id: seleccionId };
  return null;
}
